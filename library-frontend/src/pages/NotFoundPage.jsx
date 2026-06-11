import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <p className="font-display text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-center text-slate-600 dark:text-slate-400">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
      >
        Go home
      </Link>
    </div>
  );
}
