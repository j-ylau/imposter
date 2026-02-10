import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="text-5xl mb-2">😵</div>
        <h2 className="text-2xl font-bold text-fg">Page Not Found</h2>
        <p className="text-fg-muted">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-fg rounded-lg font-medium hover:bg-primary-hover transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
