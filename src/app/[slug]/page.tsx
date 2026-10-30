import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotionBlocks } from "@/components/NotionBlocks";
import { Gallery } from "@/components/layouts/Gallery";
import { GalleryIntro } from "@/components/layouts/GalleryIntro";
import { Showcase } from "@/components/layouts/Showcase";
import { Editorial } from "@/components/layouts/Editorial";
import { CaseStudy, CaseStudyBody } from "@/components/layouts/CaseStudy";
import { ProjectHeader } from "@/components/layouts/ProjectHeader";
import { PagerNav } from "@/components/PagerNav";
import { getBlocks, getProject, getProjects, imageUrl, videoUrl, type Block } from "@/lib/notion";

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

/** Gallery tiles: every image (GIFs included) and video in the page body, in order. */
function galleryItems(blocks: Block[]) {
  return blocks.flatMap((b) => {
    if (b.type === "image") {
      const src = imageUrl(b);
      return src ? [{ src, alt: b.image.caption.map((c) => c.plain_text).join("") }] : [];
    }
    if (b.type === "video") {
      const src = videoUrl(b);
      return src ? [{ src, alt: b.video.caption.map((c) => c.plain_text).join(""), video: true }] : [];
    }
    return [];
  });
}

export default async function ProjectPage({ params }: Params) {
  const data = await getProject((await params).slug);
  if (!data) notFound();
  const { project, prev, next } = data;
  const blocks = await getBlocks(project.id);

  if (project.layout === "Gallery") {
    const images = galleryItems(blocks);
    return (
      <div className="dot-grid px-4 pb-24 pt-16 sm:px-3">
        <GalleryIntro
          className="bg-tint"
          title={project.title}
          summary={project.summary}
          links={[
            ...(project.printsLink ? [{ label: "Buy my prints", href: project.printsLink }] : []),
            ...(project.website ? [{ label: "View website", href: project.website }] : []),
          ]}
        />

        <div id="gallery" className="mt-16 scroll-mt-[86px] bg-tint p-3 sm:mx-4 sm:p-4">
          <Gallery images={images} perRow={project.perRow} />
        </div>

        {prev && next && <PagerNav prev={prev} next={next} className="mx-auto mt-16 w-fit bg-tint px-6 py-4 sm:mt-24" />}
      </div>
    );
  }

  if (project.layout === "Case study") return <CaseStudy project={project} blocks={blocks} prev={prev} next={next} />;

  if (project.layout === "Editorial") {
    // Text above the first image sits beside the details; without any, the Summary does.
    const { intro, images } = splitImages(blocks);
    return (
      <article className="mx-auto w-full max-w-[1242px] px-6 pb-24 pt-6 sm:pt-[14px]">
        <ProjectHeader project={project} cover={project.cover} linkLabel="Download case study">
          {intro.length > 0 ? (
            <CaseStudyBody blocks={intro} first="mt-8 sm:mt-10" />
          ) : (
            project.summary.split(/\n\s*\n/).map((para, i) => (
              <p key={para} className={`${i === 0 ? "mt-8 sm:mt-10" : "mt-[1.35em]"} whitespace-pre-line text-xl text-muted`}>
                {para}
              </p>
            ))
          )}
        </ProjectHeader>

        <div className="mt-16 sm:mt-24">
          <Editorial images={images} />
        </div>

        {prev && next && <PagerNav prev={prev} next={next} />}
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-[1512px] px-4 pb-24 pt-16 sm:px-6">
      <header className="mb-12 grid gap-8 md:grid-cols-[1fr_minmax(0,560px)]">
        <h1 className="text-display leading-[1.1] tracking-tight text-accent">{project.title}</h1>
        <div className="space-y-6">
          {project.summary &&
            project.summary.split(/\n\s*\n/).map((para) => (
              <p key={para} className="text-lg leading-[1.35]">{para}</p>
            ))}
          <dl className="label grid grid-cols-3 gap-4 text-sm text-accent">
            {project.roles.length > 0 && <Meta label="Role" value={project.roles.join(" / ")} />}
            {project.industry && <Meta label="Industry" value={project.industry} />}
            {project.years && <Meta label="Year" value={project.years} />}
          </dl>
          <div className="label flex flex-wrap gap-6 text-accent">
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

      {prev && next && <PagerNav prev={prev} next={next} />}
    </article>
  );
}

function Body({ layout, blocks }: { layout: string; blocks: Block[] }) {
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
