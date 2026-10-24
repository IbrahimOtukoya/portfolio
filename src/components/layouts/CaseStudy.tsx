/* eslint-disable @next/next/no-img-element -- Notion images have unknown sizes and come from many hosts */
import { PagerNav } from "@/components/PagerNav";
import { RichText } from "@/components/NotionBlocks";
import { SelectedProjects, type SelectedProject } from "@/components/layouts/SelectedProjects";
import { imageUrl, type Block, type Project } from "@/lib/notion";

type ProjectLink = { slug: string; title: string };

// Layout of the case studies on the Framer site: a wide banner (1194px), then text and images
// sharing one 953px column.
export function CaseStudy({
  project,
  blocks,
  prev,
  next,
}: {
  project: Project;
  blocks: Block[];
  prev: ProjectLink | null;
  next: ProjectLink | null;
}) {
  // A page body that opens with an image uses it as the banner;
  // otherwise the Notion page cover, then the first image anywhere in the body.
  let cover = project.cover;
  let body = blocks;
  const first = blocks[0]?.type === "image" ? 0 : cover ? -1 : blocks.findIndex((b) => b.type === "image");
  if (first !== -1) {
    cover = imageUrl(blocks[first]) ?? cover;
    body = blocks.filter((_, i) => i !== first);
  }

  // [ VIEW WEBSITE ] follows the opening paragraphs, before the first section heading or image.
  const split = body.findIndex((b) => b.type !== "paragraph");
  const opening = split === -1 ? body : body.slice(0, split);
  const rest = split === -1 ? [] : body.slice(split);

  return (
    <article className="mx-auto w-full max-w-[1242px] px-6 pb-24 pt-6 sm:pt-[14px]">
      {cover && <img src={cover} alt="" className="w-full" />}

      <div className="mx-auto max-w-[953px]">
        <h1 className="mt-10 text-title font-medium leading-[1.35] text-accent sm:mt-14">{project.title}</h1>
        <CaseStudyBody blocks={opening} first="mt-8 sm:mt-10" />
        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noreferrer"
            className="label mt-2 inline-block text-xs text-accent hover:underline"
          >
            [ View website ]
          </a>
        )}
        <CaseStudyBody blocks={rest} first="mt-14" />
      </div>

      {prev && next && <PagerNav prev={prev} next={next} />}
    </article>
  );
}

const text = (items: Parameters<typeof RichText>[0]["items"]) => <RichText items={items} />;
const plainText = (items: Parameters<typeof RichText>[0]["items"]) => items.map((t) => t.plain_text).join("").trim();
const headingText = (b: Block) =>
  b.type === "heading_1"
    ? plainText(b.heading_1.rich_text)
    : b.type === "heading_2"
      ? plainText(b.heading_2.rich_text)
      : b.type === "heading_3"
        ? plainText(b.heading_3.rich_text)
        : "";
const isHeading = (b: Block) => b.type === "heading_1" || b.type === "heading_2" || b.type === "heading_3";
/** "Selected projects" (followed by toggles) or "Selected projects: The Compass" (followed by its blocks). */
const isSelected = (b: Block) => /^selected projects\b/i.test(headingText(b));
const imagesIn = (bs: Block[]): string[] =>
  bs.flatMap((k) => {
    if (k.type === "column_list" || k.type === "column") return imagesIn(k.children ?? []);
    const src = imageUrl(k);
    return src ? [src] : [];
  });
const paragraphsIn = (bs: Block[]) =>
  bs.flatMap((k) => (k.type === "paragraph" && k.paragraph.rich_text.length ? [plainText(k.paragraph.rich_text)] : []));

/** Lays out the page body; spacing between blocks follows the Framer page. */
function CaseStudyBody({ blocks, first = "mt-14" }: { blocks: Block[]; first?: string }) {
  const out: React.ReactNode[] = [];
  let prevKind: "text" | "heading" | "subheading" | "media" | null = null;

  // Space above a block depends on what came before it, as in the Figma frame.
  const gap = (kind: "text" | "heading" | "subheading" | "media") => {
    const g =
      prevKind === null
        ? first
        : kind === "media"
          ? prevKind === "media" ? "mt-3 sm:mt-5" : "mt-10 sm:mt-14"
          : prevKind === "media"
            ? "mt-10 sm:mt-14"
            : kind === "heading"
              ? "mt-12 sm:mt-14"
              : prevKind === "heading" ? "mt-4" : prevKind === "subheading" ? "mt-0" : "mt-[1.35em]";
    prevKind = kind;
    return g;
  };

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];

    // "Selected projects" headings become the carousel. Either one heading followed by a toggle per
    // project, or one "Selected projects: Name" heading per project followed by its text and images.
    if (isSelected(b)) {
      const items: SelectedProject[] = [];
      i--;
      while (blocks[i + 1] && isSelected(blocks[i + 1])) {
        const h = blocks[++i];
        const name = headingText(h).replace(/^selected projects\s*:?\s*/i, "");
        if (name) {
          const kids: Block[] = [];
          while (blocks[i + 1] && !isHeading(blocks[i + 1])) kids.push(blocks[++i]);
          items.push({ id: h.id, label: name, description: paragraphsIn(kids), images: imagesIn(kids) });
        }
        while (blocks[i + 1]?.type === "toggle") {
          const t = blocks[++i];
          if (t.type !== "toggle") break;
          const kids = t.children ?? [];
          items.push({ id: t.id, label: plainText(t.toggle.rich_text), description: paragraphsIn(kids), images: imagesIn(kids) });
        }
      }
      if (items.length) out.push(<SelectedProjects key={b.id} items={items} className={gap("media")} />);
      continue;
    }

    if (b.type === "bulleted_list_item" || b.type === "numbered_list_item") {
      const type = b.type;
      const items: Block[] = [];
      while (i < blocks.length && blocks[i].type === type) items.push(blocks[i++]);
      i--;
      const List = type === "bulleted_list_item" ? "ul" : "ol";
      out.push(
        <List
          key={b.id}
          className={`${gap("text")} ${List === "ul" ? "list-disc" : "list-decimal"} space-y-[1.35em] ps-[30px] text-xl text-muted`}
        >
          {items.map((item) => (
            <li key={item.id}>
              {item.type === "bulleted_list_item" && text(item.bulleted_list_item.rich_text)}
              {item.type === "numbered_list_item" && text(item.numbered_list_item.rich_text)}
            </li>
          ))}
        </List>,
      );
      continue;
    }

    switch (b.type) {
      case "paragraph":
        if (b.paragraph.rich_text.length === 0) continue;
        out.push(
          <p key={b.id} className={`${gap("text")} whitespace-pre-line text-xl text-muted`}>
            {text(b.paragraph.rich_text)}
          </p>,
        );
        break;
      case "heading_3":
        // Small bold lead-in, like the numbered objectives in the Figma frame.
        out.push(
          <h3 key={b.id} className={`${gap("subheading")} text-xl font-bold text-muted`}>
            {text(b.heading_3.rich_text)}
          </h3>,
        );
        break;
      case "heading_1":
      case "heading_2": {
        const rich = b.type === "heading_1" ? b.heading_1.rich_text : b.heading_2.rich_text;
        out.push(
          <h2 key={b.id} className={`${gap("heading")} text-2xl font-medium text-muted`}>
            {text(rich)}
          </h2>,
        );
        break;
      }
      case "quote":
        out.push(
          <blockquote key={b.id} className={`${gap("text")} border-l-2 border-accent pl-6 text-2xl text-muted`}>
            {text(b.quote.rich_text)}
          </blockquote>,
        );
        break;
      case "image":
      case "video":
      case "embed": {
        const media = <Media block={b} />;
        if (!media) continue;
        out.push(<div key={b.id} className={gap("media")}>{media}</div>);
        break;
      }
      case "column_list": {
        // Side-by-side images: two (or more) per row with a 20px gutter.
        const cols = b.children ?? [];
        out.push(
          <div key={b.id} className={`${gap("media")} grid gap-3 sm:gap-5`} style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}>
            {cols.map((col) => (
              <div key={col.id} className="flex flex-col gap-3 sm:gap-5">
                {col.children?.map((c) => <Media key={c.id} block={c} />)}
              </div>
            ))}
          </div>,
        );
        break;
      }
      case "divider":
        out.push(<hr key={b.id} className={`${gap("text")} border-[#d9d9d9]`} />);
        break;
      default:
        break;
    }
  }
  return <div>{out}</div>;
}

/** An image or video; its Notion caption sits under it in the right half of the page. */
function Media({ block: b }: { block: Block }) {
  let el: React.ReactNode = null;
  let cap: Parameters<typeof RichText>[0]["items"] = [];
  if (b.type === "image") {
    const src = imageUrl(b);
    if (!src) return null;
    cap = b.image.caption;
    el = <img src={src} alt={cap.map((c) => c.plain_text).join("")} loading="lazy" className="w-full" />;
  } else if (b.type === "video") {
    const v = b.video;
    const src = v.type === "external" ? v.external.url : v.file.url;
    const yt = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    const vimeo = src.match(/vimeo\.com\/(\d+)/);
    const embed = yt ? `https://www.youtube.com/embed/${yt[1]}` : vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : null;
    cap = v.caption;
    el = embed ? (
      <iframe src={embed} className="aspect-video w-full" allowFullScreen />
    ) : (
      <video src={src} autoPlay muted loop playsInline className="w-full" />
    );
  } else if (b.type === "embed") {
    cap = b.embed.caption;
    el = <iframe src={b.embed.url} className="aspect-video w-full" />;
  } else return null;

  return (
    <figure>
      {el}
      {cap.length > 0 && (
        <figcaption className="mt-4 text-xl text-muted sm:mt-5">
          <RichText items={cap} />
        </figcaption>
      )}
    </figure>
  );
}
