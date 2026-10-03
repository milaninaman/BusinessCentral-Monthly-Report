import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-brand">Not found</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink">This page doesn’t exist</h1>
      <Link href="/" className="mt-6 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-strong">
        Back to the report
      </Link>
    </main>
  );
}
