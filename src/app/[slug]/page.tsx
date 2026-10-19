import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NotionBlocks } from "@/components/NotionBlocks";
import { Gallery } from "@/components/layouts/Gallery";
import { Showcase } from "@/components/layouts/Showcase";
import { getBlocks, getProject, getProjects, imageUrl, type Block } from "@/lib/notion";

export const revalidate = 300;
// Projects published in Notion after the last deploy are rendered on first visit.
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await getProject((await params).slug);
  if (!data) return {};
  return {
    title: data.project.title,
    description: data.project.summary,
    openGraph: data.project.cover?.startsWith("http") ? { images: [data.project.cover] } : undefined,
  };
}

/** Splits a page body into the text before the first image and the images themselves. */
function splitImages(blocks: Block[]) {
  const firstImage = blocks.findIndex((b) => b.type === "image");
  const intro = firstImage === -1 ? blocks : blocks.slice(0, firstImage);
  const images = blocks.flatMap((b) => {
    const src = imageUrl(b);
    if (!src || b.type !== "image") return [];
    return [{ src, alt: b.image.caption.map((c) => c.plain_text).join("") }];
  });
  return { intro, images };
}

export default async function ProjectPage({ params }: Params) {
  const data = await getProject((await params).slug);
  if (!data) notFound();
  const { project, prev, next } = data;
  const blocks = await getBlocks(project.id);

  return (
    <article className="pt-16">
      <header className="mb-12 grid gap-8 md:grid-cols-[1fr_minmax(0,560px)]">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{project.title}</h1>
        <div className="space-y-6">
          {project.summary && <p className="text-lg leading-relaxed">{project.summary}</p>}
          <dl className="label grid grid-cols-2 gap-4">
            {project.role && <Meta label="Role" value={project.role} />}
            {project.industry && <Meta label="Industry" value={project.industry} />}
            {project.year && <Meta label="Year" value={String(project.year)} />}
          </dl>
          <div className="label flex flex-wrap gap-6">
            {project.website && (
              <a href={project.website} target="_blank" rel="noreferrer" className="hover:text-muted">
                [ View website ]
              </a>
            )}
            {project.printsLink && (
              <a href={project.printsLink} target="_blank" rel="noreferrer" className="hover:text-muted">
                [ Buy my prints ]
              </a>
            )}
          </div>
        </div>
      </header>

      <Body layout={project.layout} blocks={blocks} />

      {prev && next && (
        <nav className="label mt-24 grid grid-cols-2 gap-6 border-t border-line pt-8">
          <Link href={`/${prev.slug}`} className="group">
            <span className="text-muted">← Previous</span>
            <span className="mt-2 block font-sans text-base normal-case tracking-normal group-hover:underline">{prev.title}</span>
          </Link>
          <Link href={`/${next.slug}`} className="group text-right">
            <span className="text-muted">Next →</span>
            <span className="mt-2 block font-sans text-base normal-case tracking-normal group-hover:underline">{next.title}</span>
          </Link>
        </nav>
      )}
    </article>
  );
}

function Body({ layout, blocks }: { layout: string; blocks: Block[] }) {
  if (layout === "Case study") return <NotionBlocks blocks={blocks} />;
  const { intro, images } = splitImages(blocks);
  return (
    <div className="flex flex-col gap-12">
      {intro.length > 0 && <NotionBlocks blocks={intro} />}
      {layout === "Gallery" ? <Gallery images={images} /> : <Showcase pages={images.map((i) => i.src)} />}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">/{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
