import { CronJob } from 'cron';
import dbConnection from '../db/connection';
import UploadProcessor from './UploadProcessor';
import CSVReader from '../services/FileReader/CSVReader';
import { UPLOAD_PATH } from '../config/constants';

export default class ScheduledTasks {
  static initAll() {
    console.log({ __basedir });
    console.log('Starting all scripts');
    dbConnection.connect().then(() => {
      ScheduledTasks.initProcessor();
    });
  }

  static initProcessor() {
    const csvReader = new CSVReader(UPLOAD_PATH);

    const uploadProcessor = new UploadProcessor(csvReader);
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
