export async function getTeachers(params?: { page?: number; limit?: number; q?: string }) {
  const query = params
    ? '?' + Object.entries(params).filter(([,v]) => v !== undefined && v !== '').map(([k,v]) => `${k}=${encodeURIComponent(v as string)}`).join('&')
    : '';
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/role/teacher${query}`);
  if (!res.ok) throw new Error('Failed to fetch teachers');
  return res.json();
}

export async function getTeacherById(id: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch teacher');
  return res.json();
}

export async function createTeacher(data: { name: string; email: string; phoneNumber: string; gender: string; password: string }) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users?role=principal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, role: 'teacher' }),
  });
  if (!res.ok) throw new Error('Failed to create teacher');
  return res.json();
}

export async function updateTeacher(id: string, data: { name?: string; email?: string; phoneNumber?: string; gender?: string; password?: string }) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}?role=principal`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update teacher');
  return res.json();
}

export async function deleteTeacher(id: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}?role=principal`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete teacher');
  return res.json();
} 