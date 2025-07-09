const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const StudentDetail = require('./models/StudentDetail');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/YOUR_DB_NAME';

async function fixStudentDetailIds() {
  await mongoose.connect(MONGO_URI);
  const broken = await StudentDetail.find({ $expr: { $eq: ['$_id', '$user'] } });
  console.log(`Found ${broken.length} StudentDetail docs with _id === user`);
  for (const doc of broken) {
    // Create new StudentDetail with new _id
    const { _id, ...rest } = doc.toObject();
    const newDoc = new StudentDetail({ ...rest, user: doc.user });
    await newDoc.save();
    await StudentDetail.deleteOne({ _id: doc._id });
    console.log(`Fixed StudentDetail for user ${doc.user}: new _id ${newDoc._id}`);
  }
  await mongoose.disconnect();
  console.log('Done.');
}

fixStudentDetailIds().catch(err => { console.error(err); process.exit(1); }); 