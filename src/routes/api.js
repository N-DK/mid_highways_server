const express = require('express');
const router = express.Router();
const api = require('../app/controllers/APIController');

router.get('/highways', api.getHighways);
router.get('/highways/get-all', api.getAllHighways);
router.get('/', api.index);

module.exports = router;
