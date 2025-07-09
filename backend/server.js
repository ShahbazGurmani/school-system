const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const studentRoutes = require('./routes/students');
const subjectRoutes = require('./routes/subjects');
const gradeRoutes = require('./routes/grades');
const userRoutes = require('./routes/users');
const classRoutes = require('./routes/classes');
const teacherAssignmentRoutes = require('./routes/teacherAssignments');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/teacher-assignments', teacherAssignmentRoutes);

app.use(errorHandler);

// Welcome API
app.get('/', (req, res) => {
  res.send('🎉 Welcome to the Student Grading System API!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 