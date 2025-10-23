// src/pages/ProfilePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck, Mail, Phone, Shield, User as UserIcon, Clock, MapPin,
  Layers, FileUser, ChevronLeft, Activity, Droplet, AlertCircle, CheckCircle, History,X} from "lucide-react";
import { db } from "./firebase"; 
import {
  doc, getDoc, onSnapshot, collection, query, orderBy, limit
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

/* --------------------- Utils --------------------- */
function getInitials(name = "?") {
  const txt = String(name || "").trim();
  if (!txt) return "?";
  const parts = txt.split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts[parts.length - 1]?.[0] || "";
  return (first + last).toUpperCase();
}
const fmt = (d) => d ? d.toLocaleString("th-TH") : "-";

/* --------------------- Page ---------------------- */
export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
    const [detail, setDetail] = useState({ open: false, loading: false, error: null, data: null });

    const openDetail = async (row) => {
    setDetail({ open: true, loading: true, error: null, data: null });
    try {
        setDetail({ open: true, loading: false, data: row });
    } catch (e) {
        setDetail({ open: true, loading: false, error: e.message || String(e) });
    }
    };

const closeResultDetail = () => setDetail({ open: false, loading: false, error: null, data: null });

  // รับ user จาก location.state หรือ localStorage
  const [user, setUser] = useState(null);
  useEffect(() => {
    const u = location.state?.user || JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);
  }, [location.state]);

  // โหลดข้อมูลโปรไฟล์จาก Firestore (document: User/{id})
  const [userDoc, setUserDoc] = useState(null);
  const [meta, setMeta] = useState({ loading: true, error: null });
  useEffect(() => {
    if (!user?.id) { setMeta({ loading: false, error: "ไม่พบผู้ใช้" }); return; }
    const ref = doc(db, "User", user.id);
    getDoc(ref)
      .then((snap) => {
        setUserDoc(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setMeta({ loading: false, error: snap.exists() ? null : "ไม่พบข้อมูลผู้ใช้ในฐานข้อมูล" });
      })
      .catch((e) => setMeta({ loading: false, error: e.message || String(e) }));
  }, [user?.id]);

  // ผล “ระดับที่ 1” (TestResults) – realtime ล่าสุด 20 รายการ
  const [L1, setL1] = useState([]);
  const [loadL1, setLoadL1] = useState(true);
  const [errL1, setErrL1] = useState(null);
  useEffect(() => {
    if (!user?.id) return;
    const ref = collection(doc(db, "User", user.id), "TestResults");
    const q = query(ref, orderBy("createdAt", "desc"), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => {
        const data = d.data() || {};
        const createdAt = data.createdAt?.toDate?.() || data.CreatedAt?.toDate?.() || null;
        const updatedAt = data.updatedAt?.toDate?.() || data.UpdatedAt?.toDate?.() || null;
        return { id: d.id, ...data, createdAt, updatedAt };
      });
      setL1(rows);
      setLoadL1(false);
      setErrL1(null);
    }, (e) => { setErrL1(e.message || String(e)); setLoadL1(false); });
    return () => unsub();
  }, [user?.id]);

  // ผล “ระดับที่ 2” (TestResults2) – realtime ล่าสุด 20 รายการ
  const [L2, setL2] = useState([]);
  const [loadL2, setLoadL2] = useState(true);
  const [errL2, setErrL2] = useState(null);
  useEffect(() => {
    if (!user?.id) return;
    const ref = collection(doc(db, "User", user.id), "TestResults2");
    const q = query(ref, orderBy("createdAt", "desc"), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => {
        const data = d.data() || {};
        const createdAt = data.createdAt?.toDate?.() || data.CreatedAt?.toDate?.() || null;
        const updatedAt = data.updatedAt?.toDate?.() || data.UpdatedAt?.toDate?.() || null;
        return { id: d.id, ...data, createdAt, updatedAt };
      });
      setL2(rows);
      setLoadL2(false);
      setErrL2(null);
    }, (e) => { setErrL2(e.message || String(e)); setLoadL2(false); });
    return () => unsub();
  }, [user?.id]);

  // การ์ดสรุปล่าสุดของแต่ละระดับ
  const latestL1 = L1[0] || null;
  const latestL2 = L2[0] || null;

  // UI Tab
  const [tab, setTab] = useState("L1");

  // สรุป count
  const stat = useMemo(() => ({
    totalL1: L1.length,
    totalL2: L2.length,
    countPress: Number(userDoc?.CountPress || 0),
    countLogin: Number(userDoc?.Count || 0),
  }), [L1.length, L2.length, userDoc]);

  // Loading รวม
  const bigLoading = meta.loading || (loadL1 && loadL2);
  

  return (
    <div className="font-kanit min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-cyan-700 hover:text-cyan-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> กลับ
        </button>

        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg border border-emerald-100 p-6 md:p-8">
          {bigLoading ? (
            <div className="animate-pulse h-24 bg-gray-100 rounded-xl" />
          ) : meta.error ? (
            <div className="text-red-600">{meta.error}</div>
          ) : (
            <Header userDoc={userDoc} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* สรุปสั้น 3 การ์ด */}
        <MiniStats stat={stat} />

        {/* สรุประดับล่าสุด 2 การ์ด */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <LatestLevelCard
            title="สรุประดับที่ 1 (ล่าสุด)"
            icon={<Activity className="w-4 h-4 text-emerald-600" />}
            loading={loadL1}
            error={errL1}
            data={latestL1}
            renderContent={(r) => (
              <div className="text-sm text-gray-700 space-y-1">
                <div><span className="text-gray-500">วันที่:</span> {fmt(r.createdAt)}</div>
                <div><span className="text-gray-500">หญิง:</span> {r?.patient?.MCV ?? "-"} / {r?.patient?.MCH ?? "-"} / {r?.patient?.DCIP ?? "-"}</div>
                <div><span className="text-gray-500">สามี:</span> {r?.partner?.MCV ?? "-"} / {r?.partner?.MCH ?? "-"} / {r?.partner?.DCIP ?? "-"}</div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">สรุป:</span>
                  <span className="font-medium">{r?.patient?.result?.title || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500">สถานะ:</span>{" "}
                  <BadgeStatus status={r?.status} />
                </div>
              </div>
            )}
          />

          <LatestLevelCard
            title="สรุประดับที่ 2 (ล่าสุด)"
            icon={<Droplet className="w-4 h-4 text-cyan-600" />}
            loading={loadL2}
            error={errL2}
            data={latestL2}
            renderContent={(r) => (
              <div className="text-sm text-gray-700 space-y-1">
                <div><span className="text-gray-500">วันที่:</span> {fmt(r.createdAt)}</div>
                <div><span className="text-gray-500">หญิง:</span> {r?.couple?.woman?.label || "-"}</div>
                <div><span className="text-gray-500">ชาย:</span> {r?.couple?.husband?.label || "-"}</div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500">แปลผล:</span>
                  <span className="font-medium whitespace-pre-line">
                    {Array.isArray(r?.screening?.details) ? r.screening.details.join("\n") : (r?.screening?.details || "-")}
                  </span>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      {/* ประวัติย้อนหลัง + Tabs */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-md border border-cyan-100">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-white to-cyan-50/30 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-xl border shadow-sm">
                <History className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">ประวัติการวิเคราะห์ย้อนหลัง</h2>
                <p className="text-sm text-gray-500">ดูรายการย้อนหลังทั้งหมดของแต่ละระดับ</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTab("L1")}
                className={`px-4 py-2 rounded-xl border transition ${
                  tab === "L1" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white hover:bg-gray-50"
                }`}
              >
                ระดับที่ 1
              </button>
              <button
                onClick={() => setTab("L2")}
                className={`px-4 py-2 rounded-xl border transition ${
                  tab === "L2" ? "bg-cyan-600 text-white border-cyan-600" : "bg-white hover:bg-gray-50"
                }`}
              >
                ระดับที่ 2
              </button>
            </div>
          </div>

            <div className="p-4">
            {tab === "L1" ? (
                <HistoryL1
                loading={loadL1}
                error={errL1}
                rows={L1}
                onRowClick={openDetail}   
                />
            ) : (
                <HistoryL2 loading={loadL2} error={errL2} rows={L2} />
            )}
            </div>

        </div>
      </div>
{detail.open && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-600 to-emerald-500 p-4 text-white flex items-center justify-between">
        <h3 className="font-semibold text-lg">รายละเอียดผลระดับที่ 1</h3>
        <button onClick={closeResultDetail} className="rounded-lg p-1 hover:bg-white/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5">
        {detail.loading && <div className="text-gray-500">กำลังโหลด...</div>}
        {detail.error && <div className="text-red-600">เกิดข้อผิดพลาด: {detail.error}</div>}
        {!detail.loading && !detail.error && detail.data && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              <div>สถานะเคส: <span className="font-medium text-gray-800">{detail.data.status || "-"}</span></div>
              <div>เริ่มบันทึก: {detail.data.createdAt ? detail.data.createdAt.toLocaleString("th-TH") : "-"}</div>
              <div>อัปเดตล่าสุด: {detail.data.updatedAt ? detail.data.updatedAt.toLocaleString("th-TH") : "-"}</div>
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* หญิง */}
              <div className="border rounded-xl p-4">
                <div className="font-semibold text-emerald-700 mb-2">หญิงตั้งครรภ์</div>
                <div className="space-y-1 text-gray-800 text-sm">
                  <div>MCV: <span className="font-medium">{detail.data?.patient?.MCV ?? "-"}</span></div>
                  <div>MCH: <span className="font-medium">{detail.data?.patient?.MCH ?? "-"}</span></div>
                  <div>DCIP: <span className="font-medium">{detail.data?.patient?.DCIP ?? "-"}</span></div>
                </div>
                {detail.data?.patient?.result && (
                  <div className="mt-3">
                    <div className="font-medium">ผลแปลผล:</div>
                    <div className="text-gray-800">{detail.data.patient.result.title}</div>
                    {Array.isArray(detail.data.patient.result.details) && (
                      <ul className="list-disc ml-5 mt-1 text-gray-700">
                        {detail.data.patient.result.details.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    )}
                    {detail.data.patient.result.advice && (
                      <div className="mt-1 text-gray-700"><span className="font-medium">คำแนะนำ:</span> {detail.data.patient.result.advice}</div>
                    )}
                  </div>
                )}
              </div>

              {/* สามี */}
              <div className="border rounded-xl p-4">
                <div className="font-semibold text-cyan-700 mb-2">สามี</div>
                {detail.data?.partner ? (
                  <>
                    <div className="space-y-1 text-gray-800 text-sm">
                      <div>MCV: <span className="font-medium">{detail.data.partner.MCV ?? "-"}</span></div>
                      <div>MCH: <span className="font-medium">{detail.data.partner.MCH ?? "-"}</span></div>
                      <div>DCIP: <span className="font-medium">{detail.data.partner.DCIP ?? "-"}</span></div>
                    </div>
                    {detail.data.partner.result && (
                      <div className="mt-3">
                        <div className="font-medium">ผลแปลผล:</div>
                        <div className="text-gray-800">{detail.data.partner.result.title}</div>
                        {Array.isArray(detail.data.partner.result.details) && (
                          <ul className="list-disc ml-5 mt-1 text-gray-700">
                            {detail.data.partner.result.details.map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        )}
                        {detail.data.partner.result.advice && (
                          <div className="mt-1 text-gray-700"><span className="font-medium">คำแนะนำ:</span> {detail.data.partner.result.advice}</div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500">ยังไม่มีข้อมูลของสามี</div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button onClick={closeResultDetail} className="px-4 py-2 rounded-xl border">ปิด</button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
}

/* --------------------- Sub-components --------------------- */

function Header({ userDoc }) {
  const initials = getInitials(userDoc?.UserName || userDoc?.displayName || "?");
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      {/* Avatar */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
        {initials}
        <span className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
          <BadgeCheck className="w-5 h-5 text-emerald-500" />
        </span>
      </div>

      {/* Title & Primary Info */}
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          {userDoc?.UserName || "-"}
          <span className="text-sm font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            โปรไฟล์ของฉัน
          </span>
        </h1>
        <p className="mt-2 text-gray-600 flex flex-wrap items-center gap-4">
          {userDoc?.Address && (<span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4" />{userDoc.Address}</span>)}
        </p>
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
        <InfoPill icon={<Shield className="w-4 h-4" />} label="ตำแหน่ง" value={userDoc?.Role || "-"} />
        <InfoPill icon={<UserIcon className="w-4 h-4" />} label="สถานะ" value={userDoc?.Active ? "Active" : "Inactive"} />
        <InfoPill icon={<Clock className="w-4 h-4" />} label="นับเข้าใช้" value={String(userDoc?.Count ?? 0)} />
        <InfoPill icon={<FileUser className="w-4 h-4" />} label="กดวิเคราะห์ทั้งหมด" value={String(userDoc?.CountPress ?? 0)} />
      </div>
    </div>
  );
}

function MiniStats({ stat }) {
  const items = [
    { title: "วิเคราะห์ระดับที่ 1", value: stat.totalL1, icon: <Activity className="w-5 h-5" />, tone: "from-emerald-50 to-white", ring: "ring-emerald-200" },
    { title: "วิเคราะห์ระดับที่ 2", value: stat.totalL2, icon: <Droplet className="w-5 h-5" />, tone: "from-cyan-50 to-white", ring: "ring-cyan-200" },
    { title: "กดวิเคราะห์ทั้งหมด", value: stat.countPress, icon: <History className="w-5 h-5" />, tone: "from-amber-50 to-white", ring: "ring-amber-200" },
  ];
  return (
    <>
      {items.map((it, idx) => (
        <div key={idx} className={`bg-gradient-to-br ${it.tone} rounded-2xl p-5 shadow border ring-1 ${it.ring}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{it.title}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{it.value}</div>
            </div>
            <div className="p-3 bg-white rounded-xl border shadow-sm">{it.icon}</div>
          </div>
        </div>
      ))}
    </>
  );
}

function LatestLevelCard({ title, icon, loading, error, data, renderContent }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-cyan-100">
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-white to-cyan-50/30 rounded-t-2xl">
        <div className="p-2 bg-white rounded-xl border shadow-sm">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">สรุปผลล่าสุดจากฐานข้อมูล</p>
        </div>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="animate-pulse h-24 bg-gray-100 rounded-xl" />
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !data ? (
          <div className="text-gray-500">ยังไม่มีข้อมูล</div>
        ) : (
          renderContent(data)
        )}
      </div>
    </div>
  );
}

function BadgeStatus({ status }) {
  if (status === "awaiting_partner") {
    return <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">ยังไม่มีข้อมูลของสามี</span>;
  }
  if (status === "completed") {
    return <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">ครบถ้วน</span>;
  }
  if (!status) return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">-</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">{status}</span>;
}

/* ------------ Tables (History) ------------ */
function HistoryL1({ loading, error, rows = [], onRowClick }) {
  if (loading) return <div className="text-gray-500">กำลังโหลดผลระดับที่ 1...</div>;
  if (error)   return <div className="text-red-600">เกิดข้อผิดพลาด: {error}</div>;
  if (!rows.length) return <div className="text-gray-500">ยังไม่มีผลระดับที่ 1</div>;

  return (
    <div className="overflow-auto rounded-xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr className="text-left">
            <th className="px-4 py-3">วันที่</th>
            <th className="px-4 py-3">หญิง (MCV/MCH/DCIP)</th>
            <th className="px-4 py-3">สรุปหญิง</th>
            <th className="px-4 py-3">สถานะเคส</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r) => {
            const p = r?.patient || {};
            return (
              <tr
                key={r.id}
                className="hover:bg-gray-50 cursor-pointer"  // ✅ รูปมือเมื่อชี้
                onClick={() => onRowClick?.(r)}               // ✅ เปิด Modal
                title="คลิกเพื่อดูรายละเอียด"
              >
                <td className="px-4 py-2">{fmt(r.createdAt)}</td>
                <td className="px-4 py-2">
                  {p?.MCV ?? "-"} / {p?.MCH ?? "-"} / {p?.DCIP ?? "-"}
                </td>
                <td className="px-4 py-2">{p?.result?.title || "-"}</td>
                <td className="px-4 py-2">
                  <BadgeStatus status={r?.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


function HistoryL2({ loading, error, rows }) {
  if (loading) return <div className="animate-pulse h-28 bg-gray-100 rounded-xl" />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (rows.length === 0) return <div className="text-gray-500">ยังไม่มีผลระดับที่ 2</div>;

  return (
    <div className="overflow-auto rounded-xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr className="text-left">
            <th className="px-4 py-3">วันที่</th>
            <th className="px-4 py-3">หญิง</th>
            <th className="px-4 py-3">ชาย</th>
            <th className="px-4 py-3">แปลผล</th>
            <th className="px-4 py-3">คำแนะนำ</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r) => {
            const details = Array.isArray(r?.screening?.details)
              ? r.screening.details.join(" / ")
              : (r?.screening?.details || "-");
            return (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{fmt(r.createdAt)}</td>
                <td className="px-4 py-2">{r?.couple?.woman?.label || "-"}</td>
                <td className="px-4 py-2">{r?.couple?.husband?.label || "-"}</td>
                <td className="px-4 py-2 whitespace-pre-line">{details}</td>
                <td className="px-4 py-2 whitespace-pre-line">{r?.screening?.advice || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function InfoPill({ icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white border text-gray-700">
      {icon}
      <span className="font-medium">{label}:</span>
      <span className="text-gray-600">{value || "-"}</span>
    </div>
  );
}
