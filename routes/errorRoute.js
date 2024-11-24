const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

// Use the controller's trigger500 function
router.get('/trigger500', errorController.trigger500);

module.exports = router;
