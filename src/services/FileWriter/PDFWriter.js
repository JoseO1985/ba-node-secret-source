const pdf = require('html-pdf');
import fs from 'fs';

export default class PDFWriter {
  constructor(path, templatePath) {
    this.writePath = path;
    this.template = fs.readFileSync(templatePath, 'utf8');
  }
  write(fileName, data, options = { format: 'Letter' }) {
    return new Promise((resolve, reject) => {
      if (!fileName || !this.template) {
        return reject({ message: 'Missing parameters' });
      }
      const content = this.fillTemplateVars(data);
      if (!fileName.includes(this.extension)) fileName = fileName + this.extension;
      return pdf.create(content, options).toFile(`${this.writePath}${fileName}`, function (err, res) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(res);
      });
    });
  }

  fillTemplateVars(data) {
    return this.template
      .replace('{{username}}', `Username: ${data.username}`)
      .replace('{{email}}', `Email: ${data.email}`)
      .replace('{{phone}}', `Phone: ${data.phone}`)
      .replace('{{date}}', `Date: ${new Date(data.date).toLocaleDateString('en-US')}`)
      .replace('{{partner}}', `Partner: ${data.partner}`);
  }

  get extension() {
    return '.pdf';
  }
}
