import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Users, BookOpen } from 'lucide-react';

// Dummy Data
const dummyClasses = [
  {
    _id: 'class1',
    name: 'Class 1',
    students: [
      { _id: 'stu1', name: 'Alice' },
      { _id: 'stu2', name: 'Bob' },
      { _id: 'stu3', name: 'Charlie' },
    ],
    subjects: [
      { _id: 'sub1', name: 'Math' },
      { _id: 'sub2', name: 'Science' },
    ],
  },
];

const dummyGradesByClass = {
  class1: [
    {
      _id: 'g1',
      student: { _id: 'stu1', name: 'Alice' },
      subject: { _id: 'sub1', name: 'Math' },
      teacher: 'teacher1',
      class: 'class1',
      assignmentMarks: [80],
      quizMarks: [85],
      paperMarks: [90],
      gradeLetter: 'A',
    },
    {
      _id: 'g2',
      student: { _id: 'stu2', name: 'Bob' },
      subject: { _id: 'sub1', name: 'Math' },
      teacher: 'teacher1',
      class: 'class1',
      assignmentMarks: [70],
      quizMarks: [75],
      paperMarks: [80],
      gradeLetter: 'B',
    },
    {
      _id: 'g3',
      student: { _id: 'stu3', name: 'Charlie' },
      subject: { _id: 'sub2', name: 'Science' },
      teacher: 'teacher1',
      class: 'class1',
      assignmentMarks: [95],
      quizMarks: [90],
      paperMarks: [92],
      gradeLetter: 'A',
    },
  ],
};

const dummyUser = { id: 'teacher1', role: 'teacher', name: 'Mr. Smith' };

// Data aggregation helpers
function calcPerformance(grade) {
  const assignment = grade.assignmentMarks.length ? grade.assignmentMarks[grade.assignmentMarks.length - 1] : 0;
  const quiz = grade.quizMarks.length ? grade.quizMarks[grade.quizMarks.length - 1] : 0;
  const paper = grade.paperMarks.length ? grade.paperMarks[grade.paperMarks.length - 1] : 0;
  return assignment + quiz + paper;
}

const TeacherDashboard = () => {
  // Use dummy data for state
  const [selectedClass, setSelectedClass] = useState('class1');
  const [selectedStudent, setSelectedStudent] = useState('');
  const classes = dummyClasses;
  const gradesByClass = dummyGradesByClass;
  const user = dummyUser;

  // --- Student Performance Bar Chart (Top Rated Student) ---
  const selectedClassObj = classes.find(c => c._id === selectedClass);
  const teacherGrades = (gradesByClass[selectedClass] || []).filter(g => g.teacher === user.id);
  // Calculate average for each student
  const studentPerformance = selectedClassObj?.students.map(student => {
    const grades = teacherGrades.filter(g => {
      const s = typeof g.student === 'string' ? g.student : g.student?._id;
      return s === student._id;
    });
    const avg = grades.length
      ? grades.map(calcPerformance).reduce((a, b) => a + b, 0) / grades.length
      : 0;
    return { studentId: student._id, studentName: student.name, avg };
  }) || [];
  const maxAvg = Math.max(...studentPerformance.map(s => s.avg), 0);
  const topStudents = studentPerformance.filter(s => s.avg === maxAvg && maxAvg > 0);

  // --- Class Performance Summary (per subject, for this teacher) ---
  const classSummary = (selectedClassObj?.subjects || []).map(subject => {
    const grades = teacherGrades.filter(g => {
      const subj = typeof g.subject === 'string' ? g.subject : g.subject?._id;
      return subj === subject._id;
    });
    const avg = grades.length
      ? grades.map(calcPerformance).reduce((a, b) => a + b, 0) / grades.length
      : 0;
    return { subject: subject.name, avgMarks: Math.round(avg) };
  });

  // --- Top Performers (Grade A, for this teacher) ---
  const topPerformers = selectedClassObj?.students.filter(student => {
    const grades = teacherGrades.filter(g => {
      const s = typeof g.student === 'string' ? g.student : g.student?._id;
      return s === student._id;
    });
    if (!grades.length) return false;
    const avg = grades.map(calcPerformance).reduce((a, b) => a + b, 0) / grades.length;
    return avg >= 90;
  }) || [];

  // Performance trends for a selected student (line chart)
  const lineChartData = (selectedClass && selectedStudent)
    ? (gradesByClass[selectedClass] || [])
        .filter(g => {
          const s = typeof g.student === 'string' ? g.student : g.student?._id;
          return s === selectedStudent;
        })
        .map((g, idx) => ({
          label: (typeof g.subject === 'string' ? g.subject : g.subject?.name) + ' #' + (idx + 1),
          performance: calcPerformance(g),
        }))
    : [];

  // Calculate unique courses (subjects) count across all classes for the teacher
  const allSubjects = classes.flatMap(cls => cls.subjects.map(sub => sub._id));
  const uniqueSubjectIds = Array.from(new Set(allSubjects));
  const coursesCount = uniqueSubjectIds.length;

  if (!user) return <div>Loading...</div>;
  if (user.role !== 'teacher') return <div>Not authorized</div>;

  return (
    <Layout role="teacher" title="Dashboard" subtitle="Welcome to your teacher dashboard">
      <div className="p-4 md:p-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">My Students</CardTitle>
              <div className="rounded-full p-2 bg-blue-500 text-white">
                <Users className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{selectedClassObj?.students?.length ?? '-'}</div>
            </CardContent>
          </Card>
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-gray-50 to-green-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Courses</CardTitle>
              <div className="rounded-full p-2 bg-green-500 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{coursesCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Top Performers (Grade A)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              {topPerformers.length === 0 ? (
                <li className="py-3 text-gray-500">No top performers yet.</li>
              ) : (
                topPerformers.map(s => (
                  <li key={s._id} className="py-3 flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-800">{s.name}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Student Performance Bar Chart (Top Rated Student) */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Student Performance (Top Rated Highlighted)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="studentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg" fill="#6366F1">
                  {studentPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.avg === maxAvg && maxAvg > 0 ? '#34D399' : '#6366F1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Trends (Line Chart) */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Performance Trends for Student</CardTitle>
            <select
              className="mt-2 border rounded p-1"
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
            >
              <option value="">Select Student</option>
              {selectedClassObj?.students?.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="performance" fill="#34D399" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Class Performance Summary (By Subject, This Teacher) */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Class Performance Summary (By Subject, This Teacher)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              {classSummary.length === 0 ? (
                <li className="py-3 text-gray-500">No data available.</li>
              ) : (
                classSummary.map(s => (
                  <li key={s.subject} className="py-3 flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-800">{s.subject}</div>
                      <div className="text-xs text-gray-500">Average Marks: {s.avgMarks}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
