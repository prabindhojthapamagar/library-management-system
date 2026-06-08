import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import * as borrowService from '../services/borrowService.js';
import Spinner from '../components/Spinner.jsx';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

export default function BorrowedPage() {
  const { refreshProfile } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await borrowService.fetchMyBorrows();
      setRows(data);
    } catch {
      toast('Could not load loans', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleReturn = async (bookId) => {
    setReturning(bookId);
    try {
      const res = await borrowService.returnBook(bookId);
      toast(
        res.fineAmount && Number(res.fineAmount) > 0
          ? `Returned. Fine applied: $${Number(res.fineAmount).toFixed(2)}`
          : 'Book returned',
        'success',
      );
      await load();
      await refreshProfile();
    } catch (err) {
      toast(err.response?.data?.message ?? 'Return failed', 'error');
    } finally {
      setReturning(null);
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
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">My loans</h1>
        <p className="text-slate-600 dark:text-slate-400">Active borrows sorted by due date.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/80">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Book</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Borrowed</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Due</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No active loans. Visit the catalog to borrow a book.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900 dark:text-white">{r.bookTitle}</p>
                  <p className="text-xs text-slate-500">{r.bookAuthor}</p>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(r.borrowedAt)}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(r.dueDate)}</td>
                <td className="px-4 py-3">
                  {r.overdue ? (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                      Overdue
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                      On track
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    disabled={returning === r.bookId}
                    onClick={() => handleReturn(r.bookId)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800"
                  >
                    {returning === r.bookId ? 'Returning…' : 'Return'}
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
