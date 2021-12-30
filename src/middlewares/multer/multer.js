import { NODE_PATH } from '../../config/secrets';

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, NODE_PATH + '/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const csvExtension = (req, file, cb) => {
  if (file.mimetype.includes('csv')) cb(null, true);
  else cb('CSV file not found', false);
};

const multerUploader = multer({ storage: storage, fileFilter: csvExtension });

export default multerUploader;
