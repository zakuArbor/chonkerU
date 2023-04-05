const mongoose = require('mongoose');

const ProfsSchema = new mongoose.Schema({
  prof: {
    type: String,
    required: true
  },
},
{collection: 'prof'}
);

module.exports = mongoose.model('prof', ProfsSchema);
