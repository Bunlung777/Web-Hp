// src/pages/ImportHospitals.jsx
import React, { useState } from "react";
import { CheckCircle, Upload, X } from "lucide-react";
import data from "./hospitals-by-district.json"; // <-- ใช้ไฟล์ JSON ของคุณ
import { initializeApp, getApps, getApp } from "firebase/app";
import { writeBatch, doc, collection, getDocs,getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyXiH4tR_fNFxiLJX62OFo92T0f9Zv3Qw",
  authDomain: "hp-project-b5b21.firebaseapp.com",
  projectId: "hp-project-b5b21",
  storageBucket: "hp-project-b5b21.firebasestorage.app",
  messagingSenderId: "672851387793",
  appId: "1:672851387793:web:8f09499b9a68391ed6a630",
  measurementId: "G-BNV4F6E4P0",
};
const normalizeDistrict = (raw = "") => raw.replace(/^\s*อ[.\s]?/i, "").trim();
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
export default function ImportHospitals() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState("");

const handleImport = async () => {
  if (running) return;
  setRunning(true);
  setDone(0);
  setMsg("");

  try {
    // นับจำนวนทั้งหมดสำหรับ progress
    let countAll = 0;
    Object.values(data).forEach((list) => (countAll += (list || []).length));
    setTotal(countAll);

    // (ตัวเลือก) กันข้อมูลซ้ำจากรอบก่อน: อ่านผู้ใช้เดิมมาทำ Set จาก Password (code)
    const existing = await getDocs(collection(db, "User"));
    const seen = new Set(
      existing.docs.map((d) => String((d.data().Password ?? "")))
    );

    let batch = writeBatch(db);
    let inBatch = 0;
    const MAX = 450; // เผื่อ buffer ต่ำกว่า 500/commit

    for (const [districtRaw, list] of Object.entries(data)) {
      const district = normalizeDistrict(districtRaw);
      for (const item of list) {
        const { code, name } = item;
        if (!code || !name) continue;

        // ถ้าเคยเพิ่มไปแล้ว (Password เดิม) ให้ข้าม (กันซ้ำ)
        if (seen.has(String(code))) {
          countAll--;
          setDone((prev) => prev + 1);
          continue;
        }
        seen.add(String(code));

        const payload = {
          UserName: name,            // ชื่อโรงพยาบาล
          Password: String(code),    // รหัสผ่าน = code
          Address: district,         // อำเภอ (ล้าง "อ./อ." ออกแล้ว)
          Role: "เจ้าหน้าที่",
          Count: 0,
          Active: true,
        };

        // ✅ ใช้ auto-ID (สุ่ม)
        const ref = doc(collection(db, "User"));
        batch.set(ref, payload);

        inBatch++;
        countAll--;
        setDone((prev) => prev + 1);

        if (inBatch >= MAX) {
          await batch.commit();
          batch = writeBatch(db);
          inBatch = 0;
        }
      }
    }

    if (inBatch > 0) await batch.commit();
    setMsg("นำเข้าข้อมูลสำเร็จ!");
  } catch (e) {
    console.error(e);
    setMsg(`เกิดข้อผิดพลาด: ${e.message}`);
  } finally {
    setRunning(false);
  }
};

  return (
    <div className="font-kanit max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">นำเข้าข้อมูลโรงพยาบาลตามอำเภอ → Firestore</h1>

      <button
        onClick={handleImport}
        disabled={running}
        className={`w-full py-3 rounded-xl text-white font-semibold transition ${
          running
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
        }`}
      >
        {running ? "กำลังนำเข้า..." : (
          <span className="inline-flex items-center gap-2">
            <Upload className="w-5 h-5" /> เริ่มนำเข้าข้อมูล
          </span>
        )}
      </button>

      <div className="mt-4 text-sm text-gray-700">
        {running ? (
          <p>อัปโหลด: {done.toLocaleString()} รายการ</p>
        ) : total > 0 ? (
          <p>รายการทั้งหมด: {total.toLocaleString()} (อัปโหลดแล้ว {done.toLocaleString()})</p>
        ) : null}
      </div>

      {msg && (
        <div className="mt-4 p-3 rounded-xl border text-sm
        bg-emerald-50 border-emerald-200 text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{msg}</span>
            <button className="ml-auto p-1 rounded hover:bg-black/5" onClick={() => setMsg("")}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
