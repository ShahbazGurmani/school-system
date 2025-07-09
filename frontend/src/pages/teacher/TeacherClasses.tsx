import { useContext, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/contexts/UserContext';
import { getClassesForTeacher } from '@/api/teacherAssignments';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClassInfo {
  _id: string;
  name?: string;
  section?: string;
  // Add other fields as needed
}

interface Assignment {
  class: ClassInfo;
  course: { _id: string; name?: string };
}

const TeacherClasses = () => {
  const { user } = useContext(UserContext);
  const [classAssignments, setClassAssignments] = useState<Record<string, { classInfo: ClassInfo; courseNames: Set<string> }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'teacher') return;
    setLoading(true);
    getClassesForTeacher(user.id)
      .then((assignments: Assignment[]) => {
        // Group assignments by class and count unique courses
        const grouped: Record<string, { classInfo: ClassInfo; courseNames: Set<string> }> = {};
        assignments.forEach((a) => {
          if (a.class && a.class._id) {
            if (!grouped[a.class._id]) {
              grouped[a.class._id] = { classInfo: a.class, courseNames: new Set() };
            }
            if (a.course && a.course.name) {
              grouped[a.class._id].courseNames.add(a.course.name);
            }
          }
        });
        // Map to courseCount
        const result: Record<string, { classInfo: ClassInfo; courseNames: Set<string> }> = {};
        Object.entries(grouped).forEach(([id, { classInfo, courseNames }]) => {
          result[id] = { classInfo, courseNames };
        });
        setClassAssignments(result);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load classes');
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.role !== 'teacher') {
    return <div>Not authorized</div>;
  }

  if (loading) {
    return <Layout role="teacher" title="My Classes" subtitle="Classes you are teaching">
      <div>Loading classes...</div>
    </Layout>;
  }

  if (error) {
    return <Layout role="teacher" title="My Classes" subtitle="Classes you are teaching">
      <div className="text-red-500">{error}</div>
    </Layout>;
  }

  const classList = Object.values(classAssignments);

  if (classList.length === 0) {
    return <Layout role="teacher" title="My Classes" subtitle="Classes you are teaching">
      <div className="text-center text-gray-500 py-10">Principal has not assigned any class to you yet.</div>
    </Layout>;
  }

  return (
    <Layout role="teacher" title="My Classes" subtitle="Classes you are teaching">
      <div className="p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {classList.map(({ classInfo, courseNames }) => (
          <Card key={classInfo._id} className="shadow-2xl border-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold text-blue-900">{classInfo.name || 'Class'}</CardTitle>
                {classInfo.section && <div className="text-xs text-gray-500">Section: {classInfo.section}</div>}
              </div>
              <div className="rounded-full bg-blue-500 p-3 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-base mb-2">
                <span>{courseNames.size}</span>
                <span className="text-xs text-gray-600">{courseNames.size === 1 ? 'Course' : 'Courses'} assigned</span>
              </div>
              {courseNames.size > 0 && (
                <div className="mb-2 text-xs text-purple-700">
                  <span className="font-semibold">Subjects:</span> {Array.from(courseNames).join(', ')}
                </div>
              )}
              <div className="text-gray-700 text-xs">Class ID: {classInfo._id}</div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/teacher/classes/class-detail?classId=${classInfo._id}`)}>View Class</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default TeacherClasses; 