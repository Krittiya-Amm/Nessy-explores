# PM Card — Nessy Explores (Demo เว็บไซต์บริษัททัวร์)

| | |
|---|---|
| **Jira** | [WMMT-1524](https://sellsuki.atlassian.net/browse/WMMT-1524) — ออกแบบ Demo บริษัททัวร์ - Nessy explores |
| **Epic** | WMMT-1205 NEW PROJECT |
| **Client** | บริษัท กาล-ไช ทัวร์ จำกัด (GAL-SHAI TOUR CO., LTD) |
| **ที่ตั้ง** | 26/1 ถ.ราษฎร์อุทิศ 200 ปี ป่าตอง กะทู้ ภูเก็ต 83150 |
| **Brand** | Nessy Explores |
| **PM / Reporter** | Kwan.Sirikarn |
| **Designer** | krittiya.won |
| **Priority / Due** | High / 2026-08-06 |
| **Status** | Design |
| **Tier** | **S+ / Demo-pitch** — 5 หน้า static, ~2 วัน |

---

## 1. Objective

ทำ **demo เว็บไซต์เพื่อนำเสนอลูกค้า** ให้บริษัททัวร์ภูเก็ตที่ยังไม่เคยมีตัวตนออนไลน์เลย — ให้เห็นภาพว่าถ้าย้ายจาก walk-in only มามีเว็บไซต์ จะนำเสนอตัวเอง นำเสนอแพ็กเกจ และปิดการขายผ่าน LINE/WhatsApp ได้อย่างไร

**เป้าหมายของ demo ไม่ใช่ระบบจองจริง** — เป็นเครื่องมือ pitch ให้ลูกค้าเห็นและตัดสินใจ

---

## 2. Client context

- ธุรกิจเดิม: **มีออฟฟิศรับ walk-in ที่ป่าตองอย่างเดียว** ไม่เคยทำออนไลน์
- ตอนนี้เพิ่งเริ่มศึกษา อยากปั้น/ขยายธุรกิจ
- IG ที่เพิ่งลองทำ: [@nessyarnett](https://www.instagram.com/nessyarnett/)
- มี **เอเจนซี่รับบริการไปขายต่อ** (B2B reseller) — เอเจนซี่พวกนั้นมีเว็บไซต์แล้ว
- ราคาแพ็กเกจ: [Google Doc "Price update 1772026"](https://docs.google.com/document/d/1smUIzE8m9pzwQ-tBCHLQ3Z0oPmLkXPc2/edit)

### Audience 2 กลุ่ม
| | B2C — นักท่องเที่ยว | B2B — เอเจนซี่/พาร์ทเนอร์ |
|---|---|---|
| ต้องการ | เห็นแพ็กเกจ ราคา ความน่าเชื่อถือ | เรทตัวแทน ความเร็วในการตอบ stock |
| จบที่ | LINE / WhatsApp | ติดต่อทีมขายตรง |

---

## 3. Scope

### In scope (5 หน้า static)
1. **index.html** — Landing: hero, จุดแข็ง, หมวดทัวร์, แพ็กเกจแนะนำ, Local teaser, ขั้นตอนจอง 3 สเต็ป, โซนความน่าเชื่อถือ + แจ้งบัญชีกันมิจฉาชีพ, B2B teaser, FAQ
2. **packages.html** — แคตตาล็อกแพ็กเกจทั้งหมด + filter หมวด (ราคาจริงจาก price doc)
3. **local.html** — Local Phuket experiences (จุดต่างของแบรนด์ตามคอนเซปต์ "Beyond the Shore")
4. **agency.html** — B2B / เอเจนซี่พาร์ทเนอร์
5. **brand.html** — **หน้านำเสนอ CI + design system** (ลูกค้าขอเพิ่มเมนูนี้เพื่อการนำเสนอ)

### Out of scope (ระบุชัดกัน scope creep)
- ❌ ระบบชำระเงินบนเว็บ — **ลูกค้าไม่ต้องการ** (จบที่แชท, KBank gen payment link แยก)
- ❌ ระบบจอง/ปฏิทิน stock / user account / CMS
- ❌ Backend, ฐานข้อมูล, ระบบหลังบ้าน
- ❌ เนื้อหาจริงครบทุกแพ็กเกจ (demo ใช้ราคาจริงจาก price doc + ภาพถ่ายจาก brand book + artwork ที่เราทำเองสำหรับหมวดที่ยังไม่มีภาพ)
- ❌ SEO เต็มรูปแบบ / หลายภาษาสมบูรณ์ (demo ทำไทยเป็นหลัก)

---

## 4. Conversion model (สำคัญ — ต่างจากเว็บทัวร์ทั่วไป)

```
เห็นแพ็กเกจ → กด "สอบถาม/จอง" → LINE หรือ WhatsApp → คุยกับทีม → รับ KBank payment link
```

**ห้ามมีปุ่ม "ชำระเงิน" บนเว็บ** ทุก CTA ต้องนำไปสู่แชท

### Anti-scam requirement (client ขอเอง)
ลูกค้าเจอปัญหามิจฉาชีพ → เว็บต้องมี **โซนแจ้งบัญชีธนาคารอย่างเป็นทางการ** ประกาศชัดว่าโอนเข้าชื่อบัญชีนิติบุคคลนี้เท่านั้น + เตือนว่าไม่มีการโอนเข้าบัญชีบุคคลธรรมดา → นี่คือ trust feature ไม่ใช่ legal boilerplate ต้องออกแบบให้เด่น

---

## 5. Brand & CI

**คอนเซปต์:** Explore Phuket, Beyond the Shore — เที่ยวภูเก็ตมากกว่าที่คุณเคยเห็น
**บุคลิก:** Local · Friendly · Reliable · Adventurous

> **แก้ไข 2026-08-04 — CI เปลี่ยนหลัง Stage 3**
> Brief แรกให้ palette เขียว-ส้ม (Andaman Teal `#087F83` / Phuket Coral `#F47A5B` / Tropical Mango `#F5BE4F` / Sandy Cream `#FFF8EC` / Sea Mist `#E5F5F3` / Deep Ocean `#123B4A` / Charcoal Navy `#192E38`) และฟอนต์หัวเรื่อง Mitr
> ต่อมาลูกค้าส่ง **brand book จริง** (`nessy_explores_brand_book_by_pomelli.pdf`) ที่มีโลโก้ + palette + ภาพถ่ายของแบรนด์เอง → **ยึด brand book เป็นของจริง palette เดิมยกเลิกทั้งชุด** ทั้งเว็บถูกเปลี่ยนสีใหม่หมดแล้ว
> ถ้าเจอ hex เดิมที่ไหนในโค้ด = ตกค้าง ให้แก้

### Palette จาก brand book (4 สีหลัก)

| Role | ชื่อ | Hex | ใช้กับ |
|---|---|---|---|
| Primary | Ocean Blue | `#1677B8` | ปุ่มหลัก ลิงก์ ไฮไลต์ |
| Primary Dark | Prussian Blue | `#123A5A` | Footer, ตัวอักษร, โซนความน่าเชื่อถือ, scrim บนภาพ |
| Secondary | Sky Blue | `#62B6E7` | ไฮไลต์บนพื้นเข้ม, รายละเอียดเล็ก ๆ |
| Background | Frost | `#EAF7FD` | พื้นหลัง section สลับกับขาว |

### เฉดที่คำนวณต่อ (ไม่ได้อยู่ใน brand book — เพิ่มเพราะ contrast บังคับ)

| Token | Hex | เหตุผล |
|---|---|---|
| `--blue-darker` | `#0E5080` | Ocean Blue บน Frost ได้ 4.40:1 ตก AA เฉียดฉิว ลิงก์บนพื้น Frost ต้องใช้เฉดนี้ |
| `--muted` | `#54748D` | ข้อความรองบนขาว 4.93:1 |
| `--sunset` | `#F5A055` | ดึงจากดวงอาทิตย์ในโลโก้ — ป้ายโปรโมชั่นเท่านั้น ~3% ของหน้า |
| `--warn` | `#A63D1E` | ข้อความเตือน/กันมิจฉาชีพ |

**สัดส่วน:** 62% White + Frost · 25% Ocean + Prussian · 10% Sky · 3% Sunset

**กฎบังคับ (คุมด้วย contrast ไม่ใช่รสนิยม)**
- ตัวอักษรขาวบน Sky Blue = 2.24:1 และบน Sunset = 2.09:1 → **ห้าม** ทั้งสองพื้นใช้ตัวอักษร Prussian Blue
- **Sunset ไม่ใช่สีปุ่ม** — ระบบมีปุ่มระดับเดียวคือ Ocean Blue ถ้ามีปุ่มสองสีแข่งกัน ผู้ใช้จะไม่รู้ว่าต้องกดอันไหน และเว็บจะอ่านเป็นเว็บลดราคา
- Sky Blue ไม่ใช้เป็นสีตัวอักษรบนขาวหรือ Frost

รายละเอียดครบ + ตาราง contrast 13 คู่ อยู่ที่ `brand.html`

---

## 6. Stack (locked at Stage 1)

**Static HTML + vanilla CSS + vanilla JS → Vercel**

เหตุผล: demo ต้อง deploy เร็ว ไม่มี build step, ลูกค้า/เอเจนซี่ต่อไปแก้เองได้, ตรงกับ pattern เดิมของ repo นี้ (index.html + vercel.json) — **ไม่ใช้ Sellsuki DS 1.0/2.0** ตาม project-track rule

- Fonts: **Noto Sans Thai ทั้งระบบ** ไล่ลำดับด้วยน้ำหนัก (700 หัวเรื่อง / 500 label / 400 เนื้อหา) — brand book ไม่ได้กำหนดฟอนต์ไทย จึงเลือกฟอนต์เดียวเพื่อไม่ให้ชนกับ wordmark ของโลโก้
- Icons: inline SVG (stroke 1.75) — ห้าม emoji
- ภาพ: **ภาพถ่ายจาก brand book 7 รูป** (WebP ใน `assets/img/`) วางที่ hero ทุกหน้า + section ใหญ่ · การ์ดแพ็กเกจ 20 ใบ + category tile 6 ใบ ยังเป็น SVG เพราะชุดภาพไม่ครอบคลุมหมวด adventure/show/transfer และการผสมภาพถ่ายกับภาพวาดใน grid เดียวดูไม่เป็นระบบ

---

## 7. Reference sites (จาก PM)

| ชื่อ | Link |
|---|---|
| ภูเก็ตทัวร์ฮอลิเดย์ | https://www.phukettourholiday.com/ |
| ภูเก็ตอินไซต์ทัวร์ | https://www.phuketinsidetour.com/ |
| ภูเก็ตชิลล์ | https://www.phuketchill.com/about-us/ |

---

## 8. Open questions → ถาม PM/ลูกค้า (non-blocking สำหรับ demo)

1. **เลขใบอนุญาตนำเที่ยว (TAT license)** — ต้องมีตามกฎหมายและเป็น trust signal ตัวหลัก demo ใส่ placeholder ไว้
2. **เลขบัญชีธนาคารนิติบุคคล** ที่จะประกาศบนเว็บ — demo ใส่ placeholder
3. LINE Official Account ID + เบอร์ WhatsApp จริง
4. ภาพถ่ายเพิ่มเติม — brand book ให้ 7 รูป (ทะเล/เมืองเก่า/พระใหญ่/เรือหางยาว) แต่ยังขาดหมวด **adventure (ATV, ซิปไลน์, ล่องแก่ง), โชว์, รถรับส่ง** และภาพทีมงาน/ออฟฟิศ
5. brand book หน้า 01 กับ 06 ยังเป็น template filler ของ Pomelli ที่พูดถึง "Pixel Agency" (เอเจนซี่ครีเอทีฟ) ไม่ใช่บริษัททัวร์ — ต้องการให้แก้ก่อนใช้เป็นเอกสารทางการไหม (เราใช้แค่ระบบภาพ: สี ฟอนต์ โลโก้ ภาพถ่าย)
6. ต้องการภาษาอังกฤษ/จีน/รัสเซีย ด้วยไหม (นักท่องเที่ยวภูเก็ต) — demo ทำไทยก่อน
7. เรทเอเจนซี่ — แสดงบนเว็บ หรือให้ติดต่อขอเท่านั้น
8. หลัง demo ผ่าน: ใครดูแลต่อ (ทีมลูกค้า / Sellsuki)

---

## 9. Milestone (compressed — due 2026-08-06)

| Stage | สถานะ |
|---|---|
| 0 — PM Card | ✅ |
| 1 — Research + lock stack | ✅ |
| 2 — Vibe Design (CI → design system) | ✅ |
| 3 — Vibe Code 5 หน้า | ▶ |
| 4 — Deploy preview | — |
| 5 — Self-QA + client UAT (1 รอบ) | — |
| 6 — Handoff | — |

🛑 **Client checkpoint:** หลัง Stage 4 (ลูกค้าดู demo) — UAT budget 1 รอบ
