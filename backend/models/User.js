const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'principal'], default: 'student' },
});

module.exports = mongoose.model('User', userSchema); 