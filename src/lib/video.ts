/**
 * Player URL for a YouTube or Vimeo link, or null for anything else (a direct video file).
 * `ambient` gives a muted, looping player without controls, for videos that play like GIFs.
 */
export function embedUrl(url: string, { ambient = false } = {}): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) {
    const id = yt[1];
    return ambient
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0`
      : `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }
  // Unlisted Vimeo links carry a privacy hash after the id: vimeo.com/123/abc.
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
  if (vimeo) {
    const params = new URLSearchParams(ambient ? { background: "1" } : { autoplay: "1" });
    if (vimeo[2]) params.set("h", vimeo[2]);
    return `https://player.vimeo.com/video/${vimeo[1]}?${params}`;
  }
  return null;
}
