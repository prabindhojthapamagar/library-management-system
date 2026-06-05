import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import * as bookService from '../services/bookService.js';
import Spinner from '../components/Spinner.jsx';

const empty = {
  title: '',
  author: '',
  genre: '',
  isbn: '',
  quantity: 1,
  publishedYear: new Date().getFullYear(),
  description: '',
  coverImageUrl: '',
};

export default function AddEditBookPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const b = await bookService.fetchBook(id);
        if (!cancelled) {
          setForm({
            title: b.title,
            author: b.author,
            genre: b.genre,
            isbn: b.isbn,
            quantity: b.quantity,
            publishedYear: b.publishedYear ?? new Date().getFullYear(),
            description: b.description ?? '',
            coverImageUrl: b.coverImageUrl ?? '',
          });
        }
      } catch {
        toast('Book not found', 'error');
        navigate('/books');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      author: form.author,
      genre: form.genre,
      isbn: form.isbn,
      quantity: Number(form.quantity),
      publishedYear:
        form.publishedYear === '' || form.publishedYear === null || form.publishedYear === undefined
          ? null
          : Number(form.publishedYear),
      description: form.description || null,
      coverImageUrl: form.coverImageUrl || null,
    };
    try {
      if (isEdit) {
        await bookService.updateBook(id, payload);
        toast('Book updated', 'success');
      } else {
        await bookService.create(payload);
        toast('Book created', 'success');
      }
      navigate('/books');
    } catch (err) {
      toast(err.response?.data?.message ?? 'Save failed', 'error');
    } finally {
      setSaving(false);
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
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
          {isEdit ? 'Edit book' : 'Add book'}
        </h1>
        <Link to="/books" className="text-sm font-medium text-brand-600 hover:underline">
          Cancel
        </Link>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        {['title', 'author', 'genre', 'isbn'].map((field) => (
          <div key={field}>
            <label className="text-xs font-semibold uppercase text-slate-500">{field}</label>
            <input
              required
              disabled={isEdit && field === 'isbn'}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:disabled:bg-slate-900"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Quantity</label>
            <input
              type="number"
              min={0}
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Year</label>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={form.publishedYear ?? ''}
              onChange={(e) => setForm({ ...form, publishedYear: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Cover image URL</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            value={form.coverImageUrl}
            onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Description</label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  );
}
