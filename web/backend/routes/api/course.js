const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Course = require('../../models/Course');
const Prof = require('../../models/Profs');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    GET api/courses
// @desc     Get all courses
// @access   Private
router.get('/', auth, async (req, res) => {
  console.log("on courses");
  try {
    const coursess = await Courses.find().sort();
    res.json({'payload': courses});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/courses/:query
// @desc     Get all courses based on query
// @access   Private
router.get('/:query', auth, async (req, res) => {
  try {
//    const prof = await Profs.find({"$text": { '$search' : req.params.query}});
    const queryRegex = new RegExp(req.params.params, 'i');
    const prof = await Profs.find({"$or": [
	    {code: {$regex: queryRegex}},
	    {name: {$regex: queryRegex}},
	    {desc: {$regex: queryRegex}}
    ],{ 'code': 1, 'name': name, 'desc': 1 }});

    if (!prof) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json({'payload': prof});
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});
module.exports = router;
