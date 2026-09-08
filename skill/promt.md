คุณคือ Senior Frontend Developer และ Data Visualization Specialist เชี่ยวชาญด้าน React, Tailwind CSS และระบบ Dashboard ระดับ Enterprise
เป้าหมาย: สร้างโปรเจกต์ Single-Page Application (SPA) ด้วย React (Vite) + Tailwind CSS + Lucide React + ApexCharts (react-apexcharts) สำหรับนำเสนอข้อมูลวิเคราะห์อุบัติเหตุจราจร (Crash Safety Intelligence) ส่งเข้าแข่งขัน Data Analytics ตามเกณฑ์คะแนนที่เข้มงวด 100 คะแนนเต็ม

[ข้อกำหนดทางสถาปัตยกรรม (Tech Stack & Architecture)]
1. Framework: React 18+ ร่วมกับ Vite
2. Styling: Tailwind CSS (Clean modern layout, Inter/Sarabun font, ขอบมน rounded-2xl, เส้นขอบบาง border-slate-200, เงาโปร่ง shadow-sm)
3. Icons: `lucide-react`
4. Charts: `react-apexcharts` & `apexcharts` (Area Chart, Horizontal Bar Charts, Column Chart)
5. Data Consumption: นำเข้าข้อมูลโดยตรงจาก `./data/dashboard_data.json` (และต้องมี Fallback Mock Data อยู่ในโค้ด ป้องกันเว็บพังกรณีหาไฟล์ไม่เจอ)

[องค์ประกอบ UI และฟังก์ชันที่ต้องมีให้ครบตามเกณฑ์การตัดสิน 100 คะแนน]

1. ระบบยืนยันตัวตนสำหรับกรรมการ (Judge Access Gate - เกณฑ์ 3.5.5)
   - หน้าต่าง Modal แบบ Glassmorphism ลอยอยู่กลางจอ บังคับล็อกอินก่อนเข้าสู่เนื้อหา
   - ข้อมูลเข้าสู่ระบบ: Username = "judge", Password = "judge2026"
   - มีข้อความเตือนสีแดงเมื่อกรอกผิด และปลดล็อกเข้าสู่หน้าแดชบอร์ดทันทีเมื่อกรอกถูกต้อง พร้อมปุ่ม Logout ที่มุมขวาบนของ Header

2. ส่วนหัวและแถบตรวจสอบย้อนกลับ (Header & Traceability Bar - เกณฑ์ 3.5.3.4)
   - โลโก้และชื่อระบบ: "แดชบอร์ดวิเคราะห์สถิติอุบัติเหตุจราจร (Montgomery County Crash Safety Intelligence 2015-2025)"
   - แถบกำกับความถูกต้องของข้อมูล (Audit Badge): 
     * จุดไฟสีเขียวกะพริบ (Pulse animation)
     * ข้อความ: "194,719 Records (109,684 Incidents) | Pipeline v1.0 Audited"
   - แถบสลับแท็บ (Tab Navigation):
     * แท็บ 1: "ภาพรวม & การวิเคราะห์เชิงลึก (Executive Overview)"
     * แท็บ 2: "ร่องรอยการตรวจสอบข้อมูล (Data Audit & Reconciliation)"

3. การ์ดสรุปตัวชี้วัดหลัก 4 ใบ (Overview KPI Cards - เกณฑ์ 3.5.3.3)
   - Card 1 (เหตุการณ์ทั้งหมด): 109,684 เคส (194,719 บุคคล) | ซับไตเติล: "คัดกรองพิกัดหลุดนอกรัฐ 7 แถว"
   - Card 2 (บาดเจ็บสาหัสและเสียชีวิต): 1,772 เคส (0.91% ของเคสทั้งหมด) | ซับไตเติล: "เสียชีวิต 177 | สาหัส 1,595 ราย"
   - Card 3 (สารมึนเมาในคนขับ): 13.42% (26,135 เคส) | ซับไตเติล: "อัตราความรุนแรงสูงขึ้น +50.6%"
   - Card 4 (ช่วงเวลาพีคสูงสุด): 17:00 น. (15,636 ครั้ง) | ซับไตเติล: "วันศุกร์หนาแน่นที่สุด (31,412 ครั้ง)"

4. ส่วนแสดงผลกราฟิกและกล่องสรุป 3 จังหวะ (Visualizations & Insights - เกณฑ์ 3.5.3.1, 3.5.3.2)
   สร้างกริดแสดง 4 กราฟ โดย **ใต้ทุกกราฟต้องมีกล่องข้อความสรุปแบบ What -> So What -> Now What ชัดเจน**:
   - Chart 1: Smooth Area Chart แสดงแนวโน้มอุบัติเหตุรายชั่วโมง (00:00 - 23:00) เน้นจุดพีค 15:00-17:00 น.
     * What: อุบัติเหตุสะสมหนาแน่นที่สุดช่วง 15:00-17:00 น. (17:00 น. สูงสุด 15,636 ครั้ง)
     * So What: ปริมาณรถหนาแน่นช่วงโรงเรียนและเลิกงาน ส่งผลให้เกิดการชนท้ายชะลอตัว
     * Now What: ปรับสัญญาณไฟจราจรเป็นแบบ Dynamic Flow และจัดกำลังตำรวจคุมแยกหลัก
   - Chart 2: Horizontal Bar Chart แสดงรูปแบบการชน 5 อันดับแรก (Same Dir Rear End ชนท้ายอันดับ 1 ที่ 55,758 ครั้ง หรือ 28.6%)
     * What: ชนท้ายทิศทางเดียวกันสูงถึง 28.6%
     * So What: ผู้ขับขี่ขับชิดคันหน้าเกินไปและเสียสมาธิ (Distracted) จากสมาร์ตโฟน
     * Now What: ตีเส้นสีเตือนระยะปลอดภัย (Keep Distance) บริเวณก่อนถึงทางร่วมทางแยก
   - Chart 3: Column Chart แสดงอัตราเคสสาหัส/เสียชีวิตตามช่วงความเร็ว (<=25, 26-35, 36-45, >45 mph)
     * What: ถนนจำกัดความเร็วเกิน 45 mph มีอัตราเคสสาหัส 1.77% (สูงกว่าเขตชุมชน 4 เท่า)
     * So What: แรงปะทะจากความเร็วสูงส่งผลให้โครงสร้างนิรภัยไม่สามารถปกป้องผู้โดยสารได้
     * Now What: ติดตั้งกล้องตรวจจับความเร็วอัตโนมัติบนสายทางหลวงเชื่อมระหว่างเมือง
   - Chart 4: Horizontal Bar Chart แสดง 5 ถนนเกิดเหตุสะสมสูงสุด (Georgia Ave ครองแชมป์ 11,384 ครั้ง)
     * What: Georgia Ave เกิดเหตุสะสมสูงสุด 11,384 ครั้ง
     * So What: เป็นถนน 6 เลนที่มีทางแยกตัดและทางเลี้ยวเข้าสถานประกอบการหนาแน่น
     * Now What: ปรับปรุงเกาะกลาง ปิดจุดกลับรถเสี่ยง และตั้งด่านตรวจวัดแอลกอฮอล์

5. ตัวกรองและการเจาะลึกข้อมูลรายคดี (Interactive Explorer & Filters - เกณฑ์ 3.5.3.3, 3.5.4)
   - แถบตัวกรองประกอบด้วย:
     * Dropdown เลือกระดับความรุนแรง (Injury Severity)
     * ช่อง Input พิมพ์ค้นหาชื่อถนน (ค้นหาแบบ Real-time)
     * Dropdown เลือกฝ่ายที่กระทำผิด (Driver At Fault: All, Yes, No)
     * **ปุ่ม "รีเซ็ตตัวกรอง (Reset Filters)"** (ข้อบังคับ UX/UI)
   - ปุ่ม "ส่งออก CSV (Export Data)": กดแล้วแปลงข้อมูลที่กำลังแสดงในตารางดาวน์โหลดเป็นไฟล์ `filtered_crash_records.csv`
   - ตารางแสดงผล: Report Number, วันเวลาเกิดเหตุ, ถนน, รูปแบบการชน, ระดับความรุนแรง (มี Badge สีแดงเตือนเคสสาหัส), ความเร็ว, ฝ่ายผิด
   - สถานะข้อมูลไม่พบ (Empty State): เมื่อกรองแล้วไม่พบข้อมูล ให้แสดงไอคอนและข้อความแจ้งเตือนชัดเจน

6. แท็บร่องรอยการตรวจสอบ (Data Audit & Reconciliation Tab - เกณฑ์ 3.5.1)
   - ตารางที่ 1: Audit Trail Log แสดงขั้นตอน 1. Ingestion -> 2. Deduplication -> 3. Normalization -> 4. Outlier Handling -> 5. Geo Boundary Filter พร้อมตัวเลขแถวคงเหลือและจุดที่แก้ไข
   - ตารางที่ 2: Reconciliation Table เปรียบเทียบสถิติปีรถ (Vehicle Year) ก่อน vs หลัง คลีน (Count, Min, Median, Mean, Max) แสดงผลการทำ Median Imputation (แทนที่ปี 0 และ 9999 ด้วยปี 2012) อย่างโปร่งใส

[ข้อกำหนดไฟล์ผลลัพธ์]
- เขียนโค้ดหลักทั้งหมดให้อยู่ในไฟล์ `src/App.jsx` ที่สะอาด เป็นระเบียบ มีการแบ่ง Component ย่อยอย่างเหมาะสม
- โค้ดต้อง Import ไฟล์ `./data/dashboard_data.json` มาใช้งานได้ทันที และ Build ผ่าน Vite โดยไม่มีข้อผิดพลาด