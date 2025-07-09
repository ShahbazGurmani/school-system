const User = require('../models/User');
const StudentDetail = require('../models/StudentDetail');

exports.getAllStudents = async (req, res) => {
  try {
    // Get all users with role student
    const users = await User.find({ role: 'student' });
    // Get all StudentDetail docs and map by user._id
    const details = await StudentDetail.find()
      .populate('user')
      .populate('class');
    const detailsMap = new Map(details.map(d => [d.user._id.toString(), d]));

    // Build unified list
    const result = users.map(user => {
      const detail = detailsMap.get(user._id.toString());
      if (detail) {
        return {
          _id: detail._id,
          user,
          class: detail.class,
        };
      } else {
        return {
          _id: user._id,
          user,
          class: null,
        };
      }
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await StudentDetail.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = new StudentDetail(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await StudentDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await StudentDetail.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStudentsWithDetails = async (req, res) => {
  try {
    const students = await StudentDetail.find()
      .populate('user')
      .populate('class');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStudentWithDetails = async (req, res) => {
  try {
    const { name, email, phoneNumber, gender, password, classId } = req.body;
    // 1. Create user (no classId in user)
    const user = new User({ name, email, phoneNumber, gender, password, role: 'student' });
    await user.save();
    // 2. Create student detail with user and class
    const studentDetail = new StudentDetail({ user: user._id, class: classId });
    await studentDetail.save();
    res.status(201).json(await studentDetail.populate('user class'));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStudentWithDetails = async (req, res) => {
  try {
    const { name, email, phoneNumber, gender, password, classId } = req.body;
    // Update user
    const studentDetail = await StudentDetail.findById(req.params.id);
    if (!studentDetail) return res.status(404).json({ error: 'Student not found' });
    await User.findByIdAndUpdate(studentDetail.user, { name, email, phoneNumber, gender, ...(password && { password }) });
    // Update student detail
    studentDetail.class = classId;
    await studentDetail.save();
    res.json(await studentDetail.populate('user class'));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteStudentWithDetails = async (req, res) => {
  try {
    // Try to find StudentDetail by ID or by user
    let studentDetail = await StudentDetail.findById(req.params.id);
    if (!studentDetail) {
      studentDetail = await StudentDetail.findOne({ user: req.params.id });
    }

    if (studentDetail) {
      // Remove from class if needed (optional, if you add students array to class)
      if (studentDetail.class) {
        const Class = require('../models/Class');
        await Class.updateOne(
          { _id: studentDetail.class },
          { $pull: { students: studentDetail._id } }
        );
      }
      await StudentDetail.findByIdAndDelete(studentDetail._id);
      await User.findByIdAndDelete(studentDetail.user);
      return res.json({ message: 'Student and details deleted' });
    } else {
      // No StudentDetail, just delete the user
      await User.findByIdAndDelete(req.params.id);
      return res.json({ message: 'User deleted (no StudentDetail found)' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign a class to a student
exports.assignClassToStudent = async (req, res) => {
  try {
    const { id } = req.params; // This could be StudentDetail._id or User._id
    const { classId } = req.body;

    let studentDetail = await StudentDetail.findById(id);

    // If not found, try to find by user
    if (!studentDetail) {
      studentDetail = await StudentDetail.findOne({ user: id });
    }

    // If still not found, create it
    if (!studentDetail) {
      studentDetail = new StudentDetail({ user: id, class: classId });
      await studentDetail.save();
      return res.json(await studentDetail.populate('user class'));
    }

    // Otherwise, just update class
    studentDetail.class = classId;
    await studentDetail.save();
    res.json(await studentDetail.populate('user class'));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllStudentUnifiedDetails = async (req, res) => {
  try {
    // Get all users with role student
    const users = await User.find({ role: 'student' });
    // Get all StudentDetail docs and map by user._id
    const details = await StudentDetail.find()
      .populate('user')
      .populate('class');
    const detailsMap = new Map(details.map(d => [d.user._id.toString(), d]));

    // Build unified list
    const result = users.map(user => {
      const detail = detailsMap.get(user._id.toString());
      if (detail) {
        return {
          _id: detail._id,
          user,
          class: detail.class,
        };
      } else {
        return {
          _id: user._id,
          user,
          class: null,
        };
      }
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudentCoursesAndTeachers = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { classId, courses, teachers } = req.body;
    const studentDetail = await StudentDetail.findByIdAndUpdate(
      studentId,
      { class: classId, courses, teachers },
      { new: true }
    );
    if (!studentDetail) return res.status(404).json({ error: 'Student not found' });
    res.json(studentDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentsByClassId = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await StudentDetail.find({ class: classId })
      .populate('user')
      .populate('class');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 