import { api } from './api.js';

export async function fetchProfile() {
  const { data } = await api.get('/api/users/me');
  return data;
}

export async function fetchAdminUsers() {
  const { data } = await api.get('/api/admin/users');
  return data;
}

export async function fetchAdminAnalytics() {
  const { data } = await api.get('/api/admin/analytics');
  return data;
}

export async function fetchAdminBorrowHistory() {
  const { data } = await api.get('/api/admin/borrow-records');
  return data;
}

export async function fetchAdminActiveLoans() {
  const { data } = await api.get('/api/admin/borrow-records/active');
  return data;
}

export async function fetchAdminInventory(sortBy) {
  const { data } = await api.get('/api/admin/books/inventory', { params: { sortBy } });
  return data;
}
