const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  name: {
    type: String
  },
},
	{collection: 'course'}
);
CourseSchema.index({code: 'text', name: 'text', desc: 'text', code: 'number'});
module.exports = mongoose.model('course', CourseSchema);
