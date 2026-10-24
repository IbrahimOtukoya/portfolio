/** Project pages sit on the off-white tint so images with white backgrounds stand apart. */
export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-tint">{children}</div>;
}
