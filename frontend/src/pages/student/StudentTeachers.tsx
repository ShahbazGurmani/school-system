import React, { useEffect, useState, useContext } from 'react';
import Layout from '@/components/Layout';
import { UserContext } from '@/contexts/UserContext';
import { getTeachersAndCoursesForStudentUserId } from '@/api/grades';

interface TeacherCourse {
  teacher: { name: string };
  courses: { name: string }[];
}

interface TeachersApiResponse {
  class: string;
  teachers: TeacherCourse[];
}

const StudentTeachers: React.FC = () => {
  const { user } = useContext(UserContext);
  const [teachers, setTeachers] = useState<TeacherCourse[]>([]);
  const [className, setClassName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    getTeachersAndCoursesForStudentUserId(user.id)
      .then((data: TeachersApiResponse) => {
        setTeachers(data.teachers ?? []);
        setClassName(data.class ?? '');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch teachers');
        setLoading(false);
      });
  }, [user]);

  return (
    <Layout role="student" title="Teachers" subtitle="Your teachers and their assigned courses">
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded p-6">
          <div className="text-lg font-semibold mb-2">Teachers & Assigned Courses</div>
          {className && (
            <div className="mb-4 text-gray-600">Class: <span className="font-semibold">{className}</span></div>
          )}
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : teachers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No teachers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">Teacher</th>
                    <th className="p-3 text-left">Assigned Courses</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{t.teacher.name}</td>
                      <td className="p-3">
                        {t.courses.map((c) => c.name).join(', ')}
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

export default StudentTeachers;
