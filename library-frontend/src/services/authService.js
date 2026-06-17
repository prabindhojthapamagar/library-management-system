import { api, setStoredToken } from './api.js';

export async function login(payload) {
  const { data } = await api.post('/api/auth/login', payload);
  setStoredToken(data.token);
  return data;
}

export async function register(payload) {
  const { data } = await api.post('/api/auth/register', payload);
  setStoredToken(data.token);
  return data;
}

export async function logout() {
  try {
    await api.post('/api/auth/logout');
  } finally {
    setStoredToken(null);
  }
}
