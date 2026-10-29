import "server-only";
import { cache } from "react";
import {
  Client,
  collectPaginatedAPI,
  isFullBlock,
  isFullPage,
} from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type Layout = "Case study" | "Gallery" | "Showcase" | "Editorial";

export type Project = {
  id: string;
  title: string;
  slug: string;
  layout: Layout;
  summary: string;
  years: string;
  roles: string[];
  categories: string[];
  industry: string | null;
  website: string | null;
  printsLink: string | null;
  order: number;
  featured: boolean;
  cover: string | null;
  thumbnails: string[];
  /** Replaces the first thumbnail in the home page row on phones. */
  mobileThumbnail: string | null;
};

/** A Notion block with its children already loaded (for columns, toggles, lists). */
export type Block = BlockObjectResponse & { children?: Block[] };

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  // Only overridden for local testing against a mock API.
  baseUrl: process.env.NOTION_API_BASE_URL || undefined,
});

function dataSourceId() {
  const id = process.env.NOTION_DATA_SOURCE_ID;
  if (!id) throw new Error("NOTION_DATA_SOURCE_ID is not set");
  return id;
}

type Props = PageObjectResponse["properties"];

function text(props: Props, name: string): string {
  const p = props[name];
  if (!p) return "";
  if (p.type === "title") return p.title.map((t) => t.plain_text).join("");
  if (p.type === "rich_text") return p.rich_text.map((t) => t.plain_text).join("");
  return "";
}

function select(props: Props, name: string): string | null {
  const p = props[name];
  return p?.type === "select" ? (p.select?.name ?? null) : null;
}

function multi(props: Props, name: string): string[] {
  const p = props[name];
  return p?.type === "multi_select" ? p.multi_select.map((o) => o.name) : [];
}

function num(props: Props, name: string): number | null {
  const p = props[name];
  return p?.type === "number" ? p.number : null;
}

function url(props: Props, name: string): string | null {
  const p = props[name];
  return p?.type === "url" ? p.url : null;
}

function checkbox(props: Props, name: string): boolean {
  const p = props[name];
  return p?.type === "checkbox" ? p.checkbox : false;
}

/**
 * Notion-hosted files come with signed URLs that expire after an hour, so they
 * are served through /api/notion-image, which looks up a fresh URL on request.
 * External URLs never expire and are used directly.
 */
function fileUrls(page: PageObjectResponse, name: string): string[] {
  const p = page.properties[name];
  if (p?.type !== "files") return [];
  return p.files.map((f, i) =>
    f.type === "external"
      ? f.external.url
      : `/api/notion-image/prop/${page.id}~${encodeURIComponent(name)}~${i}`,
  );
}

function pageCoverUrl(page: PageObjectResponse): string | null {
  const [fromProp] = fileUrls(page, "Cover");
  if (fromProp) return fromProp;
  if (!page.cover) return null;
  return page.cover.type === "external" ? page.cover.external.url : `/api/notion-image/cover/${page.id}`;
}

function toProject(page: PageObjectResponse): Project {
  const props = page.properties;
  const layout = select(props, "Layout");
  return {
    id: page.id,
    title: text(props, "Title"),
    slug: text(props, "Slug").trim() || page.id,
    layout: layout === "Gallery" || layout === "Showcase" || layout === "Editorial" ? layout : "Case study",
    summary: text(props, "Summary"),
    years: text(props, "Years"),
    roles: multi(props, "Role"),
    categories: multi(props, "Category"),
    industry: select(props, "Industry"),
    website: url(props, "Website"),
    printsLink: url(props, "Prints link"),
    order: num(props, "Order") ?? Number.MAX_SAFE_INTEGER,
    featured: checkbox(props, "Featured"),
    cover: pageCoverUrl(page),
    thumbnails: fileUrls(page, "Thumbnails"),
    mobileThumbnail: fileUrls(page, "Mobile thumbnail")[0] ?? null,
  };
}

/** All published projects, in the order set by the "Order" property. */
export const getProjects = cache(async (): Promise<Project[]> => {
  const results = await collectPaginatedAPI(notion.dataSources.query, {
    data_source_id: dataSourceId(),
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Order", direction: "ascending" }],
  });
  return results.filter(isFullPage).map(toProject);
});

export const getProject = cache(async (slug: string) => {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  const n = projects.length;
  return {
    project: projects[index],
    prev: n > 1 ? projects[(index - 1 + n) % n] : null,
    next: n > 1 ? projects[(index + 1) % n] : null,
  };
});

async function listChildren(blockId: string): Promise<Block[]> {
  const blocks = (
    await collectPaginatedAPI(notion.blocks.children.list, { block_id: blockId })
  ).filter(isFullBlock);
  return Promise.all(
    blocks.map(async (b) =>
      b.has_children && b.type !== "child_page" && b.type !== "child_database"
        ? { ...b, children: await listChildren(b.id) }
        : b,
    ),
  );
}

export const getBlocks = cache(listChildren);

/**
 * Images for a project's home page row: the Thumbnails property, else the first images in the page.
 * Editorial pages lead with their cover (the header image), since their body holds only spreads.
 */
export async function getThumbnails(project: Project, limit = 4): Promise<string[]> {
  if (project.thumbnails.length > 0) return project.thumbnails;
  const blocks = await getBlocks(project.id);
  const lead = project.layout === "Editorial" && project.cover ? [project.cover] : [];
  return [...lead, ...blocks.map(imageUrl).filter((u): u is string => !!u)].slice(0, limit);
}

/** URL to show for an image block; Notion-hosted files go through the refresh proxy. */
export function imageUrl(block: Block): string | null {
  if (block.type !== "image") return null;
  return block.image.type === "external"
    ? block.image.external.url
    : `/api/notion-image/block/${block.id}`;
}

/** Fresh signed URL for a Notion-hosted file, used by the image proxy route. */
export async function freshFileUrl(kind: "block" | "cover" | "prop", id: string): Promise<string | null> {
  if (kind === "block") {
    const block = await notion.blocks.retrieve({ block_id: id });
    if (!isFullBlock(block) || block.type !== "image") return null;
    return block.image.type === "file" ? block.image.file.url : block.image.external.url;
  }
  const [pageId, propName, index] = kind === "prop" ? id.split("~") : [id];
  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!isFullPage(page)) return null;
  if (kind === "cover") {
    if (!page.cover) return null;
    return page.cover.type === "file" ? page.cover.file.url : page.cover.external.url;
  }
  const prop = page.properties[decodeURIComponent(propName ?? "")];
  if (prop?.type !== "files") return null;
  const f = prop.files[Number(index)];
  if (!f) return null;
  return f.type === "file" ? f.file.url : f.external.url;
}
