import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            Finance Tracker
          </Link>
        </div>

        <div className="card text-center">
          <h2 className="text-6xl font-bold mb-4">404</h2>
          <h3 className="text-2xl font-semibold mb-6">Page Not Found</h3>
          <p className="mb-8">
            The page you are looking for does not exist or has been moved.
          </p>

          <Link href="/" className="btn-primary inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
