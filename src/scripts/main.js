import { CronJob } from 'cron';
import dbConnection from '../db/connection';
import UploadProcessor from './UploadProcessor';
import CSVReader from '../services/FileReader/CSVReader';
import PDFWriter from '../services/FileWriter/PDFWriter';
import EmailNotifier from '../services/Notification/EmailNotifier';
import { UPLOAD_PATH, PDF_TEMPLATE_PATH, LICENSE_PDF_PATH } from '../config/constants';

export default class ScheduledTasks {
  static initAll() {
    console.log('Starting all scripts');
    dbConnection.connect().then(() => {
      ScheduledTasks.initProcessor();
    });
  }

  static initProcessor() {
    const csvReader = new CSVReader(UPLOAD_PATH);
    const pdfWriter = new PDFWriter(LICENSE_PDF_PATH, PDF_TEMPLATE_PATH);
    const emailNotifier = new EmailNotifier();

    const uploadProcessor = new UploadProcessor(csvReader, pdfWriter, emailNotifier);
    const task = new CronJob({
      cronTime: '0 0/1 * * * *',
      onTick: () => {
        uploadProcessor.processPendingUploads();
      },
      start: true,
    });
    task.start();
  }
}
