import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import * as bookService from '../services/bookService.js';
import * as borrowService from '../services/borrowService.js';
import Spinner from '../components/Spinner.jsx';

export default function BookDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const b = await bookService.fetchBook(id);
        if (!cancelled) setBook(b);
      } catch {
        if (!cancelled) setBook(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const borrow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBorrowing(true);
    try {
      await borrowService.borrowBook(id);
      toast('Book borrowed — enjoy reading!', 'success');
      const b = await bookService.fetchBook(id);
      setBook(b);
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Borrow failed';
      toast(msg, 'error');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }
  if (!book) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">Book not found.</p>
        <Link to="/books" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/books" className="text-sm font-medium text-brand-600 hover:underline">
        ← Back to books
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <img src={book.coverImageUrl || 'https://picsum.photos/400/600'} alt="" className="w-full object-cover" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">{book.title}</h1>
          <p className="mt-1 text-lg text-slate-600 dark:text-slate-300">{book.author}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium dark:bg-slate-800">{book.genre}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-mono dark:bg-slate-800">{book.isbn}</span>
            {book.publishedYear && (
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{book.publishedYear}</span>
            )}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {book.description || 'No description provided.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={borrow}
              disabled={borrowing || book.availableQuantity <= 0}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {book.availableQuantity <= 0 ? 'Out of stock' : borrowing ? 'Borrowing…' : 'Borrow'}
            </button>
            <span className="text-sm text-slate-500">
              {book.availableQuantity} of {book.quantity} copies available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
