const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const StudentDetail = require('./models/StudentDetail');

dotenv.config();

const genders = ['male', 'female', 'other'];

function randomGender() {
  return genders[Math.floor(Math.random() * genders.length)];
}

function randomPhone() {
  return '9' + Math.floor(100000000 + Math.random() * 900000000).toString();
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany({});

  const users = [];

  // 30 students
  for (let i = 1; i <= 30; i++) {
    users.push({
      name: `Student ${i}`,
      email: `student${i}@school.com`,
      phoneNumber: randomPhone(),
      gender: randomGender(),
      password: 'password123',
      role: 'student',
    });
  }

  // 7 teachers
  for (let i = 1; i <= 7; i++) {
    users.push({
      name: `Teacher ${i}`,
      email: `teacher${i}@school.com`,
      phoneNumber: randomPhone(),
      gender: randomGender(),
      password: 'teacher123',
      role: 'teacher',
    });
  }

  // 3 principals
  for (let i = 1; i <= 3; i++) {
    users.push({
      name: `Principal ${i}`,
      email: `principal${i}@school.com`,
      phoneNumber: randomPhone(),
      gender: randomGender(),
      password: 'principal123',
      role: 'principal',
    });
  }

  await User.insertMany(users);
  console.log('Seeded users!');
  mongoose.disconnect();
}

async function migrateStudentsToStudentDetails() {
  await mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME'); // <-- Replace with your DB name
  const students = await User.find({ role: 'student' });
  for (const user of students) {
    const exists = await StudentDetail.findOne({ user: user._id });
    if (!exists) {
      await StudentDetail.create({ user: user._id });
      console.log(`Created StudentDetail for user ${user.name}`);
    }
  }
  mongoose.disconnect();
}

if (require.main === module) {
  migrateStudentsToStudentDetails().then(() => {
    console.log('Migration complete.');
    process.exit(0);
  });
}

seed(); 