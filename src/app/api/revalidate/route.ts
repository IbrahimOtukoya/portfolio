import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Refreshes every page from Notion immediately instead of waiting for the
 * 5-minute revalidation window. Call with ?secret=REVALIDATE_SECRET.
 */
async function handle(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: new Date().toISOString() });
}

export const GET = handle;
export const POST = handle;
