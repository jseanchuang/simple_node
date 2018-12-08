const express = require('express');
const router = express.Router();
const txPool = require('../src/txPool.js');
const block = require('../src/blocks');

router.post('/', async (req, res, next) => {
  if (req.body.from && typeof req.body.from == "string" &&
    req.body.to && typeof req.body.to == "string" &&
    typeof req.body.value == "number" && req.body.value > 0) {
    try {
      let tx = txPool.add(req.body);
      res.status(200).json(tx);
    } catch (err) {
      res.status(400).json({
        msg: err.message
      });
    }
  } else {
    res.status(400).json({
      msg: 'Input tx with wrong format.'
    });
  }

});

router.get('/:hash', async (req, res, next) => {
  res.status(200).json(block.getTransaction(req.params.hash));
});


module.exports = router;