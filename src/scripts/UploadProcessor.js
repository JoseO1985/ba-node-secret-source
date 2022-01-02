import Upload from '../models/Upload';
import License from '../models/License';

export default class UploadProcessor {
  constructor(reader) {
    this.fileReader = reader;
  }

  async processPendingUploads() {
    try {
      //console.log('Script [processPendingUploads] started.');
      const pendingUploads = await Upload.find({ processed: false });
      for (let file of pendingUploads) {
        const fileName = file.filename;
        const parsedRows = await this.fileReader.parse(file);
        if (parsedRows.length > 0) {
          const licenses = await License.insertMany(parsedRows);
          if (licenses) {
            await this.completeUpload(fileName);
          }
        }
      }
      //console.log('Script [processPendingUploads] ended.');
    } catch (err) {
      //console.log(err);
      throw err;
    }
  }

  completeUpload(fileName) {
    return Upload.findOneAndUpdate({ filename: fileName }, { processed: true }, { useFindAndModify: false });
  }
}
