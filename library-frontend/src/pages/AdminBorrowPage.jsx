import { useEffect, useState } from 'react';
import * as adminService from '../services/adminService.js';
import Spinner from '../components/Spinner.jsx';

function fmt(iso) {
  return iso ? new Date(iso).toLocaleString() : '—';
}

export default function AdminBorrowPage() {
  const [tab, setTab] = useState('active');
  const [active, setActive] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [a, h] = await Promise.all([
          adminService.fetchAdminActiveLoans(),
          adminService.fetchAdminBorrowHistory(),
        ]);
        setActive(a);
        setHistory(h);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  const rows = tab === 'active' ? active : history;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Loans</h1>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('active')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            tab === 'active'
              ? 'bg-brand-600 text-white'
              : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
          }`}
        >
          Active ({active.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('history')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            tab === 'history'
              ? 'bg-brand-600 text-white'
              : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
          }`}
        >
          Full history ({history.length})
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/80">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Borrower</th>
              <th className="px-3 py-2 text-left font-semibold">Book</th>
              <th className="px-3 py-2 text-left font-semibold">Borrowed</th>
              <th className="px-3 py-2 text-left font-semibold">Due</th>
              <th className="px-3 py-2 text-left font-semibold">Returned</th>
              <th className="px-3 py-2 text-left font-semibold">Fine</th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-2">
                  <p className="font-medium text-slate-900 dark:text-white">{r.borrowerUsername}</p>
                  <p className="text-xs text-slate-500">{r.borrowerEmail}</p>
                </td>
                <td className="px-3 py-2">
                  <p className="font-medium">{r.bookTitle}</p>
                  <p className="text-xs text-slate-500">{r.bookAuthor}</p>
                </td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{fmt(r.borrowedAt)}</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{fmt(r.dueDate)}</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{fmt(r.returnedAt)}</td>
                <td className="px-3 py-2">${Number(r.fineAmount ?? 0).toFixed(2)}</td>
                <td className="px-3 py-2">
                  {r.overdue ? (
                    <span className="text-xs font-semibold text-red-600">Overdue</span>
                  ) : r.returnedAt ? (
                    <span className="text-xs text-emerald-600">Returned</span>
                  ) : (
                    <span className="text-xs text-slate-500">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
