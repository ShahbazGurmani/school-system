export async function login(email: string, password: string, role: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
} 