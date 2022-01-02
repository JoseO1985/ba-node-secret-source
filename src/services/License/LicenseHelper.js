import fs from 'fs';
import { LICENSE_PDF_PATH } from '../../config/constants';

export default class LicenseHelper {
  static getFileFromFileSystem(email, extension = '.pdf') {
    const fileName = LicenseHelper.generateFileName(email, extension);
    return fs.readFileSync(`${LICENSE_PDF_PATH}${fileName}`);
  }

  static generateFileName(email, extension) {
    return email.replace('@', '_').replace('.', '_') + extension;
  }
}
