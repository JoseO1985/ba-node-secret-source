const nodemailer = require('nodemailer');
import { BANON_EMAIL, USER_EMAIL, USER_PASSWORD } from '../../config/secrets';

export default class EmailNotifier {
  constructor() {
    this.sender = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: USER_EMAIL,
        pass: USER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  prepareContent(license, file) {
    return {
      from: BANON_EMAIL,
      // to: license.email,
      to: 'joseras811@gmail.com',
      subject: 'BAnon license',
      text: `Congratulations.`,
      html: `<h1>BAnon</h1>
                <p>Hi ${license.username}. Enjoy your freedom riding a bike!</p>`,
      attachments: [
        {
          filename: file.fileName,
          path: file.fullPath,
          cid: file.fileName,
        },
      ],
    };
  }

  prepareHTMLContent(html) {
    return {
      from: BANON_EMAIL,
      // to: BANON_EMAIL,
      to: 'joseras811@gmail.com',
      subject: 'Nightly Report',
      text: `Last Update ${new Date()}`,
      html: html,
    };
  }

  notify(license, attachment) {
    const mail = this.prepareContent(license, attachment);
    return this.sender.sendMail(mail).catch((err) => {
      throw err;
    });
  }

  sendHtmlEmail(html) {
    const mail = this.prepareHTMLContent(html);
    return this.sender.sendMail(mail).catch((err) => {
      throw err;
    });
  }
}
