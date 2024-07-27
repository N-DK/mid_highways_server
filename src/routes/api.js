const express = require('express');
const router = express.Router();
const api = require('../app/controllers/APIController');

router.post('/highways', api.insertHighway);
router.post('/trunk', api.insertTrunk);
router.get('/highways', api.getHighways);
router.get('/highways/get-all', api.getAllHighways);
router.get('/trunk/get-all', api.getAllTrunks);
router.get('/', api.index);

module.exports = router;
