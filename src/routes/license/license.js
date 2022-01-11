import { Router } from 'express';
import Upload from '../../models/Upload';
import multerUploader from '../../middlewares/multer/multer';
import LicenseHelper from '../../services/License/LicenseHelper';
import { auth, isPartner, isCyclist } from '../../middlewares/auth';
import User from '../../models/User';

export const licenseRouter = Router();

licenseRouter.post('/upload-csv', auth, isPartner, multerUploader.single('file'), async (req, res) => {
  try {
    if (!req.file) throw new Error('Missing file');
    const { originalname, filename, size } = req.file;
    const uploadedFile = await Upload.create({ originalname, filename, size, processed: false });
    res.send(uploadedFile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

licenseRouter.get('/', auth, isCyclist, async (req, res) => {
  try {
    if (!req.decoded.userId) return res.status(400).json({ message: 'Missing parameters' });
    const user = await User.findOne({ _id: req.decoded.userId });
    if (!user) throw new Error('User not found');
    const file = await LicenseHelper.getFileFromFileSystem(user.email).catch((err) => {
      console.log(err);
    });
    if (!file) return res.status(400).json({ error: 'License not found' });
    res.contentType('application/pdf');
    res.send(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
