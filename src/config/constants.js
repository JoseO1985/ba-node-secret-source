const { NODE_PATH } = process.env;

const UPLOAD_PATH = NODE_PATH + '/uploads/';
const LICENSE_PDF_PATH = NODE_PATH + '/assets/licenses/';
const PDF_TEMPLATE_PATH = NODE_PATH + '/assets/templates/license.html';

export { NODE_PATH, UPLOAD_PATH, LICENSE_PDF_PATH, PDF_TEMPLATE_PATH };
