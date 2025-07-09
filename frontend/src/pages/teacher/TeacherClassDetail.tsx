import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClassById } from '@/api/classes';
import { getStudentsByClassId } from '@/api/students';

interface Student {
  id: string;
  name: string;
  email: string;
  gender: string;
  subjects: string[];
}

interface Subject {
  _id: string;
  name: string;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const dummyStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', gender: 'Female', subjects: ['Math', 'Biology', 'Chemistry'] },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', gender: 'Male', subjects: ['Math', 'Physics'] },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', gender: 'Male', subjects: ['Math', 'Chemistry'] },
];

const dummyTeacherSubjects = ['Math', 'Chemistry'];

const TeacherClassDetail = () => {
  const query = useQuery();
  const classId = query.get('classId');
  const [students, setStudents] = useState<Student[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      setLoading(true);
      getClassById(classId)
        .then((classObj) => {
          setAllSubjects(classObj.courses || []);
        });
      getStudentsByClassId(classId)
        .then((students) => {
          setStudents(students.map((s: any) => ({
            id: s.user._id,
            name: s.user.name,
            email: s.user.email,
            gender: s.user.gender,
            subjects: s.courseIds ? s.courseIds.map((c: any) => c.name) : [],
          })));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [classId]);

  return (
    <Layout role="teacher" title="Class Detail" subtitle={`Class ID: ${classId || ''}`}>
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900">Class Strength: {students.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="mb-4">
                <div className="font-semibold text-blue-800 mb-1">All Subjects:</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {allSubjects.length > 0 ? allSubjects.map((subj) => (
                    <span key={subj._id} className="bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs font-medium">{subj.name}</span>
                  )) : <span className="text-gray-500">No subjects found</span>}
                </div>
                <div className="font-semibold text-purple-800 mb-1">Subjects You Teach:</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {dummyTeacherSubjects.length > 0 ? dummyTeacherSubjects.map((subj) => (
                    <span key={subj} className="bg-purple-200 text-purple-900 px-2 py-1 rounded text-xs font-medium">{subj}</span>
                  )) : <span className="text-gray-500">No assigned subjects</span>}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Gender</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-blue-700">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-blue-700">{student.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default TeacherClassDetail; 