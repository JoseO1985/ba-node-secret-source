import { Router } from 'express';
import Upload from '../../models/Upload';
import multerUploader from '../../middlewares/multer/multer';

const upload = multerUploader.single('file');
export const licenseRouter = Router();

licenseRouter.post('/upload-csv', (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err || !req.file) {
        return res.status(400).json({ message: 'Error uploading file' });
      } else {
        const { originalname, filename, size } = req.file;
        const uploadedFile = await Upload.create({ originalname, filename, size, processed: false });
        res.send(uploadedFile);
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
