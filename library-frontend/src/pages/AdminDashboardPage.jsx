import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../services/adminService.js';
import Spinner from '../components/Spinner.jsx';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const a = await adminService.fetchAdminAnalytics();
        setData(a);
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

  const cards = [
    { label: 'Books (titles)', value: data?.totalBooks },
    { label: 'Users', value: data?.totalUsers },
    { label: 'Active loans', value: data?.activeLoans },
    { label: 'Overdue loans', value: data?.overdueLoans },
    { label: 'Total copies', value: data?.totalCopies },
    { label: 'Available on shelf', value: data?.availableCopies },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Admin overview</h1>
        <p className="text-slate-600 dark:text-slate-400">Library-wide metrics (suitable for charts later).</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-brand-700 dark:text-brand-300">{c.value ?? '—'}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/users"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Manage users
        </Link>
        <Link
          to="/admin/books"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Inventory
        </Link>
        <Link
          to="/admin/borrows"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Loan desk
        </Link>
        <Link
          to="/admin/books/new"
          className="rounded-xl border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-100 dark:hover:bg-brand-900/60"
        >
          Add book
        </Link>
      </div>
    </div>
  );
}
