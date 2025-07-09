export async function getClasses() {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classes`);
  if (!res.ok) throw new Error('Failed to fetch classes');
  return res.json();
}

export async function createClass(data: { name: string; courses: string[] }) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classes?role=principal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create class');
  return res.json();
}

export async function updateClass(id: string, data: { name: string; courses: string[] }) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classes/${id}?role=principal`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update class');
  return res.json();
}

export async function deleteClass(id: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classes/${id}?role=principal`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete class');
  return res.json();
}

export async function getClassById(id: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/classes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch class');
  return res.json();
} 