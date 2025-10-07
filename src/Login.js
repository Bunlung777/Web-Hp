// src/pages/LoginThemed.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Eye, EyeOff, User, Lock, Heart, Shield, CheckCircle, X, MapPin, Building2, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Firebase ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

// ถ้ามี firebaseConfig อยู่ไฟล์อื่น ให้ import มาแทนบรรทัดนี้
// import { firebaseConfig } from "@/firebaseConfig";
const firebaseConfig = {
  apiKey: "AIzaSyAyXiH4tR_fNFxiLJX62OFo92T0f9Zv3Qw",
  authDomain: "hp-project-b5b21.firebaseapp.com",
  projectId: "hp-project-b5b21",
  storageBucket: "hp-project-b5b21.firebasestorage.app",
  messagingSenderId: "672851387793",
  appId: "1:672851387793:web:8f09499b9a68391ed6a630",
  measurementId: "G-BNV4F6E4P0",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const LoginThemed = () => {
  const navigate = useNavigate();

  // ------- Firestore: users (Address, UserName, Password, Role, Count, Active) -------
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "User"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingUsers(false);
    });
    return () => unsub();
  }, []);

  // ------- Top Alert / Toast -------
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const dismissTimer = useRef(null);
  const showAlert = (msg, type = "success", timeout = 2500) => {
    setAlert({ show: true, message: msg, type });
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (timeout) dismissTimer.current = setTimeout(() => setAlert((a) => ({ ...a, show: false })), timeout);
  };
  useEffect(() => () => dismissTimer.current && clearTimeout(dismissTimer.current), []);

  // ------- Form state -------
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ------- Lists (districts / hospitals) -------
  const districts = useMemo(() => {
    const list = Array.from(new Set(users.map((u) => u.Address).filter(Boolean)));
    return list.sort((a, b) => a.localeCompare(b, "th-TH"));
  }, [users]);

  const hospitalsInDistrict = useMemo(() => {
    const list = users.filter((u) => u.Address === selectedDistrict);
    return list.sort((a, b) => String(a.UserName || "").localeCompare(String(b.UserName || ""), "th-TH"));
  }, [users, selectedDistrict]);

  const selectedUser = useMemo(() => users.find((u) => u.id === selectedUserId), [users, selectedUserId]);
  const username = selectedUser?.UserName || "";

  const disabledBtn =
    "bg-gradient-to-r from-gray-300 to-gray-300 text-white shadow-none cursor-not-allowed pointer-events-none";
  const activeBtn =
    "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";

  const isSubmitDisabled = !selectedUser || !password || isLoading;

  // ------- Actions -------
  const trySubmit = async () => {
    if (!selectedUser) return showAlert("กรุณาเลือกอำเภอและหน่วยบริการ", "error");
    if (!selectedUser.Active) return showAlert("บัญชีนี้ถูกปิดใช้งาน", "error");
    if (String(password) !== String(selectedUser.Password || "")) return showAlert("รหัสผ่านไม่ถูกต้อง", "error");

    try {
      setIsLoading(true);
      // เพิ่ม Count (จำนวนครั้งเข้าใช้)
      const next = Number(selectedUser.Count || 0) + 1;
      await updateDoc(doc(db, "User", selectedUser.id), { Count: next });

      const okMsg = `เข้าสู่ระบบสำเร็จ: ${selectedUser.UserName} (${selectedUser.Role || "-"})`;
      navigate("/ThalassemiaScreening", {
        state: { toast: { type: "success", message: okMsg, timeout: 2000 } },
        replace: true,
      });
    } catch (e) {
      showAlert(`เกิดข้อผิดพลาด: ${e.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    navigate("/ThalassemiaScreening", {
      state: { toast: { type: "success", message: "" } },
      replace: true,
    });
  };

  // กด Enter เพื่อส่งฟอร์ม
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitDisabled) trySubmit();
  };

  return (
    <div className="font-kanit min-h-screen bg-white relative overflow-hidden">
      {/* background blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-teal-400 rounded-full blur-3xl" />
        <div className="absolute top-32 -right-10 w-48 h-48 bg-cyan-400 rounded-full blur-3xl" />
        <div className="absolute bottom-16 left-16 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
      </div>

      {/* Top Alert */}
      {/* <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
        <div
          className={[
            "mt-3 w-full max-w-xl rounded-xl border p-3 shadow-lg transition-all duration-300 pointer-events-auto",
            alert.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
            alert.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800",
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">{alert.message}</span>
            <button
              type="button"
              onClick={() => setAlert((a) => ({ ...a, show: false }))}
              className="ml-auto rounded p-1 hover:bg-black/5"
              aria-label="ปิดแจ้งเตือน"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div> */}

      {/* content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Branding / left side */}
          <div className="hidden md:flex">
            <div className="flex-1 rounded-3xl overflow-hidden shadow-xl border border-white/30 bg-white/30 backdrop-blur-md">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-7 md:p-9 text-white h-full flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold leading-tight">ThaLoeiLRU</h1>
                    <p className="text-white/90 text-sm">ระบบคัดกรองธาลัสซีเมีย</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3 text-white/95 w-[350px]">
                  <Feature text="ลดความผิดพลาดในการตีความผลคัดกรอง (เช่น MCV/MCH และ DCIP)" />
                  <Feature text="เร่งรัดการส่งต่อคู่สมรสหรือการตรวจเพิ่มเติมเมื่อพบความเสี่ยง" />
                  <Feature text="เก็บสถิติการเข้าใช้งาน" />
                  <Feature text="ล็อกอินด้วยอำเภอและหน่วยบริการ" />
                </div>

                <div className="mt-auto pt-10 text-white/80 text-xs">
                  © {new Date().getFullYear()} ThaiLoeiLRU — All rights reserved.
                </div>
              </div>
            </div>
          </div>

          {/* Form / right side */}
          <div className="rounded-3xl shadow-2xl border border-white/30 bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-center">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Shield className="w-6 h-6" /> เข้าสู่ระบบ
              </h2>
              {/* <p className="text-white/90 text-sm mt-1">เลือกอำเภอ → หน่วยบริการ → กรอกรหัสผ่าน</p> */}
            </div>

            <div className="p-6 md:p-8" onKeyDown={onKeyDown}>
              <div className="space-y-6">
                {/* District */}
                {/* <Field label="อำเภอ" icon={MapPin}>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedUserId("");
                      setPassword("");
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                    disabled={loadingUsers}
                  >
                    <option value="">
                      {loadingUsers ? "กำลังโหลดอำเภอ..." : "-- เลือกอำเภอ --"}
                    </option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field> */}

                                  {/* Hospital */}
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                    หน่วยบริการ / โรงพยาบาล
                  </label> */}

                  {/* กล่อง select (สูงคงที่ + relative เฉพาะส่วนนี้) */}
                  {/* <div className="relative"> */}
                    {/* ไอคอนซ้าย ตรึงกลางแนวแกน Y ของ select */}
                    {/* <Building2
                      className="
                        absolute left-3 top-1/2 -translate-y-1/2
                        h-5 w-5 text-gray-400 pointer-events-none
                      "
                    /> */}

                    {/* ซ่อนลูกศร native + ให้ความสูงคงที่ */}
                    {/* <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      disabled={!selectedDistrict}
                      className="
                        w-full h-12 pl-10 pr-10
                        border border-gray-300 rounded-xl bg-white/80
                        focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                        appearance-none disabled:opacity-60
                      "
                    >
                      <option value="">
                        {selectedDistrict ? "-- เลือกหน่วยบริการ --" : "กรุณาเลือกอำเภอก่อน"}
                      </option>
                      {hospitalsInDistrict.map((u) => (
                        <option key={u.id} value={u.id}>{u.UserName}</option>
                      ))}
                    </select> */}

                    {/* ลูกศรขวา (เลือกใส่/ไม่ใส่ก็ได้) */}
                    {/* <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                      viewBox="0 0 20 20" fill="currentColor"
                    >
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                    </svg>
                  </div> */}

                  {/* แถว badge/status แยกออกมา ไม่อยู่ใน relative เดียวกับ select */}
                  {/* <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700">เจ้าหน้าที่</span>
                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">
                      เข้าใช้ {selectedUser?.Count ?? 0} ครั้ง
                    </span>
                    <span className="ml-auto text-emerald-600">{selectedUser?.Active ? "Active" : "Inactive"}</span>
                  </div> */}


                {/* Username (read-only) */}
                {/* <Field label="ชื่อผู้ใช้ (อัตโนมัติจากหน่วยบริการ)" icon={User}>
                  <input
                    type="text"
                    value={username}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
                    placeholder="เลือกหน่วยบริการก่อน"
                  />
                </Field> */}

                {/* Password */}
                {/* <Field label="รหัสผ่าน" icon={Lock}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                    placeholder="กรอกรหัสผ่าน"
                    disabled={!selectedUser}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </Field> */}

                {/* Submit */}
                {/* <button
                  type="button"
                  onClick={trySubmit}
                  disabled={isSubmitDisabled}
                  aria-disabled={isSubmitDisabled}
                  className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                    isSubmitDisabled ? disabledBtn : activeBtn
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      กำลังเข้าสู่ระบบ...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      เข้าสู่ระบบ <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </button> */}

                {/* Divider */}
                {/* <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span>หรือ</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div> */}

                {/* Guest */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Heart className="w-5 h-5 text-emerald-600 mr-2" />
                    <h3 className="font-semibold text-emerald-800">สำหรับผู้เยี่ยมชม</h3>
                  </div>
                  <p className="text-emerald-700 text-sm mb-3">เข้าใช้งานได้เลยโดยไม่ต้องลงทะเบียน</p>
                  <button
                    type="button"
                    onClick={handleGuest}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-300 ${activeBtn}`}
                  >
                    เข้าใช้งานในฐานะ Guest
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /Form */}
        </div>
      </div>
    </div>
  );
};
function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        {children}
      </div>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
        <CheckCircle className="w-3.5 h-3.5 text-white" />
      </div>
      <p className="text-white/95">{text}</p>
    </div>
  );
}

function Badge({ children, tone = "solid" }) {
  const base = "px-2 py-1 rounded-md text-xs";
  const cls =
    tone === "muted"
      ? "bg-gray-100 text-gray-700"
      : "bg-emerald-100 text-emerald-700";
  return <span className={`${base} ${cls}`}>{children}</span>;
}
export default LoginThemed;
