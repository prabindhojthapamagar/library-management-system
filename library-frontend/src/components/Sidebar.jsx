import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;

export default function Sidebar({ open, onClose }) {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-800">
          <Link to="/" className="font-display text-lg font-bold tracking-tight text-brand-900 dark:text-white">
            LibraStack
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
            Dashboard
          </NavLink>
          <NavLink to="/books" className={linkClass} onClick={onClose}>
            Books
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/borrowed" className={linkClass} onClick={onClose}>
                My loans
              </NavLink>
              <NavLink to="/profile" className={linkClass} onClick={onClose}>
                Profile
              </NavLink>
            </>
          )}
          {isAdmin && (
            <>
              <div className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Admin
              </div>
              <NavLink to="/admin" className={linkClass} onClick={onClose}>
                Overview
              </NavLink>
              <NavLink to="/admin/users" className={linkClass} onClick={onClose}>
                Users
              </NavLink>
              <NavLink to="/admin/borrows" className={linkClass} onClick={onClose}>
                Loans
              </NavLink>
              <NavLink to="/admin/books" className={linkClass} onClick={onClose}>
                Inventory
              </NavLink>
              <NavLink to="/admin/books/new" className={linkClass} onClick={onClose}>
                Add book
              </NavLink>
            </>
          )}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-3 dark:border-slate-800">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="block rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-brand-500"
            >
              Sign in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
