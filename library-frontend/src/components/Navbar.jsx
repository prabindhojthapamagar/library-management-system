import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ onMenu }) {
  const { user } = useAuth();

  const toggleDark = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
            onClick={onMenu}
            aria-label="Open menu"
          >
            <span className="text-lg">☰</span>
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
              Library
            </p>
            <p className="font-display text-sm font-semibold text-slate-900 dark:text-white">
              {user ? `Hi, ${user.username}` : 'Browse as guest'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDark}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Theme
          </button>
          {!user && (
            <Link
              to="/login"
              className="hidden rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-500 sm:inline-block"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
