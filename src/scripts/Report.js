import Upload from '../models/Upload';

export default class Report {
  constructor(notifier) {
    this.notifier = notifier;
  }

  async sendNightlySummary(date) {
    try {
      console.log('Script [sendUsageSummary] started.');
      const lastDay = new Date(date.getTime() - 24 * 60 * 60 * 1000);
      const uploads = await Upload.find({ processed: true, createdAt: { $lt: date, $gte: lastDay } });
      if (uploads.length > 0) {
        const htmlData = this.formatUploadTable(uploads);
        await this.notifier.sendHtmlEmail(htmlData);
      }
      console.log('Script [sendUsageSummary] ended.');
    } catch (err) {
      throw err;
    }
  }

  formatUploadTable(uploads) {
    const rows = uploads.reduce((prev, current) => {
      prev += `<tr>
           <td>${current.filename}</td>
           <td>${current.originalname.replace('.csv', '')}</td>
           <td>${current.size}</td>
           <td>${new Date(current.createdAt).toLocaleDateString('en-US')}</td>
         </tr>`;
      return prev;
    }, '');

    return `
    <h1>Nightly Summary</h1>
    <table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Partner</th>
          <th>Size</th>
          <th>Date</th>
        </tr>
       </thead>
       <tbody>
         ${rows}
       </tbody>
    </table>`;
  }
}
