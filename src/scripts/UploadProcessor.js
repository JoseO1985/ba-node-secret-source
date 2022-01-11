import Upload from '../models/Upload';
import License from '../models/License';
import EmailValidator from '../services/Validation/EmailValidator';
import LicenseHelper from '../services/License/LicenseHelper';

export default class UploadProcessor {
  constructor(reader, writer, notifier) {
    this.fileReader = reader;
    this.fileWriter = writer;
    this.notifier = notifier;
  }

  async processPendingUploads() {
    try {
      console.log('Script [processPendingUploads] started.');
      const pendingUploads = await Upload.find({ processed: false });
      for (let file of pendingUploads) {
        const fileName = file.filename;
        const parsedRows = await this.fileReader.parse(file);

        const filteredRows = await this.filterValidRows(parsedRows);
        if (filteredRows.length > 0) {
          const licenses = await License.insertMany(filteredRows, { ordered: false }).catch((err) => {
            console.log(err);
          });
          if (licenses) {
            await this.completeUpload(fileName);
            await this.sendLicenseEmails(licenses);
          }
        }
      }
      console.log('Script [processPendingUploads] ended.');
    } catch (err) {
      //console.log(err.message);
      throw err;
    }
  }

  completeUpload(fileName) {
    return Upload.findOneAndUpdate({ filename: fileName }, { processed: true }, { useFindAndModify: false });
  }

  async filterValidRows(parsedRows) {
    const validLicenses = parsedRows.filter((license) => EmailValidator.isValid(license.email));
    const noDuplicates = this.removeDuplicates(validLicenses);
    const storedLicensePromises = noDuplicates.map((license) => License.findOne({ email: license.email }));
    const storedLicenses = await Promise.all(storedLicensePromises);
    const result =
      storedLicenses.length > 0
        ? validLicenses.filter((valid) =>
            storedLicenses.every((stored) => !stored || (stored.email !== valid.email && stored.phone !== valid.phone))
          )
        : validLicenses;
    return result;
  }

  removeDuplicates(parsedRows) {
    return parsedRows.filter((rowA, idx1) =>
      parsedRows.every((rowB, idx2) => idx1 == idx2 || (rowA.email !== rowB.email && rowA.phone !== rowB.phone))
    );
  }

  async sendLicenseEmails(licenses) {
    for (let license of licenses) {
      const fileName = LicenseHelper.generateFileName(license.email, this.fileWriter.extension);
      const pdf = await this.fileWriter.write(fileName, license);
      if (pdf) {
        const notification = await this.notifier.notify(license, { fileName, fullPath: pdf.filename });
        console.log({ notification });
        if (notification) {
          const currentDate = Date.now();
          await License.findOneAndUpdate({ email: license.email }, { sent: currentDate }, { useFindAndModify: false }).catch(
            (err) => {
              console.log(err);
            }
          );
        }
      }
    }
  }
}
