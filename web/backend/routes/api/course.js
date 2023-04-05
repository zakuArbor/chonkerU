const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Course = require('../../models/Course');
const Prof = require('../../models/Profs');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/courses
// @desc     Create a course
// @access   Private
router.post(
  '/',
  auth,
  check('text', 'Text is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const prof = await Prof.findById(req.prof.id).select('-password');

      const newCourse = new Course({
        text: req.body.text,
        name: prof.name,
        avatar: prof.avatar,
        prof: req.prof.id
      });

      const course = await newCourse.save();

      res.json(course);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/courses
// @desc     Get all courses
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find().sort({ date: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/courses/:id
// @desc     Get course by ID
// @access   Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/courses/:id
// @desc     Delete a course
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check prof
    if (course.prof.toString() !== req.prof.id) {
      return res.status(401).json({ msg: 'Prof not authorized' });
    }

    await course.remove();

    res.json({ msg: 'Course removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    PUT api/courses/like/:id
// @desc     Like a course
// @access   Private
router.put('/like/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    // Check if the course has already been liked
    if (course.likes.some((like) => like.prof.toString() === req.prof.id)) {
      return res.status(400).json({ msg: 'Course already liked' });
    }

    course.likes.unshift({ prof: req.prof.id });

    await course.save();

    return res.json(course.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/courses/unlike/:id
// @desc     Unlike a course
// @access   Private
router.put('/unlike/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    // Check if the course has not yet been liked
    if (!course.likes.some((like) => like.prof.toString() === req.prof.id)) {
      return res.status(400).json({ msg: 'Course has not yet been liked' });
    }

    // remove the like
    course.likes = course.likes.filter(
      ({ prof }) => prof.toString() !== req.prof.id
    );

    await course.save();

    return res.json(course.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/courses/comment/:id
// @desc     Comment on a course
// @access   Private
router.post(
  '/comment/:id',
  auth,
  checkObjectId('id'),
  check('text', 'Text is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const prof = await Prof.findById(req.prof.id).select('-password');
      const course = await Course.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: prof.name,
        avatar: prof.avatar,
        prof: req.prof.id
      };

      course.comments.unshift(newComment);

      await course.save();

      res.json(course.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/courses/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    // Pull out comment
    const comment = course.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check prof
    if (comment.prof.toString() !== req.prof.id) {
      return res.status(401).json({ msg: 'Prof not authorized' });
    }

    course.comments = course.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await course.save();

    return res.json(course.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;

