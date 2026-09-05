const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export function getToken() {
  return localStorage.getItem('school_erp_token');
}

export function setSession(payload) {
  localStorage.setItem('school_erp_token', payload.token);
  localStorage.setItem('school_erp_user', JSON.stringify(payload.user));
}

export function getSessionUser() {
  const raw = localStorage.getItem('school_erp_user');
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem('school_erp_token');
  localStorage.removeItem('school_erp_user');
}

export async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  dashboard: () => request('/dashboard'),
  list: (collection, q = '') => request(`/${collection}${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  create: (collection, body) => request(`/${collection}`, { method: 'POST', body }),
  update: (collection, id, body) => request(`/${collection}/${id}`, { method: 'PUT', body }),
  remove: (collection, id) => request(`/${collection}/${id}`, { method: 'DELETE' }),
  saveAttendance: (body) => request('/attendance/bulk', { method: 'POST', body }),
  generateFees: (body) => request('/fees/generate-monthly', { method: 'POST', body }),
  studentReport: (id) => request(`/reports/student/${id}`)
};
