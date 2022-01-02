import CSVReader from './CSVReader';
import fs from 'fs';
const csv = require('fast-csv');
const { PassThrough } = require('stream');

jest.mock('fs');
jest.mock('fast-csv');
describe('CSVReader', () => {
  const csvReader = new CSVReader('src/uploads');
  const mockData = { date: new Date(), partner: 'partner01' };
  let mockReadStream = {
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation(function (event, handler) {
      if (event === 'data' || event === 'end') handler(mockData);
      return this;
    }),
  };

  fs.createReadStream.mockReturnValueOnce(mockReadStream);
  csv.parse.mockReturnValueOnce(mockReadStream);
  const mockFile = {
    originalname: 'partner01.csv',
    filename: 'partner01.csv',
  };
  let promise = csvReader.parse(mockFile);

  test('should run parse and resolve', async () => {
    await expect(promise).resolves.toEqual([mockData]);
  });

  test('should run parse and reject', async () => {
    mockReadStream = new PassThrough();

    fs.createReadStream.mockReturnValueOnce(mockReadStream);
    csv.parse.mockReturnValueOnce(mockReadStream);

    promise = csvReader.parse(mockFile);

    setTimeout(() => {
      mockReadStream.emit('error', 'error!');
    }, 100);
    await expect(promise).rejects.toEqual('error!');
  });
});
