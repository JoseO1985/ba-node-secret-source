import { Router } from 'express';
import Upload from '../../models/Upload';
import multerUploader from '../../middlewares/multer/multer';
import LicenseHelper from '../../services/License/LicenseHelper';

const upload = multerUploader.single('file');
export const licenseRouter = Router();

licenseRouter.post('/upload-csv', (req, res) => {
  upload(req, res, async function (err) {
    if (err || !req.file) {
      res.status(400).json({ message: 'Error uploading file' });
    } else {
      try {
        const { originalname, filename, size } = req.file;
        const uploadedFile = await Upload.create({ originalname, filename, size, processed: false });
        res.send(uploadedFile);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  });
});

licenseRouter.get('/', async (req, res) => {
  try {
    if (!req.query.email) return res.status(400).json({ message: 'Missing parameters' });
    const { email } = req.query;
    const file = await LicenseHelper.getFileFromFileSystem(email).catch((err) => {
      console.log(err);
    });
    if (!file) return res.status(400).json({ error: 'License not found' });
    res.contentType('application/pdf');
    res.send(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
