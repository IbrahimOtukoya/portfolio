/* eslint-disable @next/next/no-img-element -- Notion images have unknown sizes and come from many hosts */
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { imageUrl, type Block } from "@/lib/notion";

export function RichText({ items }: { items: RichTextItemResponse[] }) {
  return (
    <>
      {items.map((t, i) => {
        const a = t.annotations;
        let node: React.ReactNode = t.plain_text;
        if (a.code) node = <code className="rounded bg-surface px-1 font-mono text-[0.9em]">{node}</code>;
        if (a.bold) node = <strong>{node}</strong>;
        if (a.italic) node = <em>{node}</em>;
        if (a.strikethrough) node = <s>{node}</s>;
        if (a.underline) node = <u>{node}</u>;
        if (t.href) {
          node = (
            <a href={t.href} className="underline underline-offset-4" target="_blank" rel="noreferrer">
              {node}
            </a>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function caption(items: RichTextItemResponse[]) {
  return items.length ? (
    <figcaption className="label mt-3 text-muted">
      <RichText items={items} />
    </figcaption>
  ) : null;
}

/** Images in a case study span the full content width; text sits in a narrower column. */
const textCol = "mx-auto w-full max-w-[720px]";

export function NotionBlocks({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    // Group consecutive list items into one <ul>/<ol>.
    if (b.type === "bulleted_list_item" || b.type === "numbered_list_item") {
      const type = b.type;
      const items: Block[] = [];
      while (i < blocks.length && blocks[i].type === type) items.push(blocks[i++]);
      i--;
      const List = type === "bulleted_list_item" ? "ul" : "ol";
      out.push(
        <List
          key={b.id}
          className={`${textCol} ${type === "bulleted_list_item" ? "list-disc" : "list-decimal"} space-y-2 pl-6 text-lg leading-relaxed`}
        >
          {items.map((item) => (
            <li key={item.id}>
              <RichText
                items={
                  item.type === "bulleted_list_item"
                    ? item.bulleted_list_item.rich_text
                    : item.type === "numbered_list_item"
                      ? item.numbered_list_item.rich_text
                      : []
                }
              />
              {item.children && <NotionBlocks blocks={item.children} />}
            </li>
          ))}
        </List>,
      );
      continue;
    }
    out.push(<BlockView key={b.id} block={b} />);
  }
  return <div className="flex flex-col gap-6">{out}</div>;
}

function BlockView({ block: b }: { block: Block }) {
  switch (b.type) {
    case "paragraph":
      if (b.paragraph.rich_text.length === 0) return <div className="h-2" />;
      return (
        <p className={`${textCol} text-lg leading-relaxed`}>
          <RichText items={b.paragraph.rich_text} />
        </p>
      );
    case "heading_1":
      return (
        <h2 className={`${textCol} mt-10 text-4xl font-medium tracking-tight`}>
          <RichText items={b.heading_1.rich_text} />
        </h2>
      );
    case "heading_2":
      return (
        <h2 className={`${textCol} mt-10 text-3xl font-medium tracking-tight`}>
          <RichText items={b.heading_2.rich_text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3 className={`${textCol} mt-4 text-xl font-medium`}>
          <RichText items={b.heading_3.rich_text} />
        </h3>
      );
    case "quote":
      return (
        <blockquote className={`${textCol} border-l-2 border-foreground pl-6 text-2xl leading-snug`}>
          <RichText items={b.quote.rich_text} />
        </blockquote>
      );
    case "callout":
      return (
        <div className={`${textCol} rounded-xl border border-accent-soft p-6 text-lg`}>
          <RichText items={b.callout.rich_text} />
        </div>
      );
    case "divider":
      return <hr className={`${textCol} border-accent-soft`} />;
    case "image": {
      const src = imageUrl(b);
      if (!src) return null;
      return (
        <figure className="w-full">
          <img src={src} alt={b.image.caption.map((c) => c.plain_text).join("")} loading="lazy" className="w-full rounded-lg" />
          {caption(b.image.caption)}
        </figure>
      );
    }
    case "video": {
      const v = b.video;
      const src = v.type === "external" ? v.external.url : v.file.url;
      const yt = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      const vimeo = src.match(/vimeo\.com\/(\d+)/);
      const embed = yt
        ? `https://www.youtube.com/embed/${yt[1]}`
        : vimeo
          ? `https://player.vimeo.com/video/${vimeo[1]}`
          : null;
      return (
        <figure className="w-full">
          {embed ? (
            <iframe src={embed} className="aspect-video w-full rounded-lg" allowFullScreen />
          ) : (
            <video src={src} controls playsInline className="w-full rounded-lg" />
          )}
          {caption(v.caption)}
        </figure>
      );
    }
    case "embed":
      return (
        <figure className="w-full">
          <iframe src={b.embed.url} className="aspect-video w-full rounded-lg border border-accent-soft" />
          {caption(b.embed.caption)}
        </figure>
      );
    case "column_list":
      return (
        <div className="grid w-full gap-6 md:auto-cols-fr md:grid-flow-col">
          {b.children?.map((col) => (
            <div key={col.id}>{col.children && <NotionBlocks blocks={col.children} />}</div>
          ))}
        </div>
      );
    case "toggle":
      return (
        <details className={`${textCol} text-lg`}>
          <summary className="cursor-pointer">
            <RichText items={b.toggle.rich_text} />
          </summary>
          {b.children && <div className="mt-4"><NotionBlocks blocks={b.children} /></div>}
        </details>
      );
    default:
      return null;
  }
}
