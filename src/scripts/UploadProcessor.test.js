import Upload from '../models/Upload';
import License from '../models/License';
import UploadProcessor from './UploadProcessor';
import CSVReader from '../services/FileReader/CSVReader';
import UPLOAD_PATH from '../config/constants';

jest.mock('../models/Upload');
jest.mock('../models/License');
jest.mock('../services/FileReader/CSVReader');

describe('UploadProcessor', () => {
  const mockFile = { filename: 'partner01.csv' };
  const mockUploadData = [mockFile];
  const mockLicenseData = [{ username: 'user01', email: 'user01@gmail.com' }];
  const csvReader = new CSVReader(UPLOAD_PATH);
  csvReader.parse.mockReturnValueOnce(mockUploadData);
  const uploadProcessor = new UploadProcessor(csvReader);

  test('should run ProcessPendingUploads and complete workflow', async () => {
    Upload.find.mockReturnValueOnce(mockUploadData);
    License.insertMany.mockReturnValueOnce(mockLicenseData);
    uploadProcessor.fileReader.parse.mockResolvedValue(mockUploadData);
    uploadProcessor.completeUpload = jest.fn().mockReturnValueOnce(mockLicenseData);

    await uploadProcessor.processPendingUploads();

    expect(Upload.find).toBeCalledWith({ processed: false });
    expect(uploadProcessor.fileReader.parse).toBeCalledWith(mockFile);
    expect(License.insertMany).toBeCalledWith(mockUploadData);
    expect(uploadProcessor.completeUpload).toBeCalledWith(mockFile.filename);
  });

  test('should run ProcessPendingUploads and throw error', async () => {
    expect.assertions(4);
    Upload.find.mockImplementation(() => {
      throw new Error('error!');
    });
    await expect(uploadProcessor.processPendingUploads.bind(uploadProcessor)).rejects.toThrowError();

    Upload.find.mockReturnValueOnce(mockUploadData);
    uploadProcessor.fileReader.parse = jest.fn().mockImplementation(() => {
      throw new Error('error!');
    });
    await expect(uploadProcessor.processPendingUploads.bind(uploadProcessor)).rejects.toThrowError();

    uploadProcessor.fileReader.parse.mockResolvedValue(mockUploadData);
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
