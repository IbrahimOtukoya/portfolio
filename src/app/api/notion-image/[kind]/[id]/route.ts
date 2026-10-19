import { NextResponse } from "next/server";
import { freshFileUrl } from "@/lib/notion";

// Notion's signed file URLs last about an hour; cache the redirect for well under that.
const CACHE = "public, max-age=0, s-maxage=1800, stale-while-revalidate=600";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kind: string; id: string }> },
) {
  const { kind, id } = await params;
  if (kind !== "block" && kind !== "cover" && kind !== "prop") {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const url = await freshFileUrl(kind, id);
    if (!url) return new NextResponse("Not found", { status: 404 });
    return NextResponse.redirect(url, { status: 307, headers: { "Cache-Control": CACHE } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
