const express = require('express');
const router = express.Router();
const block = require('../src/blocks');

router.get('/:address', async (req, res, next) => {
  res.status(200).json(block.getAddress(req.params.address));
});

module.exports = router;