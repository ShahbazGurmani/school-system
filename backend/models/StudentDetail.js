const mongoose = require('mongoose');

const studentDetailSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
});

module.exports = mongoose.model('StudentDetail', studentDetailSchema); 