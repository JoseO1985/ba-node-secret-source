const csv = require('fast-csv');
import fs from 'fs';
import path from 'path';

export default class CSVReader {
  constructor(path) {
    this.uploadPath = path;
  }

  parse(file) {
    return new Promise((resolve, reject) => {
      try {
        const csvData = [];
        const fullPath = path.join(this.uploadPath, file.filename);
        const partner = file.originalname.replace('.csv', '');
        const readStream = fs.createReadStream(fullPath);
        readStream.on('error', (err) => {
          reject(err);
        });
        readStream
          .pipe(csv.parse({ headers: true }))
          .on('data', (row) => {
            csvData.push({
              ...row,
              partner,
              date: new Date(row.date),
            });
          })
          .on('end', () => {
            resolve(csvData);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}
