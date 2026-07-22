# Flutterby Studio website

A handcrafted, accessible, one-page photography site for Amber’s Flutterby Studio. The visual direction is **artful wonder, honest connection**: warm botanical color, editorial type, organic portrait framing, and straightforward invitations to connect.

## Files

- `index.html` — semantic page content, metadata, Open Graph, and JSON-LD
- `styles.css` / `script.js` — responsive design and accessible mobile navigation
- `images/` — optimized, served photos, icons, promotion, and 1200×630 social image
- `design/` and `research/` — unserved source materials and working references
- `llms.txt`, `robots.txt`, `sitemap.xml` — answer-engine and search discovery
- `tests/a11y/` — axe-core, Pa11y, and keyboard checks
- `.github/workflows/deploy-pages.yml` — quality-gated GitHub Pages deployment

## Run locally

The shipped site has no runtime dependencies. Open `index.html` directly, or serve the repository root. For the complete development checks:

```bash
npm install
npx playwright install chromium
npm run lint
npm run a11y
```

Dependencies were intentionally not installed during the initial build.

## Deploy

1. Push to `main` on `git@github.com:grndlvl/flutterby.git`.
2. In GitHub, choose **Settings → Pages → Source: GitHub Actions**.

The workflow deploys only after HTML/CSS/format linting and axe-core/Pa11y/keyboard checks pass. It assembles a clean `_site` artifact containing only public site files, so `design/`, `research/`, tests, and tooling are not served.

## Source and design notes

The hero and most portfolio images use owner-supplied originals from `research/portfolio/`; the wedding image is an uncropped original harvested from a public Instagram post supplied by the owner. The newborn twins portrait is an owner-supplied original downloaded from Amber's Facebook post (`research/portfolio/481300829_1391292948823566_2686417284140265288_n.jpg`). Optimized JPG and WebP exports live in `images/`.

The active logo source is `research/ChatGPT Image Jul 22, 2026, 08_47_19 AM.png`; its light checkerboard background is removed during export for transparent PNG and WebP header assets. The footer mark uses a separate icon-only variant, `research/ChatGPT Image Jul 22, 2026, 08_52_53 AM.png` (same checkerboard-removal treatment, then cropped to content and exported as `images/footer-mark.png`/`.webp`).

Copy is based on Amber’s supplied introduction and public Flutterby Studio Facebook materials. Photography, logo, current-promotion art, and pricing-guide source material were supplied/harvested from Flutterby Studio’s Facebook presence and retained in `design/source/`; optimized exports are in `images/`. The site does not use third-party photography.

Amber’s About portrait is from her confirmed Instagram post at `https://www.instagram.com/p/Da73SQJxoBF/`; her daughter took the photograph and Amber edited it.

## ⚠️ Verify before launch

- Confirm Amber approves every photo for public website use and that image provenance/permissions are correct.
- The configured public URL is `https://grndlvl.github.io/flutterby/`; update canonical, Open Graph, JSON-LD, and sitemap URLs together if the domain changes.
- Confirm the repository’s default deployment branch is `main`.
- Confirm `flutterbystudio13@gmail.com` is the preferred public email and the Facebook and Instagram profiles are the preferred contact routes.
- Confirm the promotion at the linked Facebook post is still current; remove or replace it when it expires.
- Confirm all prices, inclusions, retainer terms, album/USB extras, and wedding coverage remain current. They were transcribed conservatively from the supplied pricing guide.
- Confirm whether “Flutterby Studio,” “Flutterby Photography by Amber,” or another name is the official display/business name.
- Confirm the service area now claimed for local SEO (Augusta, Grovetown, North Augusta, and the CSRA generally) is accurate and complete.
- Set a real Web3Forms access key in the contact form (search `index.html` for `YOUR_WEB3FORMS_ACCESS_KEY`) — get one free at https://web3forms.com before launch, or swap the form for a different backend.
- Confirm whether the testimonial in "In their words" may be attributed by name/handle, or should stay anonymized as "A Flutterby Studio client" (source screenshot: `research/486997795_1411613440124850_7671232846129551128_n.jpg`).
- Install dependencies and run the required local quality gates before treating the site as launch-ready.
