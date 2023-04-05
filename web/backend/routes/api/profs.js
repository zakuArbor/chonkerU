const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Profs = require('../../models/Profs');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    GET api/profs
// @desc     Get all profs
// @access   Private
router.get('/', auth, async (req, res) => {
  console.log("on profs");
  try {
    const profs = await Profs.find().sort();
    res.json(profs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profs/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const prof = await Profs.findById(req.params.id);

    if (!prof) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(prof);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

module.exports = router;
