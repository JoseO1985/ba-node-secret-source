import Upload from '../models/Upload';
import License from '../models/License';
import UploadProcessor from './UploadProcessor';
import CSVReader from '../services/FileReader/CSVReader';
import PDFWriter from '../services/FileWriter/PDFWriter';
import EmailNotifier from '../services/Notification/EmailNotifier';
import { UPLOAD_PATH, LICENSE_PDF_PATH, PDF_TEMPLATE_PATH } from '../config/constants';

jest.mock('../models/Upload');
jest.mock('../models/License');
jest.mock('../services/FileReader/CSVReader');
jest.mock('../services/FileWriter/PDFWriter');
jest.mock('../services/Notification/EmailNotifier');

describe('UploadProcessor', () => {
  const mockFile = { filename: 'partner01.csv' };
  const mockUploadData = [mockFile];
  const mockLicenseData = [{ username: 'user01', email: 'user01@gmail.com' }];

  const csvReader = new CSVReader(UPLOAD_PATH);
  const pdfWriter = new PDFWriter(LICENSE_PDF_PATH, PDF_TEMPLATE_PATH);
  const emailNotifier = new EmailNotifier();

  csvReader.parse.mockReturnValueOnce(mockUploadData);
  const uploadProcessor = new UploadProcessor(csvReader, pdfWriter, emailNotifier);

  test('should run ProcessPendingUploads and complete workflow', async () => {
    Upload.find.mockReturnValueOnce(mockUploadData);
    License.insertMany.mockReturnValueOnce(mockLicenseData);
    uploadProcessor.fileReader.parse.mockReturnValueOnce(mockUploadData);
    uploadProcessor.completeUpload = jest.fn();
    uploadProcessor.filterValidRows = jest.fn().mockReturnValueOnce(mockUploadData);
    uploadProcessor.sendLicenseEmails = jest.fn();

    await uploadProcessor.processPendingUploads();

    expect(Upload.find).toBeCalledWith({ processed: false });
    expect(uploadProcessor.fileReader.parse).toBeCalledWith(mockFile);
    expect(License.insertMany).toBeCalledWith(mockUploadData);
    expect(uploadProcessor.completeUpload).toBeCalledWith(mockFile.filename);
    expect(uploadProcessor.sendLicenseEmails).toBeCalledWith(mockLicenseData);
  });

  test('should run ProcessPendingUploads and throw error', async () => {
    expect.assertions(5);
    Upload.find.mockImplementation(() => {
      throw new Error('error!');
    });
    await expect(uploadProcessor.processPendingUploads).rejects.toThrowError();

    Upload.find.mockReturnValueOnce(mockUploadData);
    uploadProcessor.fileReader.parse = jest.fn().mockImplementation(() => {
      throw new Error('error!');
    });
    await expect(uploadProcessor.processPendingUploads.bind(uploadProcessor)).rejects.toThrowError();

    uploadProcessor.fileReader.parse.mockReturnValueOnce(mockUploadData);
    uploadProcessor.filterValidRows = jest.fn().mockImplementation(() => {
      throw new Error('error!');
    });
    await expect(uploadProcessor.processPendingUploads.bind(uploadProcessor)).rejects.toThrowError();

    uploadProcessor.filterValidRows.mockReturnValueOnce(mockUploadData);
    License.insertMany.mockImplementation(() => {
      throw new Error('error!');
    });
    await expect(uploadProcessor.processPendingUploads.bind(uploadProcessor)).rejects.toThrowError();

    License.insertMany.mockReturnValueOnce(mockLicenseData);
    uploadProcessor.completeUpload = jest.fn().mockImplementation(() => {
      throw new Error('error!');
    });
    await expect(uploadProcessor.processPendingUploads.bind(uploadProcessor)).rejects.toThrowError();
  });
});
