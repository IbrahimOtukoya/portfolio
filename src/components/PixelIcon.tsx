// Pixel-art icons drawn as squares, transcribed from the Figma file.
// Each rect is [x, y, width, height, fill] in the icon's own pixel units.

type Rect = [number, number, number, number, string];

const O = "var(--orange)";
const R = "var(--red)";
const B = "var(--accent)";
const S = "var(--accent-soft)";

const icons = {
  // "READ CASE STUDY" diamond, 20×20 (Figma 680:483)
  diamond: {
    size: [20, 20],
    rects: [
      [4, 4, 12, 12, O], [8, 4, 4, 4, R], [8, 0, 4, 4, O], [8, 16, 4, 4, O], [0, 8, 4, 4, O],
      [16, 8, 4, 4, O], [4, 12, 4, 4, O], [8, 12, 4, 4, R], [8, 8, 4, 4, R], [12, 8, 4, 4, R], [4, 8, 4, 4, R],
    ],
  },
  // Location pin in the "[BASED IN LAGOS, NIGERIA]" chip, 12×16 (Figma 152:109508)
  pin: {
    size: [12, 16],
    rects: [
      [2, 8, 4, 4, O], [0, 4, 4, 4, O], [6, 0, 4, 4, O], [2, 0, 4, 4, O], [6, 8, 4, 4, O],
      [4, 12, 4, 4, O], [4, 4, 4, 4, R], [8, 4, 4, 4, O],
    ],
  },
  // Pagination chevron, 12×12, pointing left (Figma 573:177)
  chevron: {
    size: [12, 12],
    rects: [[8, 0, 4, 4, S], [4, 0, 4, 4, B], [0, 4, 4, 4, B], [4, 8, 4, 4, B], [8, 8, 4, 4, S], [4, 4, 4, 4, S]],
  },
} satisfies Record<string, { size: [number, number]; rects: Rect[] }>;

export function PixelIcon({
  name,
  className,
  flip,
}: {
  name: keyof typeof icons;
  className?: string;
  flip?: boolean;
}) {
  const { size, rects } = icons[name];
  return (
    <svg
      width={size[0]}
      height={size[1]}
      viewBox={`0 0 ${size[0]} ${size[1]}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {(rects as Rect[]).map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </svg>
  );
}
