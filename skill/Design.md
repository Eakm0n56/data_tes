# Design System — Crash Safety Intelligence Dashboard

อ้างอิงจาก Moodboard "Dashboard / Finance Management" — พาเลตสีและ typography ถูกแกะค่าจริงจากภาพต้นแบบ (pixel-sampled) แล้วนำมาประยุกต์ใช้กับ Montgomery County Crash Safety Intelligence Dashboard

---

## 1. Color Palette

### Primary Color

| Swatch | Hex | Role |
|---|---|---|
| ⬜ | `#FFFFFF` | Light Theme — พื้นหลังการ์ด/พาเนล (Card / Panel background) |
| ⬜ | `#F3F3F3` | Light Theme — พื้นหลังหลักของหน้า (Page background) |
| ⬛ | `#11121E` | Dark Theme — พื้นหลัง Sidebar / Judge Gate |
| ⬛ | `#1D1D29` | Dark Theme — พื้นหลังรอง (gradient / hover state บน Sidebar) |

### Secondary Color (Accent / Data Visualization)

| Swatch | Hex | ชื่อ | ใช้กับ |
|---|---|---|---|
| 🟧 | `#FFBC11` | Amber | KPI Card "สารมึนเมาในคนขับ", กราฟ, So What insight |
| 🟦 | `#4578F9` | Blue | KPI Card "เหตุการณ์ทั้งหมด", ปุ่มหลัก (Primary Action), Sidebar active state, Now What insight |
| 🟩 | `#43B430` | Green | KPI Card "ช่วงเวลาพีคสูงสุด", กราฟ Speed Severity |
| 🟪 | `#CB3EFF` | Purple | KPI Card "บาดเจ็บสาหัส/เสียชีวิต", จุดเน้นกราฟ Peak Hour |

### Typography Color

| Swatch | Hex | ใช้กับ |
|---|---|---|
| ⬜ | `#FFFFFF` | ตัวอักษรบนพื้นหลังมืด (Sidebar, Judge Gate) |
| ◻️ | `#7B7B7B` | ตัวอักษรรอง / คำอธิบาย (subtitle, caption) — mapped เป็น `text-ink-gray` |
| ⬛ | `#000000` | ตัวอักษรหลักบนพื้นหลังสว่าง (heading, ตัวเลข KPI) — mapped เป็น `text-ink-black` |

> **หมายเหตุ**: สี Badge ระดับความรุนแรง (แดง = เสียชีวิต, ส้ม = สาหัส) **จงใจไม่ใช้พาเลตนี้** เพราะเป็นสีเชิงความหมายด้านความปลอดภัย (semantic safety color) ที่ต้องคงไว้แม้เปลี่ยน branding เพื่อไม่ให้ตีความความรุนแรงผิดพลาด

### Tailwind Token Mapping (`tailwind.config.js`)

```js
colors: {
  primary: {
    light1: "#FFFFFF",
    light2: "#F3F3F3",
    dark1:  "#11121E",
    dark2:  "#1D1D29",
  },
  secondary: {
    amber:  "#FFBC11",
    blue:   "#4578F9",
    green:  "#43B430",
    purple: "#CB3EFF",
  },
  ink: {
    white: "#FFFFFF",
    gray:  "#7B7B7B",
    black: "#000000",
  },
}
```

---

## 2. Typography

**Font Family:** Inter (fallback: Sarabun สำหรับข้อความภาษาไทย)

| Size | Weight | ใช้กับ |
|---|---|---|
| 48px | Semi Bold | Hero Headline (ไม่ได้ใช้ในแดชบอร์ด — สงวนไว้สำหรับหน้า Landing/Cover) |
| 36px | Semi Bold | Section Title ขนาดใหญ่ |
| 24–30px (`text-2xl` / `text-3xl`) | Extra Bold | หัวข้อหลักของ Header (`แดชบอร์ดวิเคราะห์สถิติอุบัติเหตุจราจร`) |
| 20px | Semi Bold | หัวข้อการ์ด / กราฟ (Card & Chart title) |
| 16px | Medium | ตัวเลข KPI, ปุ่ม (Button label) |
| 14px | Regular | เนื้อหาตาราง, Insight box, Subtitle |
| 10–12px | Regular | Label ย่อย, ตัว tooltip ในกราฟ |

**Weight scale ที่ใช้จริงในโค้ด:** `font-normal` (Regular) / `font-medium` (Medium) / `font-semibold` (Semi Bold) / `font-extrabold` (สำหรับ Header headline เท่านั้น)

---

## 3. Layout Concept

```
┌────┬──────────────────────────────────────────────┐
│    │  Header (bg #FFFFFF)                          │
│ S  │  ┌ Title (Extra Bold, ink-black)               │
│ i  │  ┌ Audit Badge (pulse dot เขียว)                │
│ d  │  └ Tab Navigation (active = secondary-blue)    │
│ e  ├──────────────────────────────────────────────┤
│ b  │  Main content (bg #F3F3F3)                    │
│ a  │  ┌ KPI Cards (4 ใบ, การ์ดขาว, ไอคอนสี secondary) │
│ r  │  ┌ Chart Grid 2x2 (การ์ดขาว + Insight box)      │
│    │  └ Interactive Explorer (ตัวกรอง + ตาราง)       │
│ 🔵 │                                                │
│ 🔲 │                                                │
└────┴──────────────────────────────────────────────┘
```

- **Sidebar**: มืด (`#11121E`), กว้าง 80px (`w-20`), แสดงเฉพาะจอ ≥ `sm` breakpoint, ไอคอนเรลแนวตั้ง จัดกึ่งกลาง (center-aligned)
- **Main content**: ชิดซ้าย-ขวาเต็มพื้นที่ที่เหลือ, จัดกลางด้วย `max-w-7xl`, การ์ดทั้งหมดใช้ `rounded-2xl border border-slate-200 shadow-sm`
- **Alignment**: เนื้อหาในการ์ด left-aligned ทั้งหมด (ไม่ center) เพื่อให้อ่านข้อมูลเชิงวิเคราะห์ได้ง่ายและสแกนสายตาเป็นแนวตั้งได้เร็ว

---

## 4. Component Styling Guide

| Component | Style |
|---|---|
| Card / Panel | `bg-primary-light1 rounded-2xl border border-slate-200 shadow-sm p-5` |
| Primary Button (Export CSV, Login) | `bg-secondary-blue text-white rounded-xl hover:brightness-110` |
| Secondary Button (Reset Filters, Logout) | `bg-white border border-slate-200 text-slate-600 rounded-xl` |
| Sidebar nav item (active) | `bg-secondary-blue text-white rounded-xl` |
| Sidebar nav item (inactive) | `text-ink-gray hover:bg-primary-dark2 hover:text-white` |
| Tab (active) | `border-b-2 border-secondary-blue text-secondary-blue` |
| KPI icon chip | `bg-{accent}/10 text-{accent} rounded-xl` (accent = amber/blue/green/purple ตาม card) |
| Insight box — What | `bg-slate-100 text-slate-600` |
| Insight box — So What | `bg-secondary-amber/15 text-secondary-amber` |
| Insight box — Now What | `bg-secondary-blue/10 text-secondary-blue` |
| Severity badge (semantic, ไม่ใช้พาเลตหลัก) | แดง = Fatal, ส้ม = Serious, อำพัน = Minor, เทา = Property Damage |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-secondary-blue` |

---

## 5. Design Principles

1. **Semantic color ต้องมาก่อน Branding** — สีที่สื่อความหมายด้านความปลอดภัย (severity badge) ไม่ถูกแทนที่ด้วยพาเลตแบรนด์ แม้ว่าพาเลตแบรนด์จะมีสีแดง/ส้มอยู่แล้วก็ตาม เพื่อป้องกันความสับสนระหว่าง "สีแบรนด์" กับ "สีเตือนภัย"
2. **Dark rail, light canvas** — ใช้ Sidebar มืดเป็นจุดขมวด (anchor) ของ identity เพียงจุดเดียว ส่วนพื้นที่ทำงานหลักสว่างเพื่อให้อ่านข้อมูล/กราฟจำนวนมากได้สบายตาต่อเนื่องนาน
3. **สีสัน 4 accent สื่อสาร ไม่ใช่ตกแต่ง** — แต่ละ KPI card และกราฟที่เกี่ยวข้องใช้สี accent เดียวกันตลอด narrative (เช่น สีน้ำเงินของ Card 1 = สีเส้นกราฟ Hourly Trend) เพื่อให้กรรมการไล่เชื่อมเรื่องได้โดยไม่ต้องอ่านคำอธิบาย
4. **ตัวเลขคือ hero** — ตัวเลข KPI ใช้น้ำหนักตัวหนาและขนาดใหญ่กว่าองค์ประกอบอื่นในการ์ดเสมอ ตามคาแรกเตอร์ dashboard การเงิน/วิเคราะห์ที่ตัวเลขต้องโดดเด่นที่สุดบนหน้าจอ