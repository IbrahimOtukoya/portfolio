import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-start justify-center gap-6 pt-16">
      <h1 className="text-5xl font-semibold uppercase tracking-tight">Page not found</h1>
      <Link href="/" className="label underline underline-offset-4">
        [ Back to home ]
      </Link>
    </div>
  );
}
