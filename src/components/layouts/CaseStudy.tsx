/* eslint-disable @next/next/no-img-element -- Notion images have unknown sizes and come from many hosts */
import Link from "next/link";
import { PixelIcon } from "@/components/PixelIcon";
import { RichText } from "@/components/NotionBlocks";
import { SelectedProjects, type SelectedProject } from "@/components/layouts/SelectedProjects";
import { imageUrl, type Block, type Project } from "@/lib/notion";

// Desktop columns from the Figma frame (1216px wide): a 123px gutter for BACK, a 248px meta column,
// the 722px text column, then 123px. The text column starts 371px in.
const textCol = "lg:ml-[30.51%] lg:w-[59.38%]";

type ProjectLink = { slug: string; title: string };

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
  // The page cover leads the case study; without one, the first image in the body takes its place.
  let cover = project.cover;
  let body = blocks;
  if (!cover) {
    const first = blocks.findIndex((b) => b.type === "image");
    if (first !== -1) {
      cover = imageUrl(blocks[first]);
      body = blocks.filter((_, i) => i !== first);
    }
  }

  // Opening text sits beside the meta column; everything from the first image on runs below both.
  const isMedia = (b: Block) =>
    ["image", "video", "embed", "column_list"].includes(b.type) || plain(b) === "selected projects";
  const split = body.findIndex(isMedia);
  const opening = split === -1 ? body : body.slice(0, split);
  const rest = split === -1 ? [] : body.slice(split);

  return (
    <article className="mx-auto w-full max-w-[1264px] px-6 pb-24 pt-10 sm:pt-[69px]">
      <div className="grid gap-6 lg:grid-cols-[123fr_1093fr] lg:gap-0">
        <Link href="/#work" className="label flex w-fit items-center gap-1 self-start text-accent hover:underline">
          <PixelIcon name="chevron" />
          Back
        </Link>
        {cover && <img src={cover} alt="" className="aspect-[1093/464] w-full object-cover" />}
      </div>

      <div className="mt-10 grid lg:mt-12 lg:grid-cols-[371fr_845fr] lg:grid-rows-[auto_1fr]">
        <h1 className="text-title font-semibold leading-[1.35] tracking-[-0.01em] text-accent lg:col-start-2 lg:w-[85.44%]">
          {project.title}
        </h1>
        <aside className="label mt-8 space-y-8 self-start text-[#1a1a1a] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-[13px] lg:pl-[33.15%]">
          <dl className="grid grid-cols-3 gap-4 lg:block lg:space-y-8">
            {project.years && <Meta label="Year" value={project.years} />}
            {project.roles.length > 0 && <Meta label="Role" value={project.roles.join(" / ")} />}
            {project.industry && <Meta label="Industry" value={project.industry} />}
          </dl>
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-accent-soft py-2.5 pl-3 pr-3.5 leading-4 text-white transition-colors hover:bg-accent"
            >
              Visit website
              <PixelIcon name="diamond" />
            </a>
          )}
        </aside>
        <div className="lg:col-start-2 lg:row-start-2">
          <CaseStudyBody blocks={opening} col="lg:w-[85.44%]" />
        </div>
      </div>
      <CaseStudyBody blocks={rest} />

      {prev && next && <PagerNav prev={prev} next={next} />}
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm lg:text-base">
      <dt className="inline-block rounded-[4px] border-[0.5px] border-[#1a1a1a] px-1.5 py-1">{label}</dt>
      <dd className="mt-3">{value}</dd>
    </div>
  );
}

const text = (items: Parameters<typeof RichText>[0]["items"]) => <RichText items={items} />;
const plain = (b: Block) =>
  b.type === "heading_1" ? b.heading_1.rich_text.map((t) => t.plain_text).join("").trim().toLowerCase() : "";

/** Lays out the page body: text in the 722px column, images across the full width. */
function CaseStudyBody({ blocks, col = textCol }: { blocks: Block[]; col?: string }) {
  const out: React.ReactNode[] = [];
  let prevKind: "text" | "heading" | "media" | null = null;

  // Space above a block depends on what came before it, as in the Figma frame.
  const gap = (kind: "text" | "heading" | "media") => {
    const g =
      prevKind === null
        ? kind === "media" ? "mt-12" : "mt-6"
        : kind === "media"
          ? prevKind === "media" ? "mt-3 sm:mt-5" : "mt-12 sm:mt-14"
          : prevKind === "media"
            ? "mt-12 sm:mt-16"
            : kind === "heading"
              ? "mt-10 sm:mt-12"
              : prevKind === "heading" ? "mt-4" : "mt-[1.35em]";
    prevKind = kind;
    return g;
  };

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];

    // A "Selected projects" heading turns the toggles after it into the carousel.
    if (plain(b) === "selected projects") {
      const items: SelectedProject[] = [];
      while (blocks[i + 1]?.type === "toggle") {
        const t = blocks[++i];
        if (t.type !== "toggle") break;
        const kids = t.children ?? [];
        items.push({
          id: t.id,
          label: t.toggle.rich_text.map((r) => r.plain_text).join(""),
          description: kids.flatMap((k) =>
            k.type === "paragraph" && k.paragraph.rich_text.length ? [k.paragraph.rich_text.map((r) => r.plain_text).join("")] : [],
          ),
          images: kids.flatMap((k) => {
            const src = imageUrl(k);
            return src ? [src] : [];
          }),
        });
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
          className={`${gap("text")} ${col} ${List === "ul" ? "list-disc" : "list-decimal"} space-y-[1.35em] ps-[30px] text-xl text-muted`}
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
          <p key={b.id} className={`${gap("text")} ${col} whitespace-pre-line text-xl text-muted`}>
            {text(b.paragraph.rich_text)}
          </p>,
        );
        break;
      case "heading_1":
      case "heading_2":
      case "heading_3": {
        const rich = b.type === "heading_1" ? b.heading_1.rich_text : b.type === "heading_2" ? b.heading_2.rich_text : b.heading_3.rich_text;
        out.push(
          <h2 key={b.id} className={`${gap("heading")} ${col} text-heading font-semibold tracking-[-0.01em] text-muted`}>
            {text(rich)}
          </h2>,
        );
        break;
      }
      case "quote":
        out.push(
          <blockquote key={b.id} className={`${gap("text")} ${col} border-l-2 border-accent pl-6 text-2xl text-muted`}>
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
        out.push(<hr key={b.id} className={`${gap("text")} ${col} border-[#d9d9d9]`} />);
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
        <figcaption className="mt-5 text-xl text-muted sm:ml-[calc(50%+14px)] sm:max-w-[594px]">
          <RichText items={cap} />
        </figcaption>
      )}
    </figure>
  );
}

function PagerNav({ prev, next }: { prev: ProjectLink; next: ProjectLink }) {
  return (
    <nav aria-label="More case studies" className="label mt-24 flex items-center justify-center gap-8 text-xs leading-4 text-accent sm:mt-32">
      <Link href={`/${prev.slug}`} title={prev.title} className="flex items-center gap-2 hover:underline">
        <PixelIcon name="chevron" />
        Previous
      </Link>
      <Link href="/#work" className="hover:underline">
        Index
      </Link>
      <Link href={`/${next.slug}`} title={next.title} className="flex items-center gap-2 hover:underline">
        Next
        <PixelIcon name="chevron" flip />
      </Link>
    </nav>
  );
}
