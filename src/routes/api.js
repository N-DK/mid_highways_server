const express = require('express');
const router = express.Router();
const api = require('../app/controllers/APIController');

router.get('/check-way', api.getHighways);
router.post('/highways', api.insertHighway);
router.post('/trunk', api.insertTrunk);
router.get('/highways/pull', api.pullHighways);
router.get('/tollboths/pull', api.pullTollBoths);
router.get('/trunks/pull', api.pullTrunks);
router.get('/trunks/import', api.importTrunks);
router.get('/highways/import', api.importHighways);
router.get('/highways/get-all', api.getAllHighways);
router.get('/trunk/get-all', api.getAllTrunks);
router.get('/', api.index);

module.exports = router;
