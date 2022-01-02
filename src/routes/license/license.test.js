import supertest from 'supertest';
import { getTestableApi } from '../../tests/utils';

import { licenseRouter } from './license';
import Upload from '../../models/Upload';
import multerUploader from '../../middlewares/multer/multer';

const app = getTestableApi('/license', licenseRouter);
const api = supertest(app);

let mockUploadedFile = [
  {
    originalname: 'partner01.txt',
    mimetype: 'text/csv',
    filename: '1640900262126-partner01.csv',
    path: 'src\\uploads\\1640900262126-partner01.csv',
  },
];

jest.mock('../../models/Upload');
jest.mock('../../middlewares/multer/multer', () => {
  const originalMulter = jest.requireActual('../../middlewares/multer/multer');
  return {
    ...originalMulter,
    single: () => {
      return (req, res, next) => {
        req.file = mockUploadedFile;
        next();
      };
    },
  };
});

describe('/upload-csv', () => {
  test('returns status 200 if the uploaded file is valid', async () => {
    Upload.create.mockReturnValueOnce({
      originalname: 'partner01.csv',
      filename: '1640902140933-partner01.csv',
      processed: false,
      id: '61ce2dff8f33a8338474ee5d',
    });
    const file = Buffer.from('file content');
    await api
      .post('/license/upload-csv')
      .send({ file: file })
      //.attach('file', './src/uploads/1640899018344-partner01.csv')
      .expect(200)
      .expect({
        originalname: 'partner01.csv',
        filename: '1640902140933-partner01.csv',
        processed: false,
        id: '61ce2dff8f33a8338474ee5d',
      });
  });

  test('returns status 400 if an error is thrown inside body function', async () => {
    Upload.create.mockImplementation(() => {
      throw new Error();
    });
    const file = Buffer.from('file content');
    await api.post('/license/upload-csv').send({ file: file }).expect(400);
  });

  test('returns status 400 if uploaded file is invalid', async () => {
    Upload.create.mockReturnValueOnce({});
    mockUploadedFile = null;
    const file = Buffer.from('file content');
    await api.post('/license/upload-csv').send({ file: file }).expect(400).expect({ message: 'Error uploading file' });
  });
});
