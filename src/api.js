import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('eduflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(new Error(error.response?.data?.message || error.message || 'Request failed'))
);

export const session = {
  set(payload) {
    localStorage.setItem('eduflow_token', payload.token);
    localStorage.setItem('eduflow_user', JSON.stringify(payload.user));
  },
  user() {
    const raw = localStorage.getItem('eduflow_user');
    return raw ? JSON.parse(raw) : null;
  },
  clear() {
    localStorage.removeItem('eduflow_token');
    localStorage.removeItem('eduflow_user');
  }
};

export const api = {
  login: (credentials) => client.post('/auth/login', credentials),
  dashboard: () => client.get('/dashboard'),
  list: (collection, q = '') => client.get(`/${collection}${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  create: (collection, payload) => client.post(`/${collection}`, payload),
  update: (collection, id, payload) => client.put(`/${collection}/${id}`, payload),
  remove: (collection, id) => client.delete(`/${collection}/${id}`),
  markAttendance: (payload) => client.post('/workflows/mark-attendance', payload),
  generateFees: (payload) => client.post('/workflows/generate-fees', payload),
  processPayroll: (payload) => client.post('/workflows/process-payroll', payload)
};
