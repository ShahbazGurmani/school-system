import React, { useContext, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { UserContext } from '@/contexts/UserContext';
import { getSubjectsByClassId } from '@/api/courses';

interface GradeRow {
  subject: { name: string };
  gradeLetter: string;
}

function gradeLetterToPoints(letter: string): number {
  switch (letter) {
    case 'A': return 4;
    case 'B': return 3;
    case 'C': return 2;
    case 'D': return 1;
    default: return 0;
  }
}

function pointsToGradeLetter(points: number): string {
  if (points >= 3.75) return 'A';
  if (points >= 2.75) return 'B';
  if (points >= 1.75) return 'C';
  if (points >= 0.75) return 'D';
  return 'F';
}

const StudentDashboard: React.FC = () => {
  const { user } = useContext(UserContext);
  const [totalSubjects, setTotalSubjects] = useState<number>(0);
  const [averageGrade, setAverageGrade] = useState<string>('N/A');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    // First, get the student's classId from the grades API
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/grades/student/user/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch grades');
        return res.json();
      })
      .then(async data => {
        // Get classId from the response
        const classId = data.class?._id;
        let subjectsCount = 0;
        if (classId) {
          try {
            const subjects = await getSubjectsByClassId(classId);
            subjectsCount = Array.isArray(subjects) ? subjects.length : 0;
          } catch (e) {
            setError('Failed to fetch subjects for class');
          }
        }
        setTotalSubjects(subjectsCount);
        // Average grade logic as before
        const grades: GradeRow[] = Array.isArray(data.grades)
          ? data.grades.map((g: GradeRow) => ({ subject: g.subject, gradeLetter: g.gradeLetter }))
          : [];
        const gradePoints = grades.map(g => gradeLetterToPoints(g.gradeLetter));
        if (gradePoints.length > 0) {
          const avg = gradePoints.reduce((a, b) => a + b, 0) / gradePoints.length;
          setAverageGrade(pointsToGradeLetter(avg));
        } else {
          setAverageGrade('N/A');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch grades');
        setLoading(false);
      });
  }, [user]);

  return (
    <Layout role="student" title="Dashboard" subtitle="Welcome to your student dashboard">
      <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded p-6 text-center">
            <div className="text-gray-500 text-sm mb-2">Total Subjects</div>
            <div className="text-3xl font-bold text-indigo-600">
              {loading ? '...' : error ? '-' : totalSubjects}
            </div>
          </div>
          <div className="bg-white shadow-md rounded p-6 text-center">
            <div className="text-gray-500 text-sm mb-2">Average Grade</div>
            <div className="text-3xl font-bold text-blue-500">
              {loading ? '...' : error ? '-' : averageGrade}
            </div>
          </div>
        </div>
        {/* Recent Activity (keep dummy for now) */}
        <div className="bg-white shadow-md rounded p-6">
          <div className="text-lg font-semibold mb-4">Recent Activity</div>
          <ul className="divide-y divide-gray-200">
            {/* Keep dummy activities for now */}
            <li className="py-2 flex items-center justify-between">
              <span className="text-gray-700">Submitted Assignment: Math Homework 3</span>
              <span className="text-xs text-gray-400">2024-06-01</span>
            </li>
            <li className="py-2 flex items-center justify-between">
              <span className="text-gray-700">Scored 92% in English Quiz</span>
              <span className="text-xs text-gray-400">2024-05-28</span>
            </li>
            <li className="py-2 flex items-center justify-between">
              <span className="text-gray-700">Attended Physics Lab</span>
              <span className="text-xs text-gray-400">2024-05-25</span>
            </li>
            <li className="py-2 flex items-center justify-between">
              <span className="text-gray-700">Submitted Assignment: Biology Project</span>
              <span className="text-xs text-gray-400">2024-05-20</span>
            </li>
            <li className="py-2 flex items-center justify-between">
              <span className="text-gray-700">Scored 88% in Physics Test</span>
              <span className="text-xs text-gray-400">2024-05-18</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
