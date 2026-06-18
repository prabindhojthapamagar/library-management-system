import { api } from './api.js';

export async function borrowBook(bookId) {
  const { data } = await api.post(`/api/borrow/${bookId}`);
  return data;
}

export async function returnBook(bookId) {
  const { data } = await api.post(`/api/return/${bookId}`);
  return data;
}

export async function fetchMyBorrows() {
  const { data } = await api.get('/api/borrow/my-books');
  return data;
}

export async function fetchBorrowHistory() {
  const { data } = await api.get('/api/borrow/history');
  return data;
}
