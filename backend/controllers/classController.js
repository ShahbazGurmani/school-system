const Class = require('../models/Class');
const TeacherAssignment = require('../models/TeacherAssignment');

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('courses');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id).populate('courses');
    if (!classObj) return res.status(404).json({ error: 'Class not found' });
    res.json(classObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const classObj = new Class(req.body);
    await classObj.save();
    res.status(201).json(classObj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const classObj = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('courses');
    if (!classObj) return res.status(404).json({ error: 'Class not found' });
    res.json(classObj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classObj = await Class.findByIdAndDelete(req.params.id);
    if (!classObj) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassCoursesAndTeachers = async (req, res) => {
  try {
    const { classId } = req.params;
    
    // First, get the class with its courses
    const classObj = await Class.findById(classId).populate('courses');
    if (!classObj) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Get teacher assignments for this class
    const teacherAssignments = await TeacherAssignment.find({ class: classId })
      .populate('teacher', 'name email')
      .populate('course', 'name code');

    // Create a map of course to teachers
    const courseTeacherMap = {};
    teacherAssignments.forEach(assignment => {
      const courseId = assignment.course._id.toString();
      if (!courseTeacherMap[courseId]) {
        courseTeacherMap[courseId] = {
          course: assignment.course,
          teachers: []
        };
      }
      courseTeacherMap[courseId].teachers.push(assignment.teacher);
    });

    // Format the response
    const coursesWithTeachers = classObj.courses.map(course => {
      const courseId = course._id.toString();
      const courseData = courseTeacherMap[courseId] || { course, teachers: [] };
      
      return {
        course: {
          _id: course._id,
          name: course.name,
          code: course.code
        },
        teachers: courseData.teachers.map(teacher => ({
          _id: teacher._id,
          name: teacher.name,
          email: teacher.email
        }))
      };
    });

    const response = {
      class: {
        _id: classObj._id,
        name: classObj.name
      },
      courses: coursesWithTeachers
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching class courses and teachers:', err);
    res.status(500).json({ error: err.message });
  }
}; 