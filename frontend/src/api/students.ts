export interface StudentForm {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  password?: string;
  classId: string;
  courseIds: string[];
  teacherIds: string[];
}

export async function getAllStudents() {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students`);
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

export async function assignClassToStudent(studentId: string, classId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/${studentId}/assign-class`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ classId }),
  });
  if (!res.ok) throw new Error('Failed to assign class');
  return res.json();
}

export async function getStudentById(id: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/students/${id}`);
  if (!res.ok) throw new Error('Failed to fetch student');
  return res.json();
}

export async function createStudent(data: object) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create student');
  return res.json();
}

export async function updateStudent(id: string, data: object) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update student');
  return res.json();
}

export async function deleteStudent(id: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/students/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete student');
  return res.json();
}

export async function createStudentWithDetails(data: object) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create student');
  return res.json();
}

export async function updateStudentCoursesAndTeachers(studentId: string, classId: string, courses: string[], teachers: string[]) {
  // This function is now deprecated and should not be used.
  throw new Error('updateStudentCoursesAndTeachers is deprecated. Use assignClassToStudent instead.');
}

export async function getStudentsByClassId(classId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/by-class/${classId}`);
  if (!res.ok) throw new Error('Failed to fetch students by class');
  return res.json();
}