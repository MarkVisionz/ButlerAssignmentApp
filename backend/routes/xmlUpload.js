const express = require('express');
const multer = require('multer');
const { processXML } = require('../controllers/xmlController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), processXML);

module.exports = router;
