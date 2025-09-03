// src/pages/AdminUsers.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Search, CheckCircle, Shield, Building2 } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import DistrictHospitalSelect from "./DistrictHospitalSelect";

// --- Firebase ---
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

// ---- UI helpers / theme classes ----
const activeBtn  = "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";
const disabledBtn= "bg-gradient-to-r from-gray-300 to-gray-300 text-white shadow-none cursor-not-allowed pointer-events-none";
const dangerBtn  = "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 shadow-lg hover:shadow-xl";

const ROLES = ["Doctor", "Nurse", "Admin", "Guest"]; // ให้สะกดตรงกับที่เก็บใน Firestore
const USERS_COL = "User";

export default function AdminUsers() {
  // -------- Alert --------
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const alertTimer = useRef(null);
  const showAlert = (message, type = "success", timeout = 2200) => {
    setAlert({ show: true, message, type });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    if (timeout) alertTimer.current = setTimeout(() => setAlert((a) => ({ ...a, show: false })), timeout);
  };
  useEffect(() => () => alertTimer.current && clearTimeout(alertTimer.current), []);

  // -------- Firestore realtime data --------
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, USERS_COL), (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(rows);
    });
    return () => unsub();
  }, []);

  // -------- Search & Sort --------
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "UserName", dir: "asc" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = users.filter((u) => {
      if (!q) return true;
      return (
        String(u.UserName || "").toLowerCase().includes(q) ||
        String(u.Role || "").toLowerCase().includes(q) ||
        String(u.Address || "").toLowerCase().includes(q)
      );
    });

    const dir = sortBy.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const A = (a[sortBy.key] ?? "").toString().toLowerCase();
      const B = (b[sortBy.key] ?? "").toString().toLowerCase();
      // ให้ Count เรียงตัวเลขจริง
      if (sortBy.key === "Count") return (Number(a.Count || 0) - Number(b.Count || 0)) * dir;
      if (A < B) return -1 * dir;
      if (A > B) return 1 * dir;
      return 0;
    });
  }, [users, query, sortBy]);

  const toggleSort = (key) =>
    setSortBy((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  // -------- Modal & form --------
  const [modal, setModal] = useState({ open: false, mode: null, payload: null });
  const openAdd = () => setModal({ open: true, mode: "add", payload: null });
  const openEdit = (user) => setModal({ open: true, mode: "edit", payload: { ...user } });
  const openDelete = (user) => setModal({ open: true, mode: "delete", payload: { ...user } });
  const closeModal = () => setModal({ open: false, mode: null, payload: null });

  // ฟอร์ม: เก็บ dropdown 2 ชั้นใน `dh`
  const [form, setForm] = useState({
    Password: "",
    Role: "Doctor",
    Count: 0,
    Active: true,
    Status: "",
    dh: { district: "", hospitalCode: "", hospitalName: "" }, // Address, HospitalCode, UserName
  });

  useEffect(() => {
    if (modal.open && modal.mode === "edit" && modal.payload) {
      const u = modal.payload;
      setForm({
        Password: u.Password || "",
        Role: u.Role || "Doctor",
        Count: typeof u.Count === "number" ? u.Count : Number(u.Count || 0),
        Active: !!u.Active,
        Status: u.Status || "",
        dh: {
          district: u.Address || "",
          hospitalCode: u.HospitalCode || "",
          hospitalName: u.UserName || "",
        },
      });
    }
    if (modal.open && modal.mode === "add") {
      setForm({
        Password: "",
        Role: "Doctor",
        Count: 0,
        Active: true,
        Status: "",
        dh: { district: "", hospitalCode: "", hospitalName: "" },
      });
    }
  }, [modal]);

  const isValid =
    !!form.Password &&
    !!form.Role &&
    !!form.dh.district &&
    !!form.dh.hospitalName; // ต้องเลือกอำเภอ/โรงพยาบาลให้ครบ

  // -------- CRUD --------
  const onSave = async () => {
    if (!isValid) return showAlert("กรุณากรอกข้อมูลให้ครบถ้วน", "error");

    const payload = {
      // เก็บชื่อตาม schema ปัจจุบัน
      UserName: form.dh.hospitalName,
      Address: form.dh.district,
      HospitalCode: form.dh.hospitalCode || "", // เพิ่มไว้ใช้อนาคต (optional)
      Password: form.Password,
      Role: form.Role,
      Count: Number(form.Count) || 0,
      Active: !!form.Active,
      Status: form.Status || "",
    };

    try {
      if (modal.mode === "add") {
        await addDoc(collection(db, USERS_COL), payload);
        showAlert("เพิ่มผู้ใช้เรียบร้อย");
        closeModal();
      } else if (modal.mode === "edit" && modal.payload?.id) {
        await updateDoc(doc(db, USERS_COL, modal.payload.id), payload);
        showAlert("แก้ไขผู้ใช้เรียบร้อย");
        closeModal();
      }
    } catch (e) {
      showAlert(`เกิดข้อผิดพลาด: ${e.message}`, "error");
    }
  };

  const onDelete = async () => {
    if (modal.mode !== "delete" || !modal.payload?.id) return;
    try {
      await deleteDoc(doc(db, USERS_COL, modal.payload.id));
      showAlert("ลบผู้ใช้เรียบร้อย");
      closeModal();
    } catch (e) {
      showAlert(`เกิดข้อผิดพลาด: ${e.message}`, "error");
    }
  };

  const toggleActive = async (u) => {
    try {
      await updateDoc(doc(db, USERS_COL, u.id), { Active: !u.Active });
    } catch (e) {
      showAlert(`เปลี่ยนสถานะไม่สำเร็จ: ${e.message}`, "error");
    }
  };

  return (
    <div className="font-kanit mx-auto bg-white px-4 sm:px-6 lg:px-10 py-6 max-w-[1200px]">
      {/* Alert */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
        <div
          className={[
            "mt-3 w-full max-w-xl rounded-xl border p-3 shadow-lg transition-all duration-300 pointer-events-auto",
            alert.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
            alert.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800",
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">{alert.message}</span>
            <button type="button" onClick={() => setAlert((a) => ({ ...a, show: false }))} className="ml-auto rounded p-1 hover:bg-black/5" aria-label="close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center">
            <Shield className="w-6 h-6 mr-2" /> จัดการผู้ใช้ (Admin)
          </h1>
          <button onClick={openAdd} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${activeBtn}`}>
            <Plus className="w-5 h-5" /> เพิ่มผู้ใช้
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 sm:p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
              placeholder="ค้นหา หน่วยบริการ / บทบาท / อำเภอ"
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-4 sm:px-6 pb-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <Th sortable onClick={() => toggleSort("UserName")} active={sortBy.key === "UserName"} dir={sortBy.dir}>หน่วยบริการ</Th>
                <Th sortable onClick={() => toggleSort("Address")} active={sortBy.key === "Address"} dir={sortBy.dir}>อำเภอ</Th>
                <Th sortable onClick={() => toggleSort("Role")} active={sortBy.key === "Role"} dir={sortBy.dir}>บทบาท</Th>
                <Th>รหัสผ่าน</Th>
                <Th sortable onClick={() => toggleSort("Count")} active={sortBy.key === "Count"} dir={sortBy.dir}>จำนวนครั้ง</Th>
                <Th sortable onClick={() => toggleSort("Active")} active={sortBy.key === "Active"} dir={sortBy.dir}>สถานะ</Th>
                <Th>การจัดการ</Th>
              </tr>
            </thead>
            <tbody className="align-top">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center text-gray-500">ไม่พบผู้ใช้</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-t">
                    <Td className="font-medium text-gray-800">
                      <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" />{u.UserName}</div>
                    </Td>
                    <Td className="text-gray-700">{u.Address || "-"}</Td>
                    <Td className="text-gray-700">{u.Role || "-"}</Td>
                    <Td className="text-gray-700">{u.Password || "-"}</Td>
                    <Td className="text-gray-700">{u.Count ?? 0}</Td>
                    <Td>
                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input type="checkbox" checked={!!u.Active} onChange={() => toggleActive(u)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors relative">
                          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow" />
                        </div>
                        <span className={`ml-2 text-sm ${u.Active ? "text-emerald-700" : "text-gray-600"}`}>{u.Active ? "Active" : "Inactive"}</span>
                      </label>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 inline-flex items-center gap-1">
                          <Pencil className="w-4 h-4" /> แก้ไข
                        </button>
                        <button onClick={() => openDelete(u)} className={`px-3 py-1.5 rounded-lg inline-flex items-center gap-1 ${dangerBtn}`}>
                          <Trash2 className="w-4 h-4" /> ลบ
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4 text-white flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {modal.mode === "add" && "เพิ่มผู้ใช้"}
                {modal.mode === "edit" && "แก้ไขผู้ใช้"}
                {modal.mode === "delete" && "ยืนยันการลบ"}
              </h3>
              <button onClick={closeModal} className="rounded-lg p-1 hover:bg-white/10"><X className="w-5 h-5" /></button>
            </div>

            {modal.mode === "delete" ? (
              <div className="p-5 space-y-4">
                <p>ต้องการลบผู้ใช้ <span className="font-semibold">{modal.payload?.UserName}</span> ใช่หรือไม่?</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={closeModal} className="px-4 py-2 rounded-xl border">ยกเลิก</button>
                  <button onClick={onDelete} className={`px-4 py-2 rounded-xl ${dangerBtn}`}>ลบ</button>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Dropdown 2 ชั้น */}
                <DistrictHospitalSelect
                  value={form.dh}
                  onChange={(dh) => setForm((f) => ({ ...f, dh }))}
                />

                {/* ฟิลด์อื่น ๆ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">บทบาท (Role)</label>
                    <select
                      value={form.Role}
                      onChange={(e) => setForm((f) => ({ ...f, Role: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน (Password)</label>
                    <input
                      value={form.Password}
                      onChange={(e) => setForm((f) => ({ ...f, Password: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                      placeholder="ตั้งรหัสผ่าน"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนครั้ง (Count)</label>
                    <input
                      type="number"
                      value={form.Count}
                      onChange={(e) => setForm((f) => ({ ...f, Count: e.target.value === "" ? 0 : Number(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                      min={0}
                    />
                  </div> */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ (ข้อความ)</label>
                    <input
                      value={form.Status}
                      onChange={(e) => setForm((f) => ({ ...f, Status: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                      placeholder="เช่น ปกติ / ระงับชั่วคราว"
                    />
                  </div> */}
                </div>

                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={!!form.Active} onChange={(e) => setForm((f) => ({ ...f, Active: e.target.checked }))} />
                  <span className="text-sm">Active</span>
                </label>

                <div className="flex gap-3 justify-end pt-2">
                  <button onClick={closeModal} className="px-4 py-2 rounded-xl border">ยกเลิก</button>
                  <button onClick={onSave} disabled={!isValid} className={`px-4 py-2 rounded-xl inline-flex items-center gap-2 ${isValid ? activeBtn : disabledBtn}`}>
                    <Save className="w-4 h-4" /> บันทึก
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, sortable = false, onClick, active, dir }) {
  return (
    <th className="py-3 px-3 select-none">
      <button
        className={`inline-flex items-center gap-1 ${sortable ? "text-gray-700 hover:text-gray-900" : "text-gray-700"}`}
        onClick={onClick}
        disabled={!sortable}
      >
        <span className="font-semibold">{children}</span>
        {sortable && (
          <svg width="10" height="10" viewBox="0 0 24 24" className={`opacity-70 ${active ? "" : "opacity-20"}`}>
            {dir === "asc" ? <path d="M7 14l5-5 5 5z" fill="currentColor" /> : <path d="M7 10l5 5 5-5z" fill="currentColor" />}
          </svg>
        )}
      </button>
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`py-3 px-3 ${className}`}>{children}</td>;
}
