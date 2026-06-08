import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce.js';
import * as bookService from '../services/bookService.js';
import Spinner from '../components/Spinner.jsx';

export default function BooksPage() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 400);
  const [sortBy, setSortBy] = useState('title');
  const [direction, setDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await bookService.fetchBooks({
          search: debounced || undefined,
          page,
          size: 8,
          sortBy,
          direction,
        });
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError('Could not load books');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced, page, sortBy, direction]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Books</h1>
          <p className="text-slate-600 dark:text-slate-400">Search and sort the catalog (debounced search).</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Search title, author, genre, ISBN…"
            className="min-w-[200px] flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
          <select
            className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={sortBy}
            onChange={(e) => {
              setPage(0);
              setSortBy(e.target.value);
            }}
          >
            <option value="title">Sort: Title</option>
            <option value="author">Sort: Author</option>
            <option value="availability">Sort: Availability</option>
            <option value="year">Sort: Year</option>
          </select>
          <select
            className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={direction}
            onChange={(e) => {
              setPage(0);
              setDirection(e.target.value);
            }}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.content.map((b) => (
              <Link
                key={b.id}
                to={`/books/${b.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={b.coverImageUrl || 'https://picsum.photos/300/450'}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-display text-sm font-semibold text-slate-900 line-clamp-2 dark:text-white">
                    {b.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{b.author}</p>
                  <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {b.availableQuantity} / {b.quantity} available
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-40 dark:border-slate-700"
            >
              Previous
            </button>
            <span className="text-slate-500">
              Page {data.page + 1} of {Math.max(1, data.totalPages)} ({data.totalElements} books)
            </span>
            <button
              type="button"
              disabled={data.last}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-40 dark:border-slate-700"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
