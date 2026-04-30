# 🛡️ Cyber Defender – Personal Portfolio

> **Tran Duc Minh (Alex)** · Cyber Security Specialist  
> A portfolio website with a cyberpunk dark theme, animated canvas background, and interactive dashboard widgets.

---

## 🌐 Live Preview

Open `index.html` (root) — auto-redirects to `Main/index.html`.  
Or serve locally:

```bash
npx http-server . -p 3456
# Visit http://127.0.0.1:3456/Main/index.html
```

---

## 📁 Project Structure

```
Introduction/
│
├── index.html                  # Root entry (redirects to Main/)
│
├── Main/                       # Homepage
│   ├── index.html              # Hero dashboard layout
│   ├── style.css               # Global theme: variables, navbar, hero, widgets
│   ├── script.js               # Homepage animations: canvas, globe, chart, counters
│   ├── subpage.css             # Sub-page overrides + page-specific components
│   ├── subpage.js              # Sub-page shared JS: canvas bg, skill bars, scroll
│   └── Vest.png                # Profile photo (shared across all pages)
│
├── Experience/
│   └── index.html              # Work experience timeline
│
├── Education/
│   └── index.html              # Education + certifications
│
├── Skills/
│   └── index.html              # Skill tag badges + animated proficiency bars
│
├── Project/
│   └── index.html              # Featured projects card grid
│
└── Contact/
    └── index.html              # Contact info and social links
```

---

## 🎨 Design System

Defined via CSS custom properties in `Main/style.css`:

| Token | Value | Usage |
|---|---|---|
| `--bg-deep` | `#020b18` | Page background |
| `--bg-card` | `rgba(4,18,38,0.88)` | Widget / card surfaces |
| `--cyan` | `#00e5ff` | Primary accent, glows, borders |
| `--purple` | `#7c3aed` | Secondary accent, gradients |
| `--green` | `#00ff88` | Active / success indicators |
| `--border` | `rgba(0,229,255,0.18)` | Card borders |
| `--font-title` | `Orbitron` | Headings, navbar links |
| `--font-mono` | `Share Tech Mono` | Labels, badges, tags |
| `--font-body` | `Inter` | Body text, descriptions |

---

## 🖥️ Homepage Layout (`Main/index.html`)

Full-viewport 4-column dashboard grid:

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  LEFT PANEL  │  HERO PHOTO  │  HERO TEXT   │ RIGHT PANEL  │
│  System      │  (glow ring) │  CYBER       │  Firewall    │
│  Protection  │              │  SECURITY    │  Status      │
│  Monitor     │  Vest.png    │  Name Card   │              │
│  Sessions    │  floating    │  CTA Buttons │  Globe       │
│  Connect     │              │  Competency  │  Canvas      │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### Animations (`Main/script.js`)

| Animation | Description |
|---|---|
| **Particle Canvas** | 90 drifting particles + connecting lines on a dark grid |
| **Glow Ring** | Dual rotating ring behind the profile photo |
| **Hero Float** | Profile photo bobs up/down continuously |
| **Monitor Chart** | Live-updating polyline chart with cyan gradient fill |
| **Active Sessions** | Counter animates 2000 → 2,847 on load, live pulse after |
| **Globe Canvas** | Rotating 3D wireframe globe with dot nodes and connections |
| **Firewall Cells** | Random cell blink pattern simulating firewall activity |
| **Protection Bars** | CSS-transitioned width bars animate to their % values |
| **Entrance Fade** | All widgets fade up sequentially on page load |

---

## 📄 Sub-pages

All sub-pages share the same navbar, animated canvas background, scanline overlay, and scrollable layout.

| Page | Route | Content |
|---|---|---|
| **Experience** | `/Experience/index.html` | Vertical timeline with job title, company, duties |
| **Education** | `/Education/index.html` | University card + planned certifications grid |
| **Skills** | `/Skills/index.html` | Tag badges by category + animated skill-level bars |
| **Projects** | `/Project/index.html` | Card grid with tech pills and live project links |
| **Contact** | `/Contact/index.html` | Address, email, phone, Facebook, TikTok, LinkedIn, GitHub |

---

## 🔧 Shared Files

### `Main/style.css`
Global stylesheet loaded by **every page**. Contains CSS variables, reset, navbar, hero section, widget styles, left panel, right panel, and all animation keyframes.

### `Main/subpage.css`
Loaded **only by sub-pages** (after `style.css`). Overrides `overflow: hidden` from the main layout and adds sub-page-specific components:
- `.subpage-wrapper` — scrollable page container
- `.cyber-card` — glassmorphic content card with corner brackets
- `.timeline` / `.timeline-item` — experience page
- `.edu-card` — education page
- `.skill-bar-fill` — animated skill bars (Skills page)
- `.project-grid` / `.project-card` — project cards
- `.contact-grid` / `.contact-item` — contact page

### `Main/subpage.js`
Loaded **only by sub-pages**. Handles:
- Animated particle canvas (fixed background)
- `IntersectionObserver` for skill bar animations
- Navbar background change on scroll
- `.fade-up` entrance animation trigger

### `Main/script.js`
Loaded **only by the homepage**. Handles all homepage-specific animations listed in the table above.

---

## 🔗 Navigation

| Label | Destination |
|---|---|
| HOME | `Main/index.html` |
| EXPERIENCE | `Experience/index.html` |
| SKILLS | `Skills/index.html` |
| PROJECTS | `Project/index.html` |
| CONTACT | `Contact/index.html` |

---

## 📦 Dependencies (CDN — no build step required)

| Library | Purpose |
|---|---|
| [Google Fonts – Orbitron](https://fonts.google.com/specimen/Orbitron) | Title / heading font |
| [Google Fonts – Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) | Monospace labels |
| [Google Fonts – Inter](https://fonts.google.com/specimen/Inter) | Body text |
| [Bootstrap Icons 1.11](https://icons.getbootstrap.com/) | All UI icons (CSS only, no JS) |

> Pure **HTML + Vanilla CSS + Vanilla JS** — no framework, no bundler.

---

## 👤 Author

**Tran Duc Minh (Alex)**  
Cyber Security Engineer · Dong A University (2025–2029)

| Platform | Link |
|---|---|
| LinkedIn | [linkedin.com/in/trminhdev](https://www.linkedin.com/in/trminhdev/) |
| GitHub | [github.com/trminh-developer](https://github.com/trminh-developer) |
| Email | trminhlaptrinhvien@gmail.com |
| Phone | 0382 652 732 |
| Facebook | [TrMinhZz](https://facebook.com/TrMinhZz) |
| TikTok | [@trminh\_zz](https://www.tiktok.com/@trminh_zz) |

---

*© 2025 Tran Duc Minh (Alex). All rights reserved.*