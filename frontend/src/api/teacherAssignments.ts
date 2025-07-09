export async function getTeacherAssignments() {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teacher-assignments`);
  if (!res.ok) throw new Error('Failed to fetch assignments');
  return res.json();
}

export async function getAssignmentsByTeacher(teacherId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teacher-assignments/teacher/${teacherId}`);
  if (!res.ok) throw new Error('Failed to fetch assignments for teacher');
  return res.json();
}

export async function createTeacherAssignment(data: { teacher: string; course: string; class: string }) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teacher-assignments?role=principal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create assignment');
  return res.json();
}

export async function deleteTeacherAssignment(id: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teacher-assignments/${id}?role=principal`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete assignment');
  return res.json();
}

export async function getClassesForTeacher(teacherId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teacher-assignments/teacher/${teacherId}`);
  if (!res.ok) throw new Error('Failed to fetch teacher assignments');
  return res.json();
}

export async function getTeacherClassesWithDetails(teacherId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teacher-assignments/classes?teacherId=${teacherId}`);
  if (!res.ok) throw new Error('Failed to fetch teacher classes with details');
  return res.json();
}

export async function getTeacherAGradeStudents(teacherId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teacher-assignments/teacher/${teacherId}/a-grade-students`);
  if (!res.ok) throw new Error('Failed to fetch A grade students');
  return res.json();
} 