export async function getGradesByTeacher(teacherId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/grades/teacher/${teacherId}`);
  if (!res.ok) throw new Error('Failed to fetch grades by teacher');
  return res.json();
}

export async function getGradesByClass(classId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/grades/class/${classId}`);
  if (!res.ok) throw new Error('Failed to fetch grades by class');
  return res.json();
}

export async function getGradesBySubject(subjectId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/grades/subject/${subjectId}`);
  if (!res.ok) throw new Error('Failed to fetch grades by subject');
  return res.json();
}

export async function getAllGrades() {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/grades`);
  if (!res.ok) throw new Error('Failed to fetch all grades');
  return res.json();
}

export async function getTeachersAndCoursesForStudentUserId(userId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/grades/student/${userId}/teachers`);
  if (!res.ok) throw new Error('Failed to fetch teachers and courses for student');
  return res.json();
} 