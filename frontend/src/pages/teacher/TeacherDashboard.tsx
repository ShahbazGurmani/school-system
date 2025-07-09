import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/contexts/UserContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Users, BookOpen } from 'lucide-react';
import { getTeacherClassesWithDetails, getClassesForTeacher, getTeacherAGradeStudents } from '@/api/teacherAssignments';

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
  const { user } = useContext(UserContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const gradesByClass = dummyGradesByClass;
  const [coursesCount, setCoursesCount] = useState(0);
  const [aGradeStudents, setAGradeStudents] = useState([]);
  const [aGradeLoading, setAGradeLoading] = useState(false);
  const [aGradeError, setAGradeError] = useState<string | null>(null);

  // Fetch classes for teacher (for students count)
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    getTeacherClassesWithDetails(user.id)
      .then((data) => {
        setClasses(data);
        setSelectedClass(data[0]?._id || '');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch classes');
        setLoading(false);
      });
  }, [user]);

  // Fetch assignments for teacher (for courses count)
  useEffect(() => {
    if (!user) return;
    getClassesForTeacher(user.id)
      .then((assignments) => {
        const courseSet = new Set();
        assignments.forEach((a) => {
          if (a.course && (a.course._id || a.course.name)) {
            courseSet.add(a.course._id || a.course.name);
          }
        });
        setCoursesCount(courseSet.size);
      })
      .catch(() => setCoursesCount(0));
  }, [user]);

  // Fetch A grade students for teacher
  useEffect(() => {
    if (!user) return;
    setAGradeLoading(true);
    setAGradeError(null);
    getTeacherAGradeStudents(user.id)
      .then(setAGradeStudents)
      .catch(err => setAGradeError(err.message || 'Failed to fetch A grade students'))
      .finally(() => setAGradeLoading(false));
  }, [user]);

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

  // Students count (for selected class)
  const studentsCount = selectedClassObj?.students?.length ?? '-';

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
              <div className="text-3xl font-bold text-gray-900">{loading ? '...' : studentsCount}</div>
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
              <div className="text-3xl font-bold text-gray-900">{loading ? '...' : coursesCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* A Grade Students */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>A Grade Students (All Courses & Classes)</CardTitle>
          </CardHeader>
          <CardContent>
            {aGradeLoading ? (
              <div>Loading...</div>
            ) : aGradeError ? (
              <div className="text-red-500">{aGradeError}</div>
            ) : aGradeStudents.length === 0 ? (
              <div className="text-gray-500">No A grade students found.</div>
            ) : (
              <div style={{ maxHeight: aGradeStudents.length > 3 ? 260 : 'auto', overflowY: aGradeStudents.length > 3 ? 'auto' : 'visible' }}>
                <ul className="divide-y divide-gray-200">
                  {aGradeStudents.map((g) => (
                    <li key={g._id} className="py-3 flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium text-gray-800">{g.student?.user?.name || 'Unknown Student'}</div>
                        <div className="text-xs text-gray-500">
                          Subject: {g.subject?.name || 'Unknown'} | Class: {g.class?.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Assignment: {g.assignmentMarks?.[g.assignmentMarks.length-1] ?? '-'} | Quiz: {g.quizMarks?.[g.quizMarks.length-1] ?? '-'} | Paper: {g.paperMarks?.[g.paperMarks.length-1] ?? '-'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total: {((g.assignmentMarks?.[g.assignmentMarks.length-1] ?? 0) + (g.quizMarks?.[g.quizMarks.length-1] ?? 0) + (g.paperMarks?.[g.paperMarks.length-1] ?? 0))}/100
                        </div>
                        <div className="text-xs text-blue-700 font-semibold mt-1">
                          Grade: {g.gradeLetter || '-'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performers */}
        {/* <Card className="shadow-xl border-0">
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
        </Card> */}

        {/* Student Performance Bar Chart (Top Rated Student) */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Student Performance (Top Rated Highlighted)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aGradeStudents.map(g => ({
                studentName: g.student?.user?.name || 'Unknown',
                total: (g.assignmentMarks?.[g.assignmentMarks.length-1] ?? 0) + (g.quizMarks?.[g.quizMarks.length-1] ?? 0) + (g.paperMarks?.[g.paperMarks.length-1] ?? 0)
              }))} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="studentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#6366F1" />
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
              {aGradeStudents.map((g) => (
                <option key={g._id} value={g.student?._id}>{g.student?.user?.name || 'Unknown'}</option>
              ))}
            </select>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={
                selectedStudent
                  ? aGradeStudents
                      .filter(g => g.student?._id === selectedStudent)
                      .map((g, idx) => ({
                        label: `${g.subject?.name || 'Subject'} #${idx + 1}`,
                        assignment: g.assignmentMarks?.[g.assignmentMarks.length-1] ?? 0,
                        quiz: g.quizMarks?.[g.quizMarks.length-1] ?? 0,
                        paper: g.paperMarks?.[g.paperMarks.length-1] ?? 0,
                        total: (g.assignmentMarks?.[g.assignmentMarks.length-1] ?? 0) + (g.quizMarks?.[g.quizMarks.length-1] ?? 0) + (g.paperMarks?.[g.paperMarks.length-1] ?? 0)
                      }))
                  : []
              } margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="assignment" fill="#6366F1" name="Assignment" />
                <Bar dataKey="quiz" fill="#34D399" name="Quiz" />
                <Bar dataKey="paper" fill="#F59E42" name="Paper" />
                <Bar dataKey="total" fill="#3B82F6" name="Total" />
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
            {aGradeStudents.length === 0 ? (
              <div className="py-3 text-gray-500">No A grade data available.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {Array.from(
                  aGradeStudents.reduce((acc, g) => {
                    if (!g.subject?._id) return acc;
                    if (!acc.has(g.subject._id)) acc.set(g.subject._id, { subject: g.subject.name, count: 0, totalSum: 0 });
                    const total = (g.assignmentMarks?.[g.assignmentMarks.length-1] ?? 0) + (g.quizMarks?.[g.quizMarks.length-1] ?? 0) + (g.paperMarks?.[g.paperMarks.length-1] ?? 0);
                    acc.get(g.subject._id).count++;
                    acc.get(g.subject._id).totalSum += total;
                    return acc;
                  }, new Map()),
                ).map(([id, { subject, count, totalSum }]) => (
                  <li key={id} className="py-3 flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-800">{subject}</div>
                      <div className="text-xs text-gray-500">A Grade Students: {count}</div>
                      <div className="text-xs text-gray-500">Avg Total Marks: {count ? Math.round(totalSum / count) : 0}/100</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
