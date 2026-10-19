import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { getProjects, getThumbnails } from "@/lib/notion";

export const revalidate = 300;

export default async function Home() {
  const projects = (await getProjects()).filter((p) => p.featured);
  const featured = await Promise.all(
    projects.map(async (p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      years: p.years,
      roles: p.roles,
      categories: p.categories,
      industry: p.industry,
      thumbnails: await getThumbnails(p),
    })),
  );

  return (
    <>
      <Hero />
      <FeaturedWork projects={featured} year={new Date().getFullYear()} />
    </>
  );
}
