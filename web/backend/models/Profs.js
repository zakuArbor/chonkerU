const mongoose = require('mongoose');

const ProfsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('profs', ProfsSchema);
