import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {user?.email} · Role: <span className="font-semibold">{user?.role}</span>
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/books"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Catalog</p>
          <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">Browse books</p>
          <p className="mt-1 text-sm text-slate-500">Search, sort, and borrow available copies.</p>
        </Link>
        <Link
          to="/borrowed"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Loans</p>
          <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">Active borrows</p>
          <p className="mt-1 text-sm text-slate-500">
            You currently have <span className="font-semibold">{user?.activeBorrows ?? 0}</span> active loan
            {user?.activeBorrows === 1 ? '' : 's'}.
          </p>
        </Link>
        <Link
          to="/profile"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Account</p>
          <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">Profile</p>
          <p className="mt-1 text-sm text-slate-500">View your account details.</p>
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-amber-900/50 dark:bg-amber-950/40"
          >
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Administration</p>
            <p className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">Admin panel</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Users, loans, inventory, analytics.</p>
          </Link>
        )}
      </div>
    </div>
  );
}
