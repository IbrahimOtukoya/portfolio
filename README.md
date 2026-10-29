# Ibrahim Otukoya — portfolio

Next.js site on Vercel, built from the Figma file "Portfolio". Projects are managed in the Notion database **Portfolio Projects**; Home hero, About and Archive content lives in `src/content/site.ts`.

## How content works

Each row in the Notion database is one project. Only rows with **Published** ticked appear on the site.

| Property | What it does |
|---|---|
| Title, Summary | Heading and intro text |
| Slug | URL, e.g. `anchor` → `/anchor` |
| Layout | **Case study** (text and images in order), **Gallery** (image grid, click to zoom), **Showcase** (flip-book; each image is one page), **Editorial** (sideways carousel with dots; each image is one spread mockup) |
| Years, Role, Industry | The /YEAR, /ROLE and INDUSTRY columns on the home page |
| Category | Drives the /FILTER list (Branding, Illustration, Editorial, Graphic Design) |
| Thumbnails | Images in the home page row; if empty, the first 4 images in the page are used |
| Website, Prints link | Optional buttons on the project page |
| Order | Position on the home grid and in previous/next links |
| Featured | Shows on the home page |
| Cover | Social preview image (falls back to the page cover) |

The page body is the content. For Gallery, Showcase and Editorial, any text above the first image becomes the intro.

Edits appear on the site within 5 minutes. To refresh immediately, open `https://<your-site>/api/revalidate?secret=<REVALIDATE_SECRET>`.

## Local development

```bash
cp .env.example .env.local   # fill in NOTION_TOKEN and REVALIDATE_SECRET
npm install
npm run dev
```

## Deploying

Import the repo in Vercel, add the three variables from `.env.example` under Settings → Environment Variables, and deploy.

## Pixel art

The navbar icon, hero illustrations and footer portrait are SVGs in `public/pixel/`, exported from Figma.
