import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import * as adminService from '../services/adminService.js';
import * as bookService from '../services/bookService.js';
import Spinner from '../components/Spinner.jsx';

export default function AdminBooksPage() {
  const { toast } = useToast();
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.fetchAdminInventory(sortBy);
      setBooks(data);
    } catch {
      toast('Could not load inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [sortBy]);

  const remove = async (id) => {
    if (!window.confirm('Delete this book? Only allowed if no borrowing history.')) return;
    try {
      await bookService.deleteBook(id);
      toast('Deleted', 'success');
      await load();
    } catch (err) {
      toast(err.response?.data?.message ?? 'Delete failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Inventory</h1>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Sort: Title</option>
            <option value="author">Sort: Author</option>
            <option value="availability">Sort: Availability</option>
            <option value="year">Sort: Year</option>
          </select>
          <Link
            to="/admin/books/new"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
          >
            Add book
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/80">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Title</th>
              <th className="px-3 py-2 text-left font-semibold">ISBN</th>
              <th className="px-3 py-2 text-left font-semibold">Avail / Total</th>
              <th className="px-3 py-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {books.map((b) => (
              <tr key={b.id}>
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">{b.title}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-600 dark:text-slate-300">{b.isbn}</td>
                <td className="px-3 py-2">
                  {b.availableQuantity} / {b.quantity}
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    to={`/admin/books/${b.id}/edit`}
                    className="mr-2 text-brand-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button type="button" className="text-red-600 hover:underline" onClick={() => remove(b.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
