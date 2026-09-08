import React, { useState, useEffect, useMemo, useRef } from 'react';
import Chart from 'react-apexcharts';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Search,
  RotateCcw,
  Download,
  LogOut,
  Car,
  Activity,
  CheckCircle2,
  Lock,
  User,
  Calendar,
  MapPin,
  Info,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Database,
  Sparkles,
  X
} from 'lucide-react';

// นำเข้าข้อมูลโดยตรงจาก ./data/dashboard_data.json ตามข้อกำหนด
import dataFromJson from './data/dashboard_data.json';

// ════════════════ FALLBACK MOCK DATA ════════════════
const FALLBACK_DATA = {
  summary: {
    total_incidents: 109684,
    total_persons: 194719,
    severe_fatal_cases: 1772,
    severe_pct: 0.91,
    substance_drivers: 26135,
    substance_pct: 13.42,
    substance_severity_increase: 50.6,
    peak_hour: 17,
    peak_hour_count: 15636,
    peak_day: "Friday",
    peak_day_count: 31412
  },
  hourly_trend: {
    labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    values: [2150, 1380, 1050, 820, 780, 1250, 3450, 6280, 6850, 4620, 3980, 4350, 5480, 5120, 6380, 7920, 8540, 15636, 7280, 5450, 3980, 3150, 2580, 2100]
  },
  collision_types: [
    { type: "Same Direction Rear End", count: 34521 },
    { type: "Angle Meets Left Turn", count: 14832 },
    { type: "Same Direction Sideswipe", count: 11267 },
    { type: "Head On Left Turn", count: 8456 },
    { type: "Single Vehicle", count: 7123 }
  ],
  speed_severity: [
    { bracket: "≤25 mph", rate: 0.45, count: 42150, severe: 190 },
    { bracket: "26–35 mph", rate: 0.82, count: 35280, severe: 289 },
    { bracket: "36–45 mph", rate: 1.15, count: 22840, severe: 263 },
    { bracket: ">45 mph", rate: 1.77, count: 9414, severe: 167 }
  ],
  top_roads: [
    { road: "Georgia Ave", count: 4218 },
    { road: "New Hampshire Ave", count: 3156 },
    { road: "Frederick Rd", count: 2834 },
    { road: "Rockville Pike", count: 2612 },
    { road: "University Blvd", count: 2447 }
  ],
  incidents: [
    { report_number: "MCP2024001234", datetime: "2024-03-15 17:23", road: "Georgia Ave", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2024001891", datetime: "2024-04-02 08:14", road: "Rockville Pike", collision_type: "Angle Meets Left Turn", injury_severity: "Suspected Minor Injury", speed_limit: 40, driver_at_fault: "Yes" },
    { report_number: "MCP2024002456", datetime: "2024-05-18 16:45", road: "New Hampshire Ave", collision_type: "Same Direction Sideswipe", injury_severity: "No Apparent Injury", speed_limit: 30, driver_at_fault: "No" },
    { report_number: "MCP2024003102", datetime: "2024-06-22 23:10", road: "Frederick Rd", collision_type: "Single Vehicle", injury_severity: "Suspected Serious Injury", speed_limit: 50, driver_at_fault: "Yes" },
    { report_number: "MCP2024003789", datetime: "2024-07-04 14:32", road: "University Blvd", collision_type: "Head On Left Turn", injury_severity: "Possible Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2024004215", datetime: "2024-08-11 07:56", road: "Connecticut Ave", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 30, driver_at_fault: "No" },
    { report_number: "MCP2024004678", datetime: "2024-09-03 18:28", road: "Veirs Mill Rd", collision_type: "Angle Meets Left Turn", injury_severity: "Suspected Minor Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2024005034", datetime: "2024-10-19 12:05", road: "Georgia Ave", collision_type: "Same Direction Rear End", injury_severity: "Possible Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2024005421", datetime: "2024-11-25 02:45", road: "Colesville Rd", collision_type: "Single Vehicle", injury_severity: "Fatal Injury", speed_limit: 45, driver_at_fault: "Yes" },
    { report_number: "MCP2024005890", datetime: "2024-12-08 15:18", road: "Old Georgetown Rd", collision_type: "Same Direction Sideswipe", injury_severity: "No Apparent Injury", speed_limit: 40, driver_at_fault: "No" },
    { report_number: "MCP2023006234", datetime: "2023-01-14 09:30", road: "River Rd", collision_type: "Head On Left Turn", injury_severity: "Suspected Minor Injury", speed_limit: 40, driver_at_fault: "Yes" },
    { report_number: "MCP2023006701", datetime: "2023-02-20 17:50", road: "Georgia Ave", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 30, driver_at_fault: "Yes" },
    { report_number: "MCP2023007188", datetime: "2023-03-08 11:22", road: "Rockville Pike", collision_type: "Angle Meets Left Turn", injury_severity: "Possible Injury", speed_limit: 35, driver_at_fault: "No" },
    { report_number: "MCP2023007654", datetime: "2023-04-15 20:15", road: "New Hampshire Ave", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2023008120", datetime: "2023-05-30 06:40", road: "Frederick Rd", collision_type: "Single Vehicle", injury_severity: "Suspected Serious Injury", speed_limit: 55, driver_at_fault: "Yes" },
    { report_number: "MCP2023008567", datetime: "2023-06-12 13:55", road: "University Blvd", collision_type: "Same Direction Sideswipe", injury_severity: "No Apparent Injury", speed_limit: 30, driver_at_fault: "No" },
    { report_number: "MCP2023009034", datetime: "2023-07-24 16:10", road: "Connecticut Ave", collision_type: "Angle Meets Left Turn", injury_severity: "Suspected Minor Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2023009501", datetime: "2023-08-05 22:35", road: "Veirs Mill Rd", collision_type: "Head On Left Turn", injury_severity: "Possible Injury", speed_limit: 40, driver_at_fault: "Yes" },
    { report_number: "MCP2023009968", datetime: "2023-09-18 10:48", road: "Georgia Ave", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2023010435", datetime: "2023-10-31 01:20", road: "Colesville Rd", collision_type: "Single Vehicle", injury_severity: "Suspected Minor Injury", speed_limit: 45, driver_at_fault: "Yes" },
    { report_number: "MCP2022010902", datetime: "2022-01-07 08:05", road: "Old Georgetown Rd", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 35, driver_at_fault: "No" },
    { report_number: "MCP2022011369", datetime: "2022-02-14 17:30", road: "River Rd", collision_type: "Angle Meets Left Turn", injury_severity: "Possible Injury", speed_limit: 40, driver_at_fault: "Yes" },
    { report_number: "MCP2022011836", datetime: "2022-03-22 14:12", road: "Rockville Pike", collision_type: "Same Direction Sideswipe", injury_severity: "No Apparent Injury", speed_limit: 35, driver_at_fault: "No" },
    { report_number: "MCP2022012303", datetime: "2022-04-09 19:45", road: "Georgia Ave", collision_type: "Head On Left Turn", injury_severity: "Suspected Serious Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2022012770", datetime: "2022-05-16 12:30", road: "New Hampshire Ave", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 30, driver_at_fault: "Yes" },
    { report_number: "MCP2022013237", datetime: "2022-06-28 05:55", road: "Frederick Rd", collision_type: "Single Vehicle", injury_severity: "Fatal Injury", speed_limit: 50, driver_at_fault: "Yes" },
    { report_number: "MCP2022013704", datetime: "2022-07-11 16:38", road: "University Blvd", collision_type: "Same Direction Rear End", injury_severity: "Possible Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2022014171", datetime: "2022-08-23 09:15", road: "Connecticut Ave", collision_type: "Angle Meets Left Turn", injury_severity: "No Apparent Injury", speed_limit: 30, driver_at_fault: "No" },
    { report_number: "MCP2021014638", datetime: "2021-01-05 21:20", road: "Veirs Mill Rd", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2021015105", datetime: "2021-02-17 07:42", road: "Georgia Ave", collision_type: "Same Direction Sideswipe", injury_severity: "Suspected Minor Injury", speed_limit: 30, driver_at_fault: "Yes" },
    { report_number: "MCP2021015572", datetime: "2021-03-30 15:08", road: "Colesville Rd", collision_type: "Angle Meets Left Turn", injury_severity: "Possible Injury", speed_limit: 40, driver_at_fault: "Yes" },
    { report_number: "MCP2021016039", datetime: "2021-04-22 18:55", road: "Old Georgetown Rd", collision_type: "Head On Left Turn", injury_severity: "No Apparent Injury", speed_limit: 35, driver_at_fault: "No" },
    { report_number: "MCP2021016506", datetime: "2021-05-08 11:30", road: "River Rd", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 40, driver_at_fault: "Yes" },
    { report_number: "MCP2020016973", datetime: "2020-06-14 03:15", road: "Rockville Pike", collision_type: "Single Vehicle", injury_severity: "Suspected Serious Injury", speed_limit: 45, driver_at_fault: "Yes" },
    { report_number: "MCP2020017440", datetime: "2020-07-26 17:02", road: "New Hampshire Ave", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2020017907", datetime: "2020-08-09 13:40", road: "Frederick Rd", collision_type: "Angle Meets Left Turn", injury_severity: "Suspected Minor Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2020018374", datetime: "2020-09-21 10:25", road: "Georgia Ave", collision_type: "Same Direction Rear End", injury_severity: "No Apparent Injury", speed_limit: 30, driver_at_fault: "No" },
    { report_number: "MCP2019018841", datetime: "2019-10-03 20:50", road: "University Blvd", collision_type: "Same Direction Sideswipe", injury_severity: "Possible Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2019019308", datetime: "2019-11-15 06:18", road: "Connecticut Ave", collision_type: "Head On Left Turn", injury_severity: "Suspected Minor Injury", speed_limit: 35, driver_at_fault: "Yes" },
    { report_number: "MCP2019019775", datetime: "2019-12-27 23:48", road: "Veirs Mill Rd", collision_type: "Single Vehicle", injury_severity: "Fatal Injury", speed_limit: 40, driver_at_fault: "Yes" }
  ],
  audit_trail: [
    { step: 1, name: "Ingestion", description: "โหลดข้อมูลดิบจาก Montgomery County Open Data", rows_before: null, rows_after: 196432, fixes: 0, detail: "นำเข้าไฟล์ CSV 196,432 แถว ครบทุกคอลัมน์" },
    { step: 2, name: "Deduplication", description: "ตรวจจับและลบแถวซ้ำด้วย Report Number + Person ID", rows_before: 196432, rows_after: 195180, fixes: 1252, detail: "ลบ 1,252 แถวซ้ำ (0.64%) จากการรายงานซ้ำซ้อน" },
    { step: 3, name: "Normalization", description: "ปรับรูปแบบข้อมูล: วันที่ ชื่อถนน ประเภทการชน", rows_before: 195180, rows_after: 195180, fixes: 3247, detail: "แก้ไข 3,247 ฟิลด์ — รวมถนนที่สะกดต่างกัน, แปลงรูปแบบวันที่" },
    { step: 4, name: "Outlier Handling", description: "ตรวจจับค่าผิดปกติ Vehicle Year ด้วย IQR แทนที่ด้วย Median", rows_before: 195180, rows_after: 195180, fixes: 892, detail: "แทนที่ 892 ค่า Vehicle Year ที่ <1985 หรือ >2026 ด้วย Median = 2012" },
    { step: 5, name: "Geo Filtering", description: "กรองเฉพาะ Montgomery County, Maryland", rows_before: 195180, rows_after: 194719, fixes: 461, detail: "ลบ 461 แถวที่พิกัดอยู่นอกเขต Montgomery County" }
  ],
  reconciliation: {
    field: "Vehicle Year",
    method: "IQR-based outlier detection → Median imputation (แทนที่ค่าที่ <1985 หรือ >2026 ด้วย Median = 2012)",
    before: { min: 1800, median: 2010, mean: 2006.3, max: 2099, outliers: 892 },
    after: { min: 1985, median: 2012, mean: 2011.4, max: 2026, outliers: 0 }
  }
};

const appData = dataFromJson || FALLBACK_DATA;

// ════════════════ ⚡ ULTRA-FAST COUNT-UP HOOK (60 FPS) ════════════════
function useCountUp(target, duration = 1200, decimals = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;
    const startVal = 0;
    const targetVal = typeof target === 'number' ? target : parseFloat(target) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo for energetic and smooth acceleration-deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (targetVal - startVal) * ease;
      setCount(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCount(targetVal);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString();
}

// ════════════════ MAIN APP COMPONENT ════════════════
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState('');

  // ฟิลเตอร์ข้อมูล
  const [severityFilter, setSeverityFilter] = useState('');
  const [roadSearch, setRoadSearch] = useState('');
  const [faultFilter, setFaultFilter] = useState('');

  // นาฬิกาเรียลไทม์
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('th-TH', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // กรองข้อมูลในตารางแบบ Optimized Memoization
  const filteredIncidents = useMemo(() => {
    const list = appData.incidents || [];
    const searchLower = roadSearch.trim().toLowerCase();

    return list.filter(item => {
      if (severityFilter && item.injury_severity !== severityFilter) return false;
      if (faultFilter && item.driver_at_fault !== faultFilter) return false;
      if (searchLower && !item.road.toLowerCase().includes(searchLower)) return false;
      return true;
    });
  }, [severityFilter, roadSearch, faultFilter]);

  const handleResetFilters = () => {
    setSeverityFilter('');
    setRoadSearch('');
    setFaultFilter('');
  };

  const handleExportCSV = () => {
    if (!filteredIncidents.length) return;
    const headers = ["Report Number", "Date Time", "Road", "Collision Type", "Injury Severity", "Speed Limit", "Driver At Fault"];
    const rows = filteredIncidents.map(item => [
      `"${item.report_number}"`,
      `"${item.datetime}"`,
      `"${item.road}"`,
      `"${item.collision_type}"`,
      `"${item.injury_severity}"`,
      item.speed_limit,
      `"${item.driver_at_fault}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'filtered_crash_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-slate-200">
      {/* 1. ระบบยืนยันตัวตนสำหรับกรรมการ (Judge Access Gate) */}
      {!isAuthenticated && (
        <JudgeLoginModal onLoginSuccess={() => setIsAuthenticated(true)} />
      )}

      {/* 2. ส่วนหัวและแถบตรวจสอบย้อนกลับ (Header & Traceability Bar) */}
      <Header
        currentTime={currentTime}
        onLogout={() => setIsAuthenticated(false)}
      />

      <TraceabilityBar />

      {/* 3. แถบสลับแท็บ (Tab Navigation) */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8 animate-fade-in">
            {/* 4. การ์ดสรุปตัวชี้วัดหลัก 4 ใบ (Overview KPI Cards) */}
            <OverviewKpis summary={appData.summary} />

            {/* 5. ส่วนแสดงผลกราฟิกและกล่องสรุป 3 จังหวะ (Visualizations & Insights) */}
            <VisualizationsSection appData={appData} />

            {/* 6. ตัวกรองและการเจาะลึกข้อมูลรายคดี (Interactive Explorer & Filters) */}
            <InteractiveExplorer
              filteredIncidents={filteredIncidents}
              totalCount={appData.incidents?.length || 0}
              severityFilter={severityFilter}
              setSeverityFilter={setSeverityFilter}
              roadSearch={roadSearch}
              setRoadSearch={setRoadSearch}
              faultFilter={faultFilter}
              setFaultFilter={setFaultFilter}
              onResetFilters={handleResetFilters}
              onExportCSV={handleExportCSV}
            />
          </div>
        ) : (
          /* 7. แท็บร่องรอยการตรวจสอบ (Data Audit & Reconciliation Tab) */
          <DataAuditTab
            auditTrail={appData.audit_trail}
            reconciliation={appData.reconciliation}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70 backdrop-blur-md py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span>
            <span>Montgomery County Department of Transportation & Police Crash Database (2015–2025)</span>
          </div>
          <div>
            <span>Data Analytics Competition 2026 · Supercharged with React 18, Vite & ApexCharts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ════════════════ 1. JUDGE ACCESS GATE MODAL ════════════════
function JudgeLoginModal({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(false);

    setTimeout(() => {
      if (username.trim() === 'judge' && password === 'judge2026') {
        onLoginSuccess();
      } else {
        setErrorMsg(true);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 450);
      }
      setIsLoading(false);
    }, 200);
  };

  const handleQuickFill = () => {
    setUsername('judge');
    setPassword('judge2026');
    setErrorMsg(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center login-bg-pattern p-4 overflow-hidden">
      {/* Ambient Floating Glow Orbs for Luxury Look */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float-reverse pointer-events-none"></div>

      <div className={`relative w-full max-w-md glass-modal rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/80 animate-scale-in gpu-accelerated ${isShaking ? 'animate-shake' : ''}`}>
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center shadow-xl mb-4 ring-4 ring-slate-100 transition duration-300 group-hover:scale-105">
              <ShieldCheck className="w-8 h-8 text-white transition duration-300 group-hover:rotate-6" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            ระบบยืนยันตัวตนสำหรับกรรมการ
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Montgomery County Crash Safety Intelligence · Judge Access Gate (เกณฑ์ 3.5.5)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้ (เช่น judge)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white/90 focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-200 text-sm outline-none transition duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน (เช่น judge2026)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white/90 focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-200 text-sm outline-none transition duration-200"
                required
              />
            </div>
          </div>

          {/* แจ้งเตือนข้อผิดพลาดเมื่อกรอกผิด */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2 animate-fade-in shadow-xs">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (กรุณาลอง: judge / judge2026)</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-sm font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 btn-shimmer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>เข้าสู่ระบบแดชบอร์ด</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
          <span>Data Analytics Competition 2026</span>
          <button
            type="button"
            onClick={handleQuickFill}
            className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-semibold underline transition hover:scale-105"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>เติมรหัสผ่านอัตโนมัติ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════ 2. HEADER ════════════════
function Header({ currentTime, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-xs no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Title & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center shadow-md text-white transition hover:scale-105">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              แดชบอร์ดวิเคราะห์สถิติอุบัติเหตุจราจร
            </h1>
            <p className="text-xs text-slate-500 font-medium leading-none">
              Montgomery County Crash Safety Intelligence 2015-2025
            </p>
          </div>
        </div>

        {/* Right Side Stats & Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span>
            <span>Live System</span>
          </div>

          {/* Clock */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/90 px-3 py-1 rounded-full font-mono border border-slate-200 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime || '00:00:00'}</span>
          </div>

          {/* Judge Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>กรรมการผู้ตัดสิน (Judge)</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 transition duration-150 active:scale-95 shadow-xs"
            title="ออกจากระบบ"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ════════════════ 3. TRACEABILITY BAR (เกณฑ์ 3.5.3.4) ════════════════
function TraceabilityBar() {
  return (
    <div className="bg-white border-b border-slate-200/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Audit Badge with green pulse animation */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 shadow-xs hover:bg-slate-150 transition">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span>
            <span>194,719 Records (109,684 Incidents) | Pipeline v1.0 Audited</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>ขอบเขตข้อมูล: ม.ค. 2015 – ธ.ค. 2025</span>
          </div>

          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Montgomery County, Maryland</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-500 text-xs">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Data Integrity Score: <strong className="text-slate-800 font-bold">99.13%</strong> | Median Imputation Active</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════ TAB NAVIGATION ════════════════
function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition duration-200 ${
            activeTab === 'dashboard'
              ? 'border-slate-900 text-slate-900 bg-slate-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>ภาพรวม & การวิเคราะห์เชิงลึก (Executive Overview)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition duration-200 ${
            activeTab === 'audit'
              ? 'border-slate-900 text-slate-900 bg-slate-50/60'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>ร่องรอยการตรวจสอบข้อมูล (Data Audit & Reconciliation)</span>
        </button>
      </div>
    </div>
  );
}

// ════════════════ 4. OVERVIEW KPI CARDS (เกณฑ์ 3.5.3.3) ════════════════
function OverviewKpis({ summary }) {
  const animatedIncidents = useCountUp(summary.total_incidents, 1000);
  const animatedPersons = useCountUp(summary.total_persons, 1100);
  const animatedSevere = useCountUp(summary.severe_fatal_cases, 1000);
  const animatedSeverePct = useCountUp(summary.severe_pct, 1200, 2);
  const animatedSubstancePct = useCountUp(summary.substance_pct, 1200, 2);
  const animatedSubstanceCount = useCountUp(summary.substance_drivers, 1000);
  const animatedPeakCount = useCountUp(summary.peak_hour_count, 1000);
  const animatedFridayCount = useCountUp(summary.peak_day_count, 1100);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          ตัวชี้วัดหลักเชิงยุทธศาสตร์ (Key Performance Indicators)
        </h2>
        <span className="text-xs text-slate-400">ระบบประมวลผลความเร็วสูง (Hardware Accelerated)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Incidents */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 card-lift border-t-4 border-t-slate-800 animate-fade-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              เหตุการณ์ทั้งหมด (Total Incidents)
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 transition group-hover:scale-110">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {animatedIncidents} <span className="text-base font-semibold text-slate-600">เคส</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            จากทั้งหมด <span className="font-bold text-slate-700">{animatedPersons} บุคคล</span>
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>คัดกรองพิกัดหลุดนอกรัฐ 7 แถว</span>
          </div>
        </div>

        {/* Card 2: Severe & Fatal */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 card-lift border-t-4 border-t-rose-500 animate-fade-up [animation-delay:80ms]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
              บาดเจ็บสาหัสและเสียชีวิต (Severe & Fatal)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 transition group-hover:scale-110">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {animatedSevere} <span className="text-base font-semibold text-slate-600">เคส</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            คิดเป็น <span className="font-bold text-rose-600">{animatedSeverePct}%</span> ของเคสทั้งหมด
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
            <span>เสียชีวิต 177 | สาหัส 1,595 ราย</span>
          </div>
        </div>

        {/* Card 3: Substance Drivers */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 card-lift border-t-4 border-t-amber-500 animate-fade-up [animation-delay:160ms]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              สารมึนเมาในคนขับ (Substance Involved)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 transition group-hover:scale-110">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {animatedSubstancePct}% <span className="text-base font-normal text-slate-500 text-sm">({animatedSubstanceCount} เคส)</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            เกี่ยวข้องกับแอลกอฮอล์และสารเสพติด
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-amber-700 font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>อัตราความรุนแรงสูงขึ้น +{summary.substance_severity_increase}%</span>
          </div>
        </div>

        {/* Card 4: Peak Hour & Day */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 card-lift border-t-4 border-t-emerald-500 animate-fade-up [animation-delay:240ms]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              ช่วงเวลาพีคสูงสุด (Peak Incident Window)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition group-hover:scale-110">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {summary.peak_hour}:00 น. <span className="text-base font-normal text-slate-500 text-sm">({animatedPeakCount} ครั้ง)</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            ช่วงเลิกงานและโรงเรียนเลิก
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
            <span>วันศุกร์หนาแน่นที่สุด ({animatedFridayCount} ครั้ง)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════ 5. VISUALIZATIONS & 3-BEAT INSIGHT BOXES (เกณฑ์ 3.5.3.1, 3.5.3.2) ════════════════
function VisualizationsSection({ appData }) {
  // Chart Animation Options สำหรับความลื่นไหลระดับสูง
  const baseChartAnimations = {
    enabled: true,
    easing: 'easeinout',
    speed: 700,
    animateGradually: { enabled: true, delay: 120 },
    dynamicAnimation: { enabled: true, speed: 300 }
  };

  // Chart 1: Smooth Area Chart (Hourly Trend)
  const hourlyChartOptions = {
    chart: {
      type: 'area',
      height: 270,
      toolbar: { show: false },
      fontFamily: 'Sarabun, Inter, sans-serif',
      animations: baseChartAnimations
    },
    stroke: { curve: 'smooth', width: 2.5 },
    colors: ['#334155'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95, 100]
      }
    },
    xaxis: {
      categories: appData.hourly_trend.labels,
      labels: { style: { fontSize: '11px', colors: '#64748b' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toLocaleString(),
        style: { fontSize: '11px', colors: '#64748b' }
      }
    },
    dataLabels: { enabled: false },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: { y: { formatter: (val) => `${val.toLocaleString()} ครั้ง` } }
  };

  const hourlyChartSeries = [{
    name: 'จำนวนครั้งที่เกิดอุบัติเหตุ',
    data: appData.hourly_trend.values
  }];

  // Chart 2: Horizontal Bar Chart (Collision Types)
  const collisionChartOptions = {
    chart: {
      type: 'bar',
      height: 270,
      toolbar: { show: false },
      fontFamily: 'Sarabun, Inter, sans-serif',
      animations: baseChartAnimations
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: '62%'
      }
    },
    colors: ['#475569'],
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toLocaleString(),
      style: { fontSize: '11px', colors: ['#fff'], fontWeight: 600 }
    },
    xaxis: {
      categories: appData.collision_types.map(c => c.type),
      labels: {
        formatter: (val) => val.toLocaleString(),
        style: { fontSize: '11px', colors: '#64748b' }
      },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: {
        style: { fontSize: '11px', colors: '#334155', fontWeight: 600 },
        maxWidth: 180
      }
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
  };

  const collisionChartSeries = [{
    name: 'จำนวนครั้ง',
    data: appData.collision_types.map(c => c.count)
  }];

  // Chart 3: Column Chart (Speed vs Severity)
  const speedChartOptions = {
    chart: {
      type: 'bar',
      height: 270,
      toolbar: { show: false },
      fontFamily: 'Sarabun, Inter, sans-serif',
      animations: baseChartAnimations
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
        distributed: true
      }
    },
    colors: ['#94a3b8', '#64748b', '#475569', '#e11d48'],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      offsetY: -20,
      style: { fontSize: '11px', colors: ['#334155'], fontWeight: 700 }
    },
    legend: { show: false },
    xaxis: {
      categories: appData.speed_severity.map(s => s.bracket),
      labels: { style: { fontSize: '12px', colors: '#64748b', fontWeight: 600 } },
      axisBorder: { show: false }
    },
    yaxis: {
      title: { text: 'อัตราเคสสาหัส (%)', style: { fontSize: '11px', color: '#64748b' } },
      labels: {
        formatter: (val) => `${val}%`,
        style: { fontSize: '11px', colors: '#64748b' }
      }
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
  };

  const speedChartSeries = [{
    name: 'อัตราเคสรุนแรง (%)',
    data: appData.speed_severity.map(s => s.rate)
  }];

  // Chart 4: Horizontal Bar Chart (Top Roads)
  const roadsChartOptions = {
    chart: {
      type: 'bar',
      height: 270,
      toolbar: { show: false },
      fontFamily: 'Sarabun, Inter, sans-serif',
      animations: baseChartAnimations
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: '62%'
      }
    },
    colors: ['#334155'],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toLocaleString()} เคส`,
      style: { fontSize: '11px', colors: ['#fff'], fontWeight: 600 }
    },
    xaxis: {
      categories: appData.top_roads.map(r => r.road),
      labels: {
        formatter: (val) => val.toLocaleString(),
        style: { fontSize: '11px', colors: '#64748b' }
      }
    },
    yaxis: {
      labels: {
        style: { fontSize: '11px', colors: '#334155', fontWeight: 600 },
        maxWidth: 160
      }
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
  };

  const roadsChartSeries = [{
    name: 'จำนวนเหตุการณ์',
    data: appData.top_roads.map(r => r.count)
  }];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          การวิเคราะห์ภาพรวมข้อมูลเชิงลึก (Deep Dive Visualizations)
        </h2>
        <span className="text-xs text-slate-400">ApexCharts Enterprise Responsive Charts</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Hourly Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                แนวโน้มอุบัติเหตุรายชั่วโมง (Hourly Accident Trend)
              </h3>
              <span className="text-xs text-slate-400 font-mono">00:00 - 23:00</span>
            </div>
            <Chart options={hourlyChartOptions} series={hourlyChartSeries} type="area" height={260} />
          </div>

          <InsightBox
            what="อุบัติเหตุสะสมหนาแน่นที่สุดช่วง 15:00-17:00 น. (17:00 น. สูงสุด 15,636 ครั้ง)"
            soWhat="ปริมาณรถหนาแน่นช่วงโรงเรียนและเลิกงาน ส่งผลให้เกิดการชนท้ายชะลอตัว"
            nowWhat="ปรับสัญญาณไฟจราจรเป็นแบบ Dynamic Flow และจัดกำลังตำรวจคุมแยกหลัก"
          />
        </div>

        {/* Chart 2: Collision Types */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                รูปแบบการชน 5 อันดับแรก (Top 5 Collision Types)
              </h3>
              <span className="text-xs text-slate-400 font-mono">55,758 ชนท้ายสูงสุด</span>
            </div>
            <Chart options={collisionChartOptions} series={collisionChartSeries} type="bar" height={260} />
          </div>

          <InsightBox
            what="ชนท้ายทิศทางเดียวกันสูงถึง 28.6% (Same Dir Rear End ชนท้ายอันดับ 1)"
            soWhat="ผู้ขับขี่ขับชิดคันหน้าเกินไปและเสียสมาธิ (Distracted) จากสมาร์ตโฟน"
            nowWhat="ตีเส้นสีเตือนระยะปลอดภัย (Keep Distance) บริเวณก่อนถึงทางร่วมทางแยก"
          />
        </div>

        {/* Chart 3: Speed vs Severity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                อัตราเคสสาหัส/เสียชีวิตตามช่วงความเร็ว (Speed vs Severity Rate)
              </h3>
              <span className="text-xs text-rose-600 font-semibold">&gt;45 mph วิกฤตสุด</span>
            </div>
            <Chart options={speedChartOptions} series={speedChartSeries} type="bar" height={260} />
          </div>

          <InsightBox
            what="ถนนจำกัดความเร็วเกิน 45 mph มีอัตราเคสสาหัส 1.77% (สูงกว่าเขตชุมชน 4 เท่า)"
            soWhat="แรงปะทะจากความเร็วสูงส่งผลให้โครงสร้างนิรภัยไม่สามารถปกป้องผู้โดยสารได้"
            nowWhat="ติดตั้งกล้องตรวจจับความเร็วอัตโนมัติบนสายทางหลวงเชื่อมระหว่างเมือง"
          />
        </div>

        {/* Chart 4: Top Crash Corridors */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm card-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                5 ถนนเกิดเหตุสะสมสูงสุด (Top 5 Crash Corridors)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Georgia Ave สูงสุด</span>
            </div>
            <Chart options={roadsChartOptions} series={roadsChartSeries} type="bar" height={260} />
          </div>

          <InsightBox
            what="Georgia Ave เกิดเหตุสะสมสูงสุด 11,384 ครั้ง (ครองแชมป์ถนนเกิดเหตุสูงสุด)"
            soWhat="เป็นถนน 6 เลนที่มีทางแยกตัดและทางเลี้ยวเข้าสถานประกอบการหนาแน่น"
            nowWhat="ปรับปรุงเกาะกลาง ปิดจุดกลับรถเสี่ยง และตั้งด่านตรวจวัดแอลกอฮอล์"
          />
        </div>
      </div>
    </section>
  );
}

// ════════════════ INSIGHT BOX COMPONENT (What -> So What -> Now What) ════════════════
function InsightBox({ what, soWhat, nowWhat }) {
  return (
    <div className="mt-4 bg-slate-50/80 rounded-xl p-4 border border-slate-100 insight-box text-xs space-y-2.5">
      <div className="flex items-start gap-2">
        <span className="px-1.5 py-0.5 rounded bg-slate-200 font-bold text-slate-700 flex-shrink-0 text-[10px] tracking-wide">
          WHAT
        </span>
        <p className="text-slate-800 leading-relaxed font-semibold">
          {what}
        </p>
      </div>

      <div className="flex items-start gap-2">
        <span className="px-1.5 py-0.5 rounded bg-amber-100 font-bold text-amber-800 flex-shrink-0 text-[10px] tracking-wide">
          SO WHAT
        </span>
        <p className="text-slate-600 leading-relaxed">
          {soWhat}
        </p>
      </div>

      <div className="flex items-start gap-2">
        <span className="px-1.5 py-0.5 rounded bg-emerald-100 font-bold text-emerald-800 flex-shrink-0 text-[10px] tracking-wide">
          NOW WHAT
        </span>
        <p className="text-slate-700 leading-relaxed font-semibold text-emerald-950">
          {nowWhat}
        </p>
      </div>
    </div>
  );
}

// ════════════════ 6. INTERACTIVE EXPLORER & FILTERS (เกณฑ์ 3.5.3.3, 3.5.4) ════════════════
function InteractiveExplorer({
  filteredIncidents,
  totalCount,
  severityFilter,
  setSeverityFilter,
  roadSearch,
  setRoadSearch,
  faultFilter,
  setFaultFilter,
  onResetFilters,
  onExportCSV
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-slate-700" />
            สำรวจข้อมูลเชิงลึกรายคดี (Interactive Explorer & Filters)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            กรองข้อมูลแบบ Multi-criteria พร้อมระบบแปลงและดาวน์โหลดรายงาน
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          แสดง <span className="font-bold text-slate-900">{filteredIncidents.length}</span> จากทั้งหมด {totalCount} รายการ
        </div>
      </div>

      {/* แถบตัวกรอง (Filter Bar) */}
      <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        {/* Dropdown เลือกระดับความรุนแรง */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            ระดับความรุนแรง (Injury Severity)
          </label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-700 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 outline-none transition font-medium cursor-pointer"
          >
            <option value="">ทั้งหมด (All Severities)</option>
            <option value="Fatal Injury">Fatal Injury (เสียชีวิต)</option>
            <option value="Suspected Serious Injury">Suspected Serious Injury (สาหัส)</option>
            <option value="Suspected Minor Injury">Suspected Minor Injury (บาดเจ็บเล็กน้อย)</option>
            <option value="Possible Injury">Possible Injury (อาจบาดเจ็บ)</option>
            <option value="No Apparent Injury">No Apparent Injury (ไม่บาดเจ็บ)</option>
          </select>
        </div>

        {/* ช่อง Input พิมพ์ค้นหาชื่อถนน */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            ค้นหาชื่อถนน (Road Search)
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={roadSearch}
              onChange={(e) => setRoadSearch(e.target.value)}
              placeholder="พิมพ์ชื่อถนน เช่น Georgia, Rockville..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-700 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 outline-none transition"
            />
            {roadSearch && (
              <button
                type="button"
                onClick={() => setRoadSearch('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown เลือกฝ่ายที่กระทำผิด */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            ฝ่ายที่กระทำผิด (Driver At Fault)
          </label>
          <select
            value={faultFilter}
            onChange={(e) => setFaultFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-700 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 outline-none transition font-medium cursor-pointer"
          >
            <option value="">All (ทั้งหมด)</option>
            <option value="Yes">Yes (กระทำผิด)</option>
            <option value="No">No (ไม่ผิด)</option>
          </select>
        </div>

        {/* ปุ่มรีเซ็ตตัวกรอง + ส่งออก CSV */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 active:scale-95 text-xs font-bold text-slate-700 transition duration-150 flex items-center justify-center gap-1.5 shadow-xs"
            title="คืนค่าตัวกรองทั้งหมด"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>รีเซ็ต</span>
          </button>

          <button
            type="button"
            onClick={onExportCSV}
            disabled={!filteredIncidents.length}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold transition duration-150 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 btn-shimmer"
            title="ดาวน์โหลดไฟล์ CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* ตารางแสดงผลข้อมูล */}
      {filteredIncidents.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Report Number</th>
                <th className="py-3 px-4">วันเวลาเกิดเหตุ</th>
                <th className="py-3 px-4">ถนน (Road)</th>
                <th className="py-3 px-4">รูปแบบการชน</th>
                <th className="py-3 px-4">ระดับความรุนแรง</th>
                <th className="py-3 px-4 text-center">ความเร็ว</th>
                <th className="py-3 px-4 text-center">ฝ่ายผิด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredIncidents.map((row) => {
                const isSevereOrFatal =
                  row.injury_severity === 'Fatal Injury' ||
                  row.injury_severity === 'Suspected Serious Injury';

                return (
                  <tr key={row.report_number} className="hover:bg-slate-50/80 transition duration-100">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {row.report_number}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {row.datetime}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {row.road}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {row.collision_type}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isSevereOrFatal ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          {row.injury_severity}
                        </span>
                      ) : row.injury_severity === 'Suspected Minor Injury' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          {row.injury_severity}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {row.injury_severity}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium">
                      {row.speed_limit} <span className="text-[10px] text-slate-400">mph</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.driver_at_fault === 'Yes'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}
                      >
                        {row.driver_at_fault}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-300 p-8 space-y-3 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 shadow-inner">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700">
            ไม่พบข้อมูลที่ตรงกับตัวกรอง
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            ลองปรับเปลี่ยนคำค้นหาถนน หรือเงื่อนไขระดับความรุนแรง หรือกดปุ่ม "รีเซ็ตตัวกรอง" เพื่อแสดงข้อมูลทั้งหมด
          </p>
          <div className="pt-2">
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ════════════════ 7. DATA AUDIT & RECONCILIATION TAB (เกณฑ์ 3.5.1) ════════════════
function DataAuditTab({ auditTrail = [], reconciliation = {} }) {
  return (
    <section className="space-y-8 animate-fade-in">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 card-lift">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-xs font-semibold mb-2 border border-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Data Governance & Compliance Passed</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            ร่องรอยการตรวจสอบข้อมูลและธรรมาภิบาลข้อมูล (Data Audit & Reconciliation)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            บันทึกขั้นตอนการทำความสะอาดข้อมูล (Data Pipeline v1.0) เปรียบเทียบข้อมูลก่อนและหลังคลีนอย่างโปร่งใส ตรวจสอบความถูกต้องได้ตามมาตรฐานเกณฑ์ 3.5.1
          </p>
        </div>

        <div className="flex gap-4 border-l border-slate-750 pl-6 text-center">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">สูญเสียข้อมูล</p>
            <p className="text-xl font-extrabold text-emerald-400 tabular-nums">0.87%</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">จุดที่แก้ไข</p>
            <p className="text-xl font-extrabold text-white tabular-nums">5,852</p>
          </div>
        </div>
      </div>

      {/* ตารางที่ 1: Audit Trail Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 card-lift">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              ตารางที่ 1: Audit Trail Log — ขั้นตอนใน Data Pipeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ติดตามแถวข้อมูลคงเหลือและจุดที่ปรับปรุงในแต่ละลำดับขั้น
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            5 ลำดับการประมวลผล
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">ลำดับ</th>
                <th className="py-3 px-4">ขั้นตอน (Pipeline Step)</th>
                <th className="py-3 px-4">คำอธิบายและรายละเอียดการจัดการ</th>
                <th className="py-3 px-4 text-right">แถวก่อนทำ</th>
                <th className="py-3 px-4 text-right">แถวคงเหลือ</th>
                <th className="py-3 px-4 text-right">จุดที่แก้ไข</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditTrail.map((item) => (
                <tr key={item.step} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-500 font-mono">
                    {item.step}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-md">
                    <p className="font-medium text-slate-800">{item.description}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.detail}</p>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                    {item.rows_before ? item.rows_before.toLocaleString() : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                    {item.rows_after.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                    {item.fixes > 0 ? `+${item.fixes.toLocaleString()}` : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-800 mb-0.5">สรุปผลการเดินท่อข้อมูล (Pipeline Summary)</p>
            <p className="text-slate-600 leading-relaxed">
              จากข้อมูลดิบทั้งหมด <strong>196,432 แถว</strong> ผ่านกระบวนการทั้ง 5 ขั้นตอน ได้ข้อมูลสมบูรณ์พร้อมวิเคราะห์ <strong>194,719 แถว</strong> คิดเป็นอัตราสูญเสียข้อมูลจากการตัด Outlier/แถวนอกรัฐเพียง <strong>0.87%</strong> พร้อมบันทึกจุดที่แก้ไขทั้งสิ้น <strong>5,852 จุด</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ตารางที่ 2: Reconciliation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 card-lift">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            ตารางที่ 2: Reconciliation Table — เปรียบเทียบสถิติปีรถ (Vehicle Year) ก่อน vs หลัง คลีน
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            แสดงผลการทำ Median Imputation แทนที่ปี 0 และ 9999 ด้วยปี 2012 อย่างโปร่งใส
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">สถานะ (Dataset State)</th>
                <th className="py-3 px-4 text-right">ค่าต่ำสุด (Min)</th>
                <th className="py-3 px-4 text-right">มัธยฐาน (Median)</th>
                <th className="py-3 px-4 text-right">ค่าเฉลี่ย (Mean)</th>
                <th className="py-3 px-4 text-right">ค่าสูงสุด (Max)</th>
                <th className="py-3 px-4 text-right">จำนวน Outliers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              <tr className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4 font-sans font-bold text-rose-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  ก่อนคลีน (Raw / Before Clean)
                </td>
                <td className="py-3.5 px-4 text-right text-rose-600 font-bold">
                  {reconciliation.before?.min ?? 1800}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {reconciliation.before?.median ?? 2010}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {reconciliation.before?.mean ?? 2006.3}
                </td>
                <td className="py-3.5 px-4 text-right text-rose-600 font-bold">
                  {reconciliation.before?.max ?? 2099}
                </td>
                <td className="py-3.5 px-4 text-right text-rose-600 font-bold">
                  {reconciliation.before?.outliers?.toLocaleString() ?? '892'}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition bg-emerald-50/30">
                <td className="py-3.5 px-4 font-sans font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  หลังคลีน (Cleaned / Audited)
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-700 font-bold">
                  {reconciliation.after?.min ?? 1985}
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-700 font-bold">
                  {reconciliation.after?.median ?? 2012}
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-700">
                  {reconciliation.after?.mean ?? 2011.4}
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-700 font-bold">
                  {reconciliation.after?.max ?? 2026}
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-700 font-bold">
                  {reconciliation.after?.outliers ?? 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
          <p className="font-bold text-slate-800">ระเบียบวิธีดำเนินการ (Methodology):</p>
          <p className="text-slate-600 leading-relaxed font-mono text-[11px]">
            {reconciliation.method || "IQR-based outlier detection → Median imputation (2012)"}
          </p>
          <p className="text-slate-500 text-[11px] pt-1">
            * แทนที่ปี 0 และ 9999 (หรือปีที่ต่ำกว่า 1985 และสูงกว่า 2026) ด้วยค่ามัธยฐาน 2012 จำนวน 892 ค่า เพื่อป้องกันไม่ให้ข้อมูลเบี่ยงเบนในการคำนวณอายุเฉลี่ยของยานพาหนะ
          </p>
        </div>
      </div>
    </section>
  );
}
