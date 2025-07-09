import React, { useEffect, useState, useContext } from 'react';
import Layout from '@/components/Layout';
import { UserContext } from '@/contexts/UserContext';

interface GradeRow {
  subject: { name: string };
  teacher: { name: string };
  gradeLetter: string;
  performance: number;
  assignment: number;
  quiz: number;
  paper: number;
}

async function fetchStudentGradesFromApi(userId: string): Promise<{ className: string; grades: GradeRow[] }> {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/grades/student/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch grades');
  const data = await res.json();
  return {
    className: data.class?.name || 'N/A',
    grades: Array.isArray(data.grades)
      ? data.grades.map((g: unknown) => {
          const grade = g as {
            subject: { name: string };
            teacher: { name: string };
            gradeLetter: string;
            assignmentMarks: number[];
            quizMarks: number[];
            paperMarks: number[];
          };
          return {
            subject: grade.subject,
            teacher: grade.teacher,
            gradeLetter: grade.gradeLetter,
            performance:
              (Array.isArray(grade.assignmentMarks) ? grade.assignmentMarks[grade.assignmentMarks.length - 1] ?? 0 : 0) +
              (Array.isArray(grade.quizMarks) ? grade.quizMarks[grade.quizMarks.length - 1] ?? 0 : 0) +
              (Array.isArray(grade.paperMarks) ? grade.paperMarks[grade.paperMarks.length - 1] ?? 0 : 0),
            assignment: Array.isArray(grade.assignmentMarks) ? grade.assignmentMarks[grade.assignmentMarks.length - 1] ?? 0 : 0,
            quiz: Array.isArray(grade.quizMarks) ? grade.quizMarks[grade.quizMarks.length - 1] ?? 0 : 0,
            paper: Array.isArray(grade.paperMarks) ? grade.paperMarks[grade.paperMarks.length - 1] ?? 0 : 0,
          };
        })
      : [],
  };
}

const StudentPerformance: React.FC = () => {
  const { user } = useContext(UserContext);
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [className, setClassName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    fetchStudentGradesFromApi(user.id)
      .then((data) => {
        setGrades(data.grades);
        setClassName(data.className);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  return (
    <Layout role="student" title="Performance" subtitle="Your subject-wise grades and teachers">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-4 text-lg font-semibold text-indigo-700">Class: {className}</div>
        <div className="bg-white shadow-md rounded p-6">
          <div className="text-lg font-semibold mb-4">Subject-wise Performance</div>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : grades.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No grades found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Teacher</th>
                    <th className="p-3 text-left">Assignment<br/><span className='text-xs text-gray-500'>(out of 15)</span></th>
                    <th className="p-3 text-left">Quiz<br/><span className='text-xs text-gray-500'>(out of 15)</span></th>
                    <th className="p-3 text-left">Paper<br/><span className='text-xs text-gray-500'>(out of 70)</span></th>
                    <th className="p-3 text-left">Performance</th>
                    <th className="p-3 text-left">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{g.subject.name}</td>
                      <td className="p-3">{g.teacher.name}</td>
                      <td className="p-3">{g.assignment}</td>
                      <td className="p-3">{g.quiz}</td>
                      <td className="p-3">{g.paper}</td>
                      <td className="p-3">{g.performance}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 rounded text-white ${g.gradeLetter === 'A' ? 'bg-purple-500' : g.gradeLetter === 'B' ? 'bg-blue-500' : g.gradeLetter === 'C' ? 'bg-yellow-500' : g.gradeLetter === 'D' ? 'bg-orange-500' : 'bg-red-500'}`}>{g.gradeLetter}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentPerformance;
