import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-[1512px] flex-col items-start justify-center gap-6 px-4 pt-16 sm:px-6">
      <h1 className="text-5xl font-semibold uppercase tracking-tight">Page not found</h1>
      <Link href="/" className="label underline underline-offset-4">
        [ Back to home ]
      </Link>
    </div>
  );
}
