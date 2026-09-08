# คู่มือระบบสำรองออฟไลน์ด้วย Docker (Offline Backup Deployment Guide)

ระบบนี้สร้างขึ้นตาม **เกณฑ์การแข่งขัน Data Analytics (เกณฑ์ 3.5.5)** สำหรับใช้เป็นระบบสำรองออฟไลน์ (Offline Backup) ที่สามารถรันบนคอมพิวเตอร์เครื่องใดก็ได้ผ่าน **Port 8080** โดยไม่จำเป็นต้องเชื่อมต่ออินเทอร์เน็ต

---

## 1. คำสั่งบิลด์และรันทดสอบระบบในเครื่อง (Build & Run Locally)

### วิธีที่ 1: ใช้คำสั่ง Terminal (docker-compose)
```bash
# 1. สั่งบิลด์อิมเมจ crash-dashboard:latest
docker compose build

# 2. สั่งรันคอนเทนเนอร์ในโหมด Background
docker compose up -d

# 3. ตรวจสอบสถานะการทำงาน
docker ps --filter "name=crash_dashboard_local"
```
เปิดเบราว์เซอร์เข้าใช้งานที่: **`http://localhost:8080`**

### วิธีที่ 2: ใช้คำสั่ง Docker CLI โดยตรง
```bash
# บิลด์อิมเมจ
docker build -t crash-dashboard:latest .

# รันคอนเทนเนอร์
docker run -d --name crash_dashboard_local -p 8080:80 --restart always crash-dashboard:latest
```

### วิธีที่ 3: ดับเบิลคลิกไฟล์ Batch (Windows 1-Click)
- ดับเบิลคลิก `start-offline.bat` เพื่อเปิดระบบทันที
- ดับเบิลคลิก `stop-offline.bat` เพื่อหยุดการทำงาน

---

## 2. คำสั่งบันทึกอิมเมจเป็นไฟล์ .tar เซฟใส่แฟลชไดรฟ์ (Save for Flash Drive)

หลังจากทำการบิลด์อิมเมจเรียบร้อยแล้ว ให้บันทึกอิมเมจออกมาเป็นไฟล์ `.tar` เพื่อคัดลอกใส่ Flash Drive ไปส่งคณะกรรมการ:

```bash
docker save -o crash-dashboard-offline.tar crash-dashboard:latest
```
*(หรือดับเบิลคลิกไฟล์ `export-offline.bat` ในโฟลเดอร์)*

**สิ่งที่ต้องคัดลอกลง Flash Drive ส่งกรรมการ:**
1. ไฟล์ `crash-dashboard-offline.tar` (ไฟล์ระบบอิมเมจคอมไพล์สำเร็จรูป)
2. ไฟล์ `start-offline.bat` (และ `docker-compose.yml`)

---

## 3. คำสั่งสำหรับกรรมการในการโหลดไฟล์ .tar และสั่งรัน (Judge Offline Startup)

เมื่อกรรมการนำ Flash Drive ไปเสียบที่เครื่องคอมพิวเตอร์ (ที่มี Docker ติดตั้งอยู่ ไม่ต้องมี Node.js และไม่ต้องต่อเน็ต):

### ขั้นตอนที่ 1: นำเข้า (Load) อิมเมจเข้าสู่ Docker
```bash
docker load -i crash-dashboard-offline.tar
```
*ระบบจะแจ้ง: `Loaded image: crash-dashboard:latest`*

### ขั้นตอนที่ 2: สั่งรันคอนเทนเนอร์ทันที
```bash
docker run -d --name crash_dashboard_local -p 8080:80 --restart always crash-dashboard:latest
```
*(หรือรันผ่าน docker-compose: `docker compose up -d`)*

### ขั้นตอนที่ 3: เปิดหน้าแดชบอร์ด
เปิดเบราว์เซอร์ Google Chrome / Edge / Firefox แล้วพิมพ์:
👉 **`http://localhost:8080`**

**ข้อมูลสำหรับเข้าสู่ระบบของกรรมการ (Judge Login Gate):**
- **Username**: `judge` (หรือ `admin`)
- **Password**: `judge2026` (หรือ `admin123`)

---

## 4. คำสั่งปิดและลบคอนเทนเนอร์เมื่อเสร็จสิ้นการตรวจ (Teardown)

```bash
# ปิดและลบคอนเทนเนอร์
docker stop crash_dashboard_local && docker rm crash_dashboard_local

# หรือใช้ docker-compose
docker compose down
```
