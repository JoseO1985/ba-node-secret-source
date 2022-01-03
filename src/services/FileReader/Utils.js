import { promises as Fs } from 'fs';

export default class FileUtils {
  static async exists(path) {
    try {
      await Fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
}
