import fs from 'fs';
import { LICENSE_PDF_PATH } from '../../config/constants';
import FileUtils from '../FileReader/Utils';
export default class LicenseHelper {
  static async getFileFromFileSystem(email, extension = '.pdf') {
    const fileName = LicenseHelper.generateFileName(email, extension);
    const fullPath = `${LICENSE_PDF_PATH}${fileName}`;
    const fileExists = await FileUtils.exists(fullPath);
    return fileExists ? fs.readFileSync(fullPath) : null;
  }

  static generateFileName(email, extension) {
    return email.replace('@', '_').replace('.', '_') + extension;
  }
}
