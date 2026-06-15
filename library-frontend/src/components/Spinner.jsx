export default function Spinner({ className = 'h-8 w-8' }) {
  return (
    <div
      className={`${className} animate-spin rounded-full border-2 border-brand-500 border-t-transparent`}
      role="status"
      aria-label="Loading"
    />
  );
}
