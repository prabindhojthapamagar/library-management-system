import { api } from './api.js';

export async function fetchBooks(params) {
  const { data } = await api.get('/api/books', { params });
  return data;
}

export async function fetchBook(id) {
  const { data } = await api.get(`/api/books/${id}`);
  return data;
}

export async function createBook(payload) {
  const { data } = await api.post('/api/books', payload);
  return data;
}

export async function updateBook(id, payload) {
  const { data } = await api.put(`/api/books/${id}`, payload);
  return data;
}

export async function deleteBook(id) {
  await api.delete(`/api/books/${id}`);
}
