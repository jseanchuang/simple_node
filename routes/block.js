const express = require('express');
const router = express.Router();
const blocks = require('../src/blocks');

router.get('/', async (req, res, next) => {
  res.status(200).json({
    height: blocks.getHeight(),
  });
});

router.get('/hash/:hash', async (req, res, next) => {
  let block = blocks.getBlockByHash(req.params.hash);
  res.status(200).json(block);
});

router.get('/height/:number', async (req, res, next) => {
  let block = blocks.getBlockByNumber(req.params.number);
  res.status(200).json(block);
});

module.exports = router;