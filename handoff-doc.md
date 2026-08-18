# Handoff Doc — Nessy Explores (Phuket Tourism Site)

**Project:** Nessy Explores — "Explore Phuket, Beyond the Shore"
**Jira:** [WMMT-1524](https://sellsuki.atlassian.net/browse/WMMT-1524)
**Handoff date:** 2026-08-04
**Designer (lead):** Krittiya Wongwattanachai (krittiya.won@sellsuki.com)
**Status:** Ready for client review — **not yet signed off, not yet deployed**
**Revision:** r2 (2026-08-04) — ปรับ CI ทั้งเว็บมาใช้ brand book จริงของลูกค้า (สี ฟอนต์ โลโก้ ภาพถ่าย) palette เขียว-ส้มใน brief แรกยกเลิกแล้ว ดู Section B

---

# Section A — Project Summary

**Objective**
เว็บไซต์นำเสนอแพ็กเกจทัวร์ภูเก็ตของ Nessy Explores สำหรับลูกค้าปลายทาง (B2C) และเอเจนซี่/รีเซลเลอร์ (B2B)
โดยวางตำแหน่งแบรนด์เป็น **local operator ที่เชื่อถือได้** ไม่ใช่เว็บดีลราคาถูก

**เว็บนี้ไม่รับชำระเงินออนไลน์** — ทุก CTA พาไปคุยต่อที่ LINE / WhatsApp
การออกลิงก์ชำระเงิน (KBank generate payment link) เกิดขึ้นในแชท ไม่ใช่บนเว็บ
เหตุผลนี้อธิบายไว้บนเว็บเองในการ์ด "ทำไมเราไม่มีปุ่มจ่ายเงินบนเว็บ" (index.html)

**Deliverables (built)**
| Page | ไฟล์ | หน้าที่ |
|---|---|---|
| Landing | `index.html` | Hero, จุดแข็ง, 6 หมวด, 6 แพ็กเกจเด่น, วิธีจอง, ความน่าเชื่อถือ + ประกาศป้องกันมิจฉาชีพ, รีวิว, FAQ |
| Catalog | `packages.html` | 20 แพ็กเกจจริง + ตัวกรอง 7 หมวด + deep link (`#sea`, `#dive`, …) |
| Local Phuket | `local.html` | เส้นทาง local ที่คู่แข่งไม่มี |
| For Agency | `agency.html` | หน้า B2B สำหรับเอเจนซี่/รีเซลเลอร์ |
| Brand & CI | `brand.html` | **หน้านำเสนอ CI ให้ลูกค้า** — palette, สัดส่วนสี, กฎการใช้, contrast, typography, component |

**Out of scope (ยืนยันแล้ว)**
- ระบบชำระเงิน / ตะกร้า / ยืนยันการจองอัตโนมัติ
- CMS / หลังบ้านแก้เนื้อหา
- หลายภาษา (EN / CN / RU) — ดู Section F
- ระบบล็อกอินเอเจนซี่ + ราคาเน็ตรายเจ้า
- ภาพถ่ายครบทุกหมวด — ใช้ภาพจาก brand book 7 รูปเท่าที่มี ส่วนที่ขาดใช้ SVG illustration (ดู Section B → Artwork)

---

# Section B — Design

**Stack (ล็อกที่ Stage 1)**
Static HTML + vanilla CSS + vanilla JS → Vercel · **ไม่มี build step**

*เหตุผล:* ไซต์ 5 หน้า เนื้อหาค่อนข้างคงที่ ไม่มี state ซับซ้อน
ทีมที่รับต่อไม่จำเป็นต้องรู้ framework ใด ๆ แก้ไฟล์ HTML ตรง ๆ ได้เลย
โหลดเร็วโดยไม่ต้อง optimize เพิ่ม และ deploy Vercel ได้ทันทีแบบ zero-config
**ไม่ใช้ Sellsuki DS 1.0 / 2.0** ตามกฎ project track

## CI Palette (จาก brand book ของลูกค้า)

> **ประวัติที่ต้องรู้:** brief แรกให้ palette เขียว-ส้ม (Andaman Teal / Phuket Coral / Tropical Mango / Sandy Cream) และฟอนต์หัวเรื่อง Mitr
> หลัง Stage 3 ลูกค้าส่ง **brand book จริง** (`nessy_explores_brand_book_by_pomelli.pdf`) ที่มีโลโก้ palette และภาพถ่ายของแบรนด์ → เปลี่ยนทั้งเว็บมาใช้ brand book **palette เดิมยกเลิกทั้งชุด** ถ้าเจอ hex เดิมที่ไหน = ตกค้าง ให้แก้

### 4 สีหลักจาก brand book

| Role | Name | Token | Hex | ใช้ที่ |
|---|---|---|---|---|
| Primary | Ocean Blue | `--blue` | `#1677B8` | ปุ่มหลัก ลิงก์ ไฮไลต์ ดาวเรตติ้ง |
| Primary Dark | Prussian Blue | `--prussian` | `#123A5A` | Footer, ตัวอักษรหลัก, section ความน่าเชื่อถือ, scrim บนภาพถ่าย |
| Secondary | Sky Blue | `--sky` | `#62B6E7` | ไฮไลต์บนพื้นเข้ม (`em` ใน h1), รายละเอียดเล็ก ๆ |
| Background | Frost | `--frost` | `#EAF7FD` | พื้นหลัง section สลับกับขาว |

### เฉดที่คำนวณต่อ (ไม่มีใน brand book — เพิ่มเพราะ contrast บังคับ)

| Token | Hex | ทำไมต้องมี |
|---|---|---|
| `--blue-dark` `#12639B` / `--blue-darker` `#0E5080` | | hover ของปุ่ม และ **ลิงก์บนพื้น Frost** — Ocean Blue บน Frost ได้แค่ 4.40:1 ตก AA |
| `--prussian-deep` `#0C2A42` | | สีของ scrim ทับภาพถ่าย |
| `--muted` `#54748D` | | ข้อความรองบนขาว 4.93:1 (`#5A7A93` ที่ลองก่อนได้ 4.53:1 เฉียดเกินไป) |
| `--sunset` `#F5A055` / `--sunset-dark` `#E08A3C` | | Accent ดึงจากดวงอาทิตย์ในโลโก้ — **ป้ายโปรโมชั่น/ริบบิ้นตามฤดูเท่านั้น ~3% ของหน้า** |
| `--warn` `#A63D1E` | | ข้อความเตือนในโซนกันมิจฉาชีพ |

**สัดส่วน:** 62% White + Frost · 25% Ocean + Prussian · 10% Sky · 3% Sunset

### กฎบังคับ — อ่านก่อนแก้สี

1. **ตัวอักษรขาวบน Sky Blue = 2.24:1 และบน Sunset = 2.09:1 → ตก WCAG ทั้ง 4.5:1 และ 3:1**
   ทุกพื้นผิว Sky Blue และ Sunset บนเว็บนี้ใช้ตัวอักษร Prussian Blue (7.10:1 และ 6.51:1)
2. **Sunset ไม่ใช่สีปุ่ม** — ระบบมีปุ่มระดับเดียวคือ Ocean Blue ถ้ามีปุ่มสองสีแข่งกันในหน้าเดียว ผู้ใช้จะไม่รู้ว่าต้องกดอันไหน และเว็บจะอ่านเป็นเว็บดีลราคาถูก ซึ่งขัดกับ positioning ใน Section A
3. **Sky Blue ห้ามเป็นสีตัวอักษรบนขาวหรือ Frost** (1.94:1 / 1.85:1) ใช้ได้เฉพาะบนพื้นเข้ม
4. ลิงก์ในพื้น Frost ต้องใช้ `--blue-darker` ไม่ใช่ `--blue`

**Contrast ที่วัดแล้ว** — ตารางเต็ม 13 คู่ (10 ผ่าน / 3 ที่ห้ามใช้) เผยแพร่บน `brand.html` section 04 พร้อมเหตุผล ตัวเลขทุกตัวคำนวณตามสูตร WCAG relative luminance และ cross-check ด้วยสคริปต์แยก

**Typography**
- **ฟอนต์เดียวทั้งระบบ: `Noto Sans Thai`** ไล่ลำดับด้วยน้ำหนัก — 700 หัวเรื่อง · 500 label/ปุ่ม · 400 เนื้อหา
- *เหตุผล:* brand book ไม่ได้กำหนดฟอนต์ไทย และ wordmark ในโลโก้มีคาแรกเตอร์ของตัวเองอยู่แล้ว การใส่ฟอนต์หัวเรื่องตัวที่สองจะไปแข่งกับโลโก้
- โหลดจาก Google Fonts ด้วย `@import` + `display=swap` (ใน `assets/style.css`)
- Base body 16px · line-height 1.5–1.75 · H1 52/1.28/700
- **ห้าม** เพิ่มฟอนต์ตัวที่สอง · ห้ามใช้ตัวเอนกับข้อความไทย · ห้ามน้ำหนักต่ำกว่า 400

**Artwork — ภาพถ่ายผสมภาพวาด**

| ใช้อะไร | ที่ไหน |
|---|---|
| **ภาพถ่ายจาก brand book** (7 รูป WebP ใน `assets/img/`) | Hero ทั้ง 5 หน้า + section ใหญ่ (Local teaser, agency teaser, พระใหญ่) |
| **SVG illustration** (`assets/sprite.js`) | การ์ดแพ็กเกจ 20 ใบ · category tile 6 ใบ · icon ~45 ตัว |

*เหตุผลที่ยังไม่เป็นภาพถ่ายทั้งหมด:* ชุดภาพมี 7 รูปและไม่ครอบคลุมหมวด adventure, โชว์, รถรับส่ง การผสมภาพถ่ายกับภาพวาดใน grid เดียวจะอ่านเป็นความไม่เป็นระบบ จึงให้ทั้ง grid เป็นภาพวาดไปก่อน (ดู Section F1 เมื่อได้ภาพเพิ่ม)

`sprite.js` ถูกรีคัลเลอร์เป็นโทนน้ำเงินของแบรนด์แล้ว — Sunset เหลืออยู่แค่ในดวงอาทิตย์/ขอบฟ้าตอนเย็น/ตัวคน เพื่อคุมโทนอุ่นไว้ ~3% ต่อภาพ
เรียกด้วย `<svg><use href="#id"/></svg>` — sprite ถูก inject แบบ synchronous ที่ต้น `<body>`
สัญลักษณ์: ~45 icon (`#i-*`), 6 scene (`#s-island #s-dive #s-adventure #s-show #s-local #s-transfer`), 6 tile (`#c-*`)
Gradient ที่ใช้ร่วมกัน: `g-sky g-sky-dusk g-sea g-sea-light g-jungle g-sun g-stage` — เพิ่ม symbol ใหม่ให้ใช้ชุดนี้ อย่าใส่ hex ใหม่
(`#s-hero` ภาพวาดพาโนรามาเดิมถูกลบแล้วตอนเปลี่ยน hero เป็นภาพถ่าย)

### ⚠️ Scrim บนภาพถ่าย — ผูกกับภาพชุดปัจจุบัน ห้ามเปลี่ยนภาพแล้วไม่วัดใหม่

ภาพถ่ายไม่มีโทนที่การันตีได้เหมือนภาพวาด ค่าความทึบของ scrim ทุกตัวจึงถูก **วัดจากพิกเซลจริงของภาพ** ไม่ใช่กะเอา
วิธีวัด: วาดภาพลง canvas ตาม mapping ของ `object-fit:cover` → หาบล็อก 8×8 ที่สว่างที่สุดในกรอบของข้อความแต่ละชิ้น → composite กับ alpha ของ gradient ตรงตำแหน่งนั้น → คำนวณ contrast

| Rule | ค่า | ผลที่วัดได้ |
|---|---|---|
| `.hero-scrim` (desktop) | `100deg` `.90 → .78 → .52 → .30` | h1 ขาว 8.3:1 · `em` Sky Blue 3.7:1 · lead 6.6:1 · note 5.5:1 |
| `.hero-scrim` (≤860px) | `180deg` `.82 → .78 → .92` | จอแคบข้อความกินเต็มความกว้าง gradient แนวนอนจะทำให้ปลายบรรทัดไปอยู่บนภาพเปล่า |
| `.stats` | `rgba(12,42,66,.86)` | ตัวเลข ≥4.27:1 แม้ภาพหลังเกือบขาว (`.55` ที่ลองก่อนได้ Sky Blue แค่ 1.59:1) |
| `.cat::after` (category tile) | `180deg` `0 @30% → .58 @60% → .90` | h3 ขาว 5.0:1 · p ขาว 90% 5.9:1 แม้พื้นหลังเป็นสีขาวสุด (`#c-transfer` มีตัวรถสี `#EAF7FD` อยู่ตรงที่ caption วางพอดี) |
| `.cat .ic` chip | `rgba(12,42,66,.58)` วงกลมใต้ไอคอน | ไอคอนขาว 4.1:1 ผ่านเกณฑ์กราฟิก 3:1 (เดิม stroke Sky Blue บนท้องฟ้าสว่างได้ ~1.1:1 มองแทบไม่เห็น) |
| `.page-hero-art` opacity `.75` + `.page-hero::after` | `90deg` `.93 → .80 → .48` | ทั้ง 4 หน้าผ่านที่ desktop |
| `.page-hero::after` (≤860px) | `180deg` `.88 → .82` | ที่ 375px แนวนอนทำให้ h1 ของ agency ได้ 2.47:1 (ต้อง 3:1) ต้อง override เป็นแนวตั้ง — วัดใหม่แล้วได้ 4.85–5.25:1 |

**ถ้าเปลี่ยนภาพ hero เป็นรูปที่สว่างกว่า ต้องวัดใหม่** ค่า stop ด้านขวาตั้งไว้บางโดยตั้งใจเพื่อให้เห็นวิวทะเล — ไม่ใช่ค่าที่เผื่อไว้แล้ว
ทางที่ปลอดภัยที่สุดถ้าไม่มีเครื่องมือวัด: ใช้ scrim แบบ flat `rgba(12,42,66,.86)` ทั้งผืน (ผ่านชัวร์ แต่ภาพจะจมกว่าเดิม)

---

# Section C — Code

**โครงไฟล์**
```
index.html          Landing
packages.html       Catalog + filter (20 แพ็กเกจ)
local.html          Local Phuket
agency.html         B2B
brand.html          CI presentation
assets/style.css    981 บรรทัด · 22 section มีเลขกำกับ · CSS custom properties ที่ :root
assets/app.js       117 บรรทัด · mobile nav, scroll reveal, package filter, ปีพุทธศักราช
assets/sprite.js    334 บรรทัด · SVG sprite (icon + scene + tile)
assets/img/         1.0MB · โลโก้ 2 ไฟล์ + favicon 2 ไฟล์ + ภาพถ่าย 7 รูปจาก brand book (WebP)
vercel.json         static host config
project-card.md     Stage 0 PM Card
handoff-doc.md      ไฟล์นี้
```

**ภาพในเว็บอยู่ที่ไหน** (ทุก `<img>` ประกาศ `width`/`height` จริงเพื่อกัน layout shift)

| ไฟล์ | ขนาดจริง | น้ำหนัก | ใช้ที่ |
|---|---|---|---|
| `logo-lockup.webp` | 760×338 | 38KB | `brand.html` เท่านั้น (โชว์ขนาดใหญ่) |
| `logo-mark.webp` | 256×256 | 17KB | navbar + footer ทั้ง 5 หน้า (crop เป็นวงกลมด้วย `border-radius:50%`) |
| `favicon-32.png` / `favicon-180.png` | 32 / 180 | 2.7KB / 53KB | `<link rel=icon>` + apple-touch-icon |
| `hero-bay.webp` | 1280×1067 | 282KB | hero ของ `index.html` (**LCP** — `fetchpriority=high`) + hero ของ `brand.html` |
| `longtail.webp` | 900×1281 | 117KB | hero ของ `packages.html` |
| `old-town-sunset.webp` | 900×1280 | 105KB | hero ของ `local.html` |
| `lagoon.webp` | 867×1233 | 98KB | hero ของ `agency.html` |
| `old-town.webp` | 900×1350 | 145KB | section Local teaser ใน `index.html` |
| `white-beach.webp` | 900×1281 | 60KB | section agency teaser ใน `index.html` |
| `big-buddha.webp` | 900×1283 | 124KB | section ใน `local.html` |

ภาพใน hero ใช้ `loading="eager"` + `fetchpriority="high"` และ `alt=""` (wrapper มี `aria-hidden="true"` เพราะเป็นภาพประกอบพื้นหลัง)
ภาพใน section ใช้ `loading="lazy"` และมี `alt` บรรยายจริงเป็นภาษาไทย

**รันในเครื่อง** — ไม่ต้อง install อะไร ต้องเสิร์ฟผ่าน HTTP (ไม่ใช่ `file://` เพราะ `<use href>` ต้องมี origin)
```bash
python3 -m http.server 4340
# เปิด http://127.0.0.1:4340/index.html
```

**สิ่งที่ `app.js` ทำ**
- Mobile nav — `data-open`, `aria-expanded`, สลับไอคอน `#i-menu`↔`#i-close`, ปิดด้วย Escape แล้วคืนโฟกัส, ปิดเมื่อคลิกลิงก์, รีเซ็ตเมื่อจอกว้างเกิน 860px
- Scroll reveal — IntersectionObserver, stagger 60ms ต่อการ์ด (สูงสุด 6), ข้ามทั้งหมดถ้า `prefers-reduced-motion`
- Package filter — `aria-pressed` บน chip, นับจำนวน, empty state, ประกาศผลผ่าน `aria-live`, รับ deep link จาก hash (มี regex กัน selector injection)
- ปี พ.ศ. ใน footer — `getFullYear() + 543`

**ไม่มี unit / integration / E2E test** — QA ทำแบบ manual ทั้งหมด ดู Section F2

---

# Section D — Deployment

**สถานะ: ยังไม่ deploy** — รอ checkpoint ลูกค้าก่อน

ขั้นตอน deploy staging บน Vercel
1. `vercel` ใน root (หรือ import repo จาก Vercel dashboard)
2. Framework preset: **Other** · Build command: ว่าง · Output directory: `.`
3. เปิด Password Protection สำหรับ staging
4. ส่ง URL ให้ลูกค้า UAT

`vercel.json` ตั้ง `trailingSlash: false` และ cache `assets/*` 1 ชั่วโมงพร้อม `must-revalidate` (สั้นเพราะยังแก้เนื้อหาบ่อยช่วง UAT — ค่อยขยายตอนขึ้น production)

**Rollback:** Vercel dashboard → Deployments → Promote deploy ก่อนหน้า

---

# Section E — Maintenance

| งาน | ใคร | ทำอย่างไร |
|---|---|---|
| แก้ราคา / ชื่อแพ็กเกจ | ลูกค้า หรือ Sellsuki | แก้ `packages.html` ตรง ๆ — 1 แพ็กเกจ = 1 `<article class="tour">` |
| เพิ่มแพ็กเกจ | Sellsuki | copy `<article>` เดิม เปลี่ยน `data-cat`, ชื่อ, ราคา, `<use href>` แล้วอัปเดตตัวเลข "จาก 20 รายการ" |
| เปลี่ยนสี | Sellsuki | แก้ custom property ที่ `:root` ใน `style.css` — **ต้องเช็ค contrast ใหม่** และต้องตรงกับ brand book |
| เพิ่ม icon | Sellsuki | เพิ่ม `<symbol>` ใน `sprite.js` — ใช้ gradient ที่มีอยู่ (`g-sky g-sea g-jungle g-sand g-sun …`) อย่าใส่ hex ใหม่ |
| **เปลี่ยนภาพ hero** | Sellsuki | เปลี่ยน `src` + `width`/`height` ให้ตรงขนาดจริง แล้ว **วัด contrast ของ scrim ใหม่** ดูคำเตือนท้าย Section B |
| เพิ่มภาพถ่ายในการ์ด/หมวด | Sellsuki | ดู Section F1 |
| Deploy | Sellsuki | push → Vercel auto deploy |

---

# Section F — Future Phase Hooks

## F1 — เปลี่ยน SVG ที่เหลือเป็นภาพถ่าย (เมื่อได้ภาพเพิ่ม)

Hero ทั้ง 5 หน้า + 3 section ใหญ่ **เป็นภาพถ่ายแล้ว** ที่เหลือเป็น SVG เพราะยังไม่มีภาพ

| จุด | selector | ratio | ต้องได้ภาพหมวด |
|---|---|---|---|
| การ์ดแพ็กเกจ 20 ใบ | `.tour-media` | 4 / 3 | ครบทั้ง 6 หมวด (ขาด adventure, โชว์, transfer) |
| Category tile 6 ใบ | `.cat-art` `#c-*` | 320×200 | 6 หมวด |

**ทำทั้ง grid พร้อมกัน อย่าทำทีละใบ** — ภาพถ่ายปนภาพวาดใน grid เดียวอ่านเป็นความไม่เรียบร้อย ไม่ใช่ความหลากหลาย

วิธีเปลี่ยน: แทน `<svg …><use href="#…"/></svg>` ด้วย
`<img src="assets/img/…webp" alt="…" width="800" height="600" loading="lazy" decoding="async">`
`.tour-media` มี `aspect-ratio: 4/3` + `overflow: hidden` อยู่แล้ว ภาพจะ crop ให้พอดี
**ต้องคง `alt` ที่สื่อความหมาย** — ข้อความใน `aria-label` ของ SVG เดิมใช้เป็น `alt` ได้เลย
Export เป็น WebP กว้าง ≤900px (ภาพชุดปัจจุบันอยู่ที่ 60–145KB ต่อรูป) — ถ้าไฟล์เกิน ~200KB ให้บีบใหม่

## F2 — QA / สิ่งที่ตรวจแล้ว

**Accessibility — ตรวจเองครบ 5 หน้า อ้าง WCAG 2.1 AA**
| เกณฑ์ | ผล |
|---|---|
| `lang="th"` | ผ่านทุกหน้า |
| `viewport width=device-width, initial-scale=1` (ไม่ล็อก zoom) | ผ่านทุกหน้า |
| `<h1>` หน้าละ 1 ตัว | ผ่านทุกหน้า |
| ลำดับหัวเรื่องไม่ข้ามระดับ | ผ่านทุกหน้า (h1→h3 ใช้ `h2.sr-only` คุม catalog) |
| Skip link + `<main>` | ผ่านทุกหน้า |
| ลิงก์/ปุ่มไม่มีชื่อ | 0 |
| `svg[role=img]` ไม่มี `aria-label` | 0 |
| Contrast ทุกคู่สี | ผ่าน AA (ตาราง Section B + `brand.html` 04) |
| Contrast ข้อความบนภาพถ่าย | วัดจากพิกเซลจริงทุก hero ทั้งที่ desktop และ 375px — ผ่าน (ดูตาราง scrim ท้าย Section B) |
| `<img>` ประกาศ `width`/`height` ครบ | ผ่าน — 0 ภาพที่ไม่มี (กัน CLS) |
| Tap target ≥44px (element แบบ block) | ผ่านทุกหน้าที่ 375px |
| Horizontal overflow ที่ 375px | 0 ทุกหน้า |
| `prefers-reduced-motion` | ปิด reveal + transition ทั้งหมด |
| Focus ring | 3px มองเห็นชัดทั้งพื้นสว่างและพื้นเข้ม |

**ข้อยกเว้นที่ยอมรับได้:** ลิงก์ข้อความใน prose (คำตอบ FAQ, ที่อยู่/เบอร์ใน footer, breadcrumb) กว้างต่ำกว่า 44px — เป็น inline text link ตาม HIG ไม่ต้องขยาย

**ยังไม่ได้ทำ**
- ยังไม่ทดสอบบนเบราว์เซอร์จริงนอก Chromium (ยังไม่เทส Safari / Firefox / iOS / Android จริง)
- ยังไม่รัน Lighthouse
- ยังไม่ทดสอบกับ screen reader จริง (VoiceOver / TalkBack)
- ยังไม่มีการทดสอบกับผู้ใช้จริง

**ฟีเจอร์ที่ควรเทสตอน UAT**
1. Filter 7 หมวดใน packages.html — จำนวนต้องรวมได้ 20 (sea 4 · dive 3 · adventure 4 · show 5 · local 2 · transfer 2)
2. Deep link `packages.html#sea` ต้องเข้ามาพร้อม chip ที่ถูกเลือกไว้
3. Mobile nav เปิด/ปิด/Escape
4. ทุก CTA ต้องไป LINE / WhatsApp ที่ถูกต้อง (**ยังเป็น placeholder** — ดู Section G)
5. Scroll reveal ต้องไม่ทำงานเมื่อเปิด Reduce Motion

## F3 — Backend / ฟีเจอร์อนาคต
ตอนนี้ไม่มี backend เลย ถ้าจะทำต่อ ให้เริ่มจาก
- ฟอร์มขอใบเสนอราคาเอเจนซี่ (`agency.html`) → ปัจจุบันเป็นลิงก์แชท
- ระบบล็อกอินเอเจนซี่ + ราคาเน็ต
- หลายภาษา EN / CN / RU — โครงสร้าง HTML ยังไม่มี i18n ต้องออกแบบใหม่
- CMS สำหรับแก้ราคาแพ็กเกจ

---

# Section G — ต้องได้คำตอบจากลูกค้าก่อน go-live

ทั้งหมดนี้เป็น **placeholder ในโค้ดตอนนี้** ต้องแทนด้วยของจริงก่อนขึ้น production
ดูรายละเอียดคำถามเต็มใน `project-card.md`

1. **เลขใบอนุญาต TAT** — ตอนนี้เขียนว่า `31/XXXXX` ในหลายหน้า (คู่แข่งทุกรายแสดงเลขจริง อันนี้กระทบความน่าเชื่อถือมากที่สุด)
2. **เลขบัญชีธนาคารนิติบุคคล** — สำหรับ section ป้องกันมิจฉาชีพ
3. **LINE OA ID + เบอร์ WhatsApp + Instagram + อีเมลจริง** — ตอนนี้ใช้ `@nessyexplores` / `info@nessyexplores.com` / `partner@nessyexplores.com` เป็น placeholder ทุกที่
4. **ที่อยู่ + เบอร์โทรจริง** — ตอนนี้เบอร์เป็น `076-XXX-XXX`
5. **ภาพถ่ายเพิ่ม** — brand book ให้ 7 รูป (ทะเล เมืองเก่า พระใหญ่ เรือหางยาว) ยังขาด **adventure (ATV, ซิปไลน์, ล่องแก่ง), โชว์, รถรับส่ง** และภาพทีมงาน/ออฟฟิศ (คู่แข่ง 1 รายเล่าเรื่องทีมงานเป็นคน — ดู Appendix)
6. **brand book หน้า 01 และ 06 ยังเป็น template filler** — ดูข้อถัดไป
7. ต้องการหลายภาษาไหม
8. เรตเอเจนซี่ — แสดงบนเว็บ หรือให้ติดต่อขอ
9. ใครดูแลเว็บหลัง handoff

### ⚠️ ข้อสังเกตเกี่ยวกับ brand book — ต้องแจ้งลูกค้า

`nessy_explores_brand_book_by_pomelli.pdf` **หน้า 01 และ 06 ยังเป็นข้อความ template ของ Pomelli ที่ไม่ได้แก้** — เนื้อหาพูดถึง **"Pixel Agency"** ซึ่งเป็นเอเจนซี่ครีเอทีฟ ไม่ใช่บริษัททัวร์ กำหนดโทน "dark cinematic / high-contrast / quietly authoritative" และ values "Strategy before pixels, Iterative craft"

โทนนั้น**ขัดกับบุคลิกแบรนด์** Local · Friendly · Reliable · Adventurous ที่ลูกค้าระบุเอง และขัดกับกลุ่มเป้าหมาย (นักท่องเที่ยวหาทัวร์ ไม่ใช่ลูกค้าเอเจนซี่โฆษณา)

**เราจึงใช้จาก brand book แค่ระบบภาพ** — สี โลโก้ ภาพถ่าย และเว้นเรื่องฟอนต์ให้เลือกเอง ส่วนข้อความ positioning/tone of voice ยึดตาม brief เดิมของลูกค้า
ควรให้ลูกค้าแก้ 2 หน้านั้นก่อนใช้ brand book เป็นเอกสารทางการกับพาร์ทเนอร์ ไม่งั้นเอเจนซี่ที่รับไปขายต่อจะได้ guideline ที่ขัดกันเอง

**ราคาในเว็บมาจากเอกสารลูกค้า "Price update 1772026"** — เป็นราคาจริง ไม่ใช่ตัวอย่าง

---

# Section H — สถานะ Stage

| Stage | สถานะ |
|---|---|
| 0 Brief Intake | เสร็จ — `project-card.md` |
| 1 Research & Plan | เสร็จ — สแกนคู่แข่ง 3 ราย, ล็อก stack |
| 2 Vibe Design | เสร็จ — CI token + design system · **ทำรอบสองหลังได้ brand book** |
| 3 Vibe Code | เสร็จ — 5 หน้า · เปลี่ยนสี ฟอนต์ โลโก้ และภาพทั้งเว็บตาม brand book แล้ว |
| 4 Deploy | **รออยู่** — ต้องได้ OK จากลูกค้าก่อน |
| 5 Test & Improve | Self-QA เสร็จ · **ยังไม่มี client UAT** |
| 6 Handoff | ไฟล์นี้ (draft — จะปิดหลังลูกค้า sign off) |

**Client checkpoint ถัดไป:** ให้ลูกค้าดู 5 หน้านี้ + `brand.html` เพื่อยืนยันว่าการตีความ brand book ถูกต้อง แล้วตอบคำถามใน Section G

**สิ่งที่ต้องให้ลูกค้ายืนยันเป็นพิเศษ (เพราะ brand book ไม่ได้ระบุ เราตัดสินใจแทน)**
1. **ฟอนต์ไทย** — เลือก Noto Sans Thai ตัวเดียวทั้งระบบ
2. **สี accent** — ดึงสีส้ม `#F5A055` จากดวงอาทิตย์ในโลโก้ ใช้กับป้ายโปรโมชั่นเท่านั้น (~3%) ปุ่มหลักยังเป็น Ocean Blue เพราะปุ่มสีส้มจะทำให้เว็บอ่านเป็นเว็บลดราคา
3. **Navbar พื้นขาว** — เพื่อให้โลโก้จริงวางได้พอดีไม่มีกรอบขาว · footer ยังเป็น Prussian Blue เข้มและใช้แค่โลโก้วงกลม
4. **โลโก้ใน navbar ใช้เฉพาะวงกลม + ชื่อแบรนด์เป็นข้อความ HTML** ไม่ใช่ lockup เต็ม เพราะ brand book กำหนดความกว้างขั้นต่ำของ lockup ไว้ที่ 152px ซึ่งเกินความสูงของ navbar (72px) · lockup เต็มโชว์ขนาดใหญ่ที่ `brand.html`
5. **ยังใช้ SVG illustration ในการ์ดแพ็กเกจและ category tile** เพราะภาพถ่ายไม่ครบหมวด

---

## Appendix — จุดต่างจากคู่แข่ง (จาก Stage 1)

สแกน phukettourholiday.com · phuketinsidetour.com · phuketchill.com

| โอกาส | คู่แข่งทำ? | เราทำ |
|---|---|---|
| หน้า B2B / เอเจนซี่ | ไม่มีรายไหนทำ | `agency.html` |
| ประกาศป้องกันมิจฉาชีพ + เลขบัญชีนิติบุคคล | ไม่มีรายไหนทำ | section ความน่าเชื่อถือใน `index.html` |
| เส้นทาง local ที่ไม่ใช่ทัวร์เกาะ | ไม่มีรายไหนทำ | `local.html` |
| เล่าเรื่องทีมงานเป็นคน | มี 1 ราย (phuketchill) | ยังไม่ทำ — ต้องได้ข้อมูลทีมจริง |
| หน้านำเสนอ CI | ไม่มีรายไหนทำ | `brand.html` |

**ข้อควรรู้:** phuketchill.com ตั้งมาตรฐานความน่าเชื่อถือไว้สูงสุด — แสดงเลข TAT พร้อมลิงก์ให้ตรวจสอบได้, ประกันอุบัติเหตุ 1,000,000 บาท, และรูปใบรับรอง เราควรทำให้ได้เท่านี้เป็นอย่างน้อย ซึ่งขึ้นกับข้อ 1–2 ใน Section G
