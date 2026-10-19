# Ibrahim Otukoya — portfolio

Next.js site on Vercel. Projects are managed in the Notion database **Portfolio Projects**; Home hero, About and Archive content lives in `src/content/site.ts`.

## How content works

Each row in the Notion database is one project. Only rows with **Published** ticked appear on the site.

| Property | What it does |
|---|---|
| Title, Summary | Heading and intro text |
| Slug | URL, e.g. `anchor` → `/anchor` |
| Layout | **Case study** (text and images in order), **Gallery** (image grid, click to zoom), **Showcase** (flip-book; each image is one page) |
| Role, Industry, Year | Tags shown on the card and project page |
| Website, Prints link | Optional buttons on the project page |
| Order | Position on the home grid and in previous/next links |
| Featured | Shows on the home page |
| Cover | Card thumbnail (falls back to the page cover) |

The page body is the content. For Gallery and Showcase, any text above the first image becomes the intro.

Edits appear on the site within 5 minutes. To refresh immediately, open `https://<your-site>/api/revalidate?secret=<REVALIDATE_SECRET>`.

## Local development

```bash
cp .env.example .env.local   # fill in NOTION_TOKEN and REVALIDATE_SECRET
npm install
npm run dev
```

## Deploying

Import the repo in Vercel, add the three variables from `.env.example` under Settings → Environment Variables, and deploy.
