const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
});

module.exports = mongoose.model('Class', classSchema); 