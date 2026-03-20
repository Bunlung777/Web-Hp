import { useEffect, useState, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2"; // เปลี่ยนเป็น Doughnut
import { Users, Activity, Building2, BarChart2, X } from "lucide-react";
import Navbar from "./Navbar";
ChartJS.register(ArcElement, Tooltip, Legend);

const firebaseConfig = {
  apiKey: "AIzaSyAyXiH4tR_fNFxiLJX62OFo92T0f9Zv3Qw",
  authDomain: "hp-project-b5b21.firebaseapp.com",
  projectId: "hp-project-b5b21",
  storageBucket: "hp-project-b5b21.firebasestorage.app",
  messagingSenderId: "672851387793",
  appId: "1:672851387793:web:8f09499b9a68391ed6a630",
  measurementId: "G-BNV4F6E4P0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const USERS_COL = "User";

// ปรับชุดสีให้ดู Modern ขึ้น
const PALETTE = [
  "#3b82f6", "#10b981", "#6366f1",
  "#f59e0b", "#ec4899", "#f97316", "#84cc16",
];

// ---- MetricCard ----
function MetricCard({ icon, label, value, sub, accent }) {
  return (

    <div style={{
      background: "var(--color-bg)",
      border: "1px solid var(--color-border)",
      borderRadius: 16, // เพิ่มความโค้งมน
      padding: "1.25rem 1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", // เพิ่มเงาบางๆ
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      transition: "transform 0.2s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-muted)", margin: 0 }}>{label}</p>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: accent + "1A", // ลด opacity ลงเพื่อให้ดูเนียนตา
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: accent, display: "flex" }}>{icon}</span>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>{value}</p>
        {sub && <p style={{ fontSize: 12, color: "var(--color-faint)", margin: 0 }}>{sub}</p>}
      </div>
    </div>
  );
}

// ---- Panel ----
function Panel({ title, children, subtitle }) {
  return (
    <div style={{
      background: "var(--color-bg)",
      border: "1px solid var(--color-border)",
      borderRadius: 16,
      padding: "1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text)", margin: "0 0 4px" }}>{title}</p>
        {subtitle && <p style={{ fontSize: 13, color: "var(--color-muted)", margin: 0 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ---- Drill-down modal ----
function DrillDownPanel({ address, users, onClose }) {
  const usersInAddress = useMemo(
    () =>
      users
        .filter((u) => (u.Address || "Unknown") === address)
        .sort((a, b) => (b.Count ?? 0) - (a.Count ?? 0)),
    [address, users]
  );

  const maxCount = Math.max(...usersInAddress.map((u) => u.Count ?? 0), 1);
  const totalLogins = usersInAddress.reduce((s, u) => s + (u.Count ?? 0), 0);

  return (

    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15, 23, 42, 0.4)", // สี backdrop เข้มขึ้นนิดหน่อย
        backdropFilter: "blur(4px)", // เพิ่มความเบลอให้ดูพรีเมียม
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--color-bg)",
          borderRadius: 20,
          padding: "1.75rem",
          width: "100%",
          maxWidth: 540,
          maxHeight: "80vh",
          overflowY: "auto",
          border: "1px solid var(--color-border)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--color-surface)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "#6366f11A",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Building2 size={20} color="#6366f1" />
              </div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text)", margin: "0 0 2px" }}>
                  {address}
                </p>
                <p style={{ fontSize: 13, color: "var(--color-muted)", margin: 0 }}>
                  {usersInAddress.length} ผู้ใช้งาน · {totalLogins.toLocaleString()} การเข้าสู่ระบบทั้งหมด
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--color-surface)",
              border: "none",
              borderRadius: "50%",
              width: 32, height: 32,
              cursor: "pointer",
              color: "var(--color-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--color-surface)"}
          >
            <X size={18} />
          </button>
        </div>

        {/* User rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {usersInAddress.map((u, i) => {
            const count = u.Count ?? 0;
            const pct = Math.round((count / maxCount) * 100);
            const sharePct = totalLogins ? Math.round((count / totalLogins) * 100) : 0;
            const color = PALETTE[i % PALETTE.length];
            const displayName = u.UserName || "Unknown User";

            return (
              <div key={u.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: color + "1A",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 600, color,
                      flexShrink: 0,
                    }}>
                      {displayName?.[0]?.toUpperCase() ?? "?"}
                    </span>
                    <span style={{ fontSize: 14, color: "var(--color-text)", fontWeight: 500 }}>
                      {displayName}
                    </span>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>
                      {count.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--color-muted)", width: "40px", textAlign: "right" }}>
                      {sharePct}%
                    </span>
                  </div>
                </div>
                <div style={{
                  height: 6, borderRadius: 99,
                  background: "var(--color-surface)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: pct + "%",
                    background: color,
                    borderRadius: 99,
                    transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Main Dashboard ----
export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, USERS_COL), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const totalUsers = users.length;

  const totalLogin = useMemo(
    () => users.reduce((sum, u) => sum + (u.Count ?? 0), 0),
    [users]
  );

  const loginByAddress = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      const addr = u.Address || "Unknown";
      map[addr] = (map[addr] ?? 0) + (u.Count ?? 0);
    });
    return Object.entries(map)
      .map(([address, count]) => ({ address, count }))
      .sort((a, b) => b.count - a.count);
  }, [users]);

  const totalAddress = loginByAddress.length;
  // const avgLogin = totalUsers ? (totalLogin / totalUsers).toFixed(1) : "0";

  const labels = loginByAddress.map((a) => a.address);
  const counts = loginByAddress.map((a) => a.count);

  const doughnutData = {
    labels,
    datasets: [{
      data: counts,
      backgroundColor: PALETTE,
      borderWidth: 3, // เพิ่มช่องว่างให้กราฟดูไม่อึดอัด
      borderColor: "#ffffff",
      hoverOffset: 8,
      borderRadius: 4, // กราฟขอบมน
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%", // เจาะรูตรงกลางให้เป็นทรงโดนัท
    onClick: (_, elements) => {
      if (elements.length > 0) setSelectedAddress(labels[elements[0].index]);
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length ? "pointer" : "default";
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { size: 14, family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (ctx) => `  ${ctx.parsed.toLocaleString()} ครั้งเข้าสู่ระบบ (คลิกเพื่อดูรายละเอียด)`,
        },
      },
    },
  };

  return (
            <div className="font-kanit">
        <Navbar/>
    <div style={{
      "--color-bg": "#ffffff",
      "--color-surface": "#f8fafc", // ปรับพื้นหลังให้สว่างและสะอาดขึ้น
      "--color-border": "#e2e8f0",
      "--color-text": "#0f172a",
      "--color-muted": "#64748b",
      "--color-faint": "#94a3b8",
      minHeight: "100vh",
      background: "var(--color-surface)",
      padding: "2rem",
      fontFamily: "'Inter', 'Sarabun', system-ui, sans-serif", // เพิ่ม Sarabun สำหรับภาษาไทย
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}> {/* จำกัดความกว้างให้ดูสวยงามบนจอใหญ่ */}
        
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text)", margin: 0, letterSpacing: "-0.02em" }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-muted)", margin: "6px 0 0" }}>
            ภาพรวมการเข้าใช้งานระบบและข้อมูลตามพื้นที่
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // ปรับให้ไหลตามจออัตโนมัติ
          gap: "1.25rem",
          marginBottom: "1.5rem",
        }}>
          <MetricCard icon={<Users size={20} />} label="Total Users" value={totalUsers.toLocaleString()} sub="ผู้ใช้งานทั้งหมด" accent="#3b82f6" />
          <MetricCard icon={<Activity size={20} />} label="Total Logins" value={totalLogin.toLocaleString()} sub="ล็อกอินทั้งหมด" accent="#10b981" />
          <MetricCard icon={<Building2 size={20} />} label="Total Addresses" value={totalAddress} sub="พื้นที่/อำเภอทั้งหมด" accent="#6366f1" />
        </div>

        <Panel 
          title="Logins by Address" 
          subtitle="สัดส่วนการเข้าสู่ระบบแยกตามพื้นที่ (คลิกที่กราฟหรือชื่อเพื่อดูรายละเอียดผู้ใช้งาน)"
        >
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "minmax(300px, 1fr) minmax(250px, 350px)", // แบ่ง Layout ซ้ายขวา
            gap: "2rem",
            alignItems: "center"
          }}>
            {/* ฝั่งกราฟ */}
            <div style={{ position: "relative", height: 380, width: "100%" }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
              
              {/* ข้อความตรงกลางโดนัท */}
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none"
              }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: "var(--color-text)", lineHeight: 1 }}>{totalLogin.toLocaleString()}</span>
                <span style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 4 }}>Logins</span>
              </div>
            </div>

            {/* ฝั่ง Label */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 8,
              maxHeight: 380,
              overflowY: "auto",
              paddingRight: 8
            }}>
              {labels.map((addr, i) => {
                const total = counts.reduce((a, b) => a + b, 0);
                const pct = total ? ((counts[i] / total) * 100).toFixed(1) : 0;
                return (
                  <button
                    key={addr}
                    onClick={() => setSelectedAddress(addr)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "var(--color-surface)", 
                      border: "1px solid transparent", 
                      borderRadius: 8,
                      cursor: "pointer", 
                      padding: "8px 12px",
                      transition: "all 0.2s",
                      textAlign: "left"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.background = "var(--color-bg)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.background = "var(--color-surface)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: PALETTE[i % PALETTE.length],
                        display: "inline-block", flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 14, color: "var(--color-text)", fontWeight: 500 }}>{addr}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)", display: "block" }}>{counts[i].toLocaleString()}</span>
                      <span style={{ fontSize: 11, color: "var(--color-muted)" }}>{pct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Panel>

        {selectedAddress && (
          <DrillDownPanel
            address={selectedAddress}
            users={users}
            onClose={() => setSelectedAddress(null)}
          />
        )}
      </div>
    </div>
    </div>
  );
}