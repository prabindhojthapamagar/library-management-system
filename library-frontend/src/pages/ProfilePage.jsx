import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Username</dt>
            <dd className="mt-1 text-base font-medium text-slate-900 dark:text-white">{user.username}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Email</dt>
            <dd className="mt-1 text-base text-slate-800 dark:text-slate-200">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Role</dt>
            <dd className="mt-1 text-base text-slate-800 dark:text-slate-200">{user.role}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Active loans</dt>
            <dd className="mt-1 text-base text-slate-800 dark:text-slate-200">{user.activeBorrows}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Member since</dt>
            <dd className="mt-1 text-base text-slate-800 dark:text-slate-200">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
