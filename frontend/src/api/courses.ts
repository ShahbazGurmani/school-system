export async function getCourses() {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}

export async function getSubjectsByClassId(classId: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subjects/class/${classId}`);
  if (!res.ok) throw new Error('Failed to fetch subjects for class');
  return res.json();
} 