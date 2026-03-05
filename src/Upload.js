import React, { useState } from "react";
import { CheckCircle, Upload, X, RefreshCw } from "lucide-react";
import data from "./hospitals-by-district.json";
import { initializeApp, getApps, getApp } from "firebase/app";
import { writeBatch, doc, collection, getDocs, getFirestore } from "firebase/firestore";
import bcrypt from "bcryptjs";

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

const ImportHospitals = () => {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState("");

  // ✅ ฟังก์ชันเดิม: นำเข้าข้อมูลใหม่ (พร้อม Hash)
  const handleImport = async () => {
    if (running) return;
    setRunning(true);
    setDone(0);
    setMsg("");

    try {
      let countAll = 0;
      Object.values(data).forEach((list) => (countAll += (list || []).length));
      setTotal(countAll);

      const existing = await getDocs(collection(db, "User"));
      const seen = new Set(existing.docs.map((d) => String(d.data().UserName ?? ""))); // เปลี่ยนเป็นเช็คจาก UserName แทนจะชัวร์กว่าครับ

      let batch = writeBatch(db);
      let inBatch = 0;
      const MAX = 450;

      for (const [districtRaw, list] of Object.entries(data)) {
        const district = normalizeDistrict(districtRaw);
        for (const item of list) {
          const { code, name } = item;
          if (!code || !name) continue;

          if (seen.has(String(name))) {
            countAll--;
            setDone((prev) => prev + 1);
            continue;
          }
          seen.add(String(name));

          // ✅ 2. ทำการ Hash รหัสผ่าน
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(String(code), salt);

          const payload = {
            UserName: name,            
            Password: hashedPassword, // ✅ ใช้รหัสที่ Hash แล้ว
            Address: district,         
            Role: "เจ้าหน้าที่",
            Count: 0,
            Active: true,
          };

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
      setMsg("นำเข้าข้อมูลและ Hash รหัสผ่านสำเร็จ!");
    } catch (e) {
      console.error(e);
      setMsg(`เกิดข้อผิดพลาด: ${e.message}`);
    } finally {
      setRunning(false);
    }
  };

  // ✅ ฟังก์ชันใหม่: ดึงข้อมูลเก่าใน DB มา Hash (รันแค่ครั้งเดียวแล้วลบปุ่มทิ้งได้เลย)
  const handleMigrateOldPasswords = async () => {
    if (running) return;
    setRunning(true);
    setMsg("");
    setDone(0);

    try {
      const existing = await getDocs(collection(db, "User"));
      let batch = writeBatch(db);
      let inBatch = 0;
      let updatedCount = 0;

      for (const document of existing.docs) {
        const userData = document.data();
        const currentPassword = String(userData.Password || "");

        // เช็คว่ารหัสผ่านยังไม่ได้ Hash ใช่ไหม? (bcrypt ปกติจะขึ้นต้นด้วย $2a$ หรือ $2b$ และยาว 60 ตัว)
        if (!currentPassword.startsWith("$2a$") && currentPassword.length < 50) {
          
          const salt = bcrypt.genSaltSync(10);
          const newHashedPassword = bcrypt.hashSync(currentPassword, salt);

          const ref = doc(db, "User", document.id);
          batch.update(ref, { Password: newHashedPassword }); // อัปเดตเฉพาะฟิลด์ Password

          inBatch++;
          updatedCount++;
          setDone(updatedCount);

          if (inBatch >= 450) {
            await batch.commit();
            batch = writeBatch(db);
            inBatch = 0;
          }
        }
      }

      if (inBatch > 0) await batch.commit();
      setMsg(`แปลงรหัสผ่านเก่าสำเร็จทั้งหมด ${updatedCount} รายการ!`);

    } catch (e) {
      console.error(e);
      setMsg(`เกิดข้อผิดพลาดในการ Migrate: ${e.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="font-kanit max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">จัดการข้อมูลโรงพยาบาล (Firestore)</h1>

      <div className="space-y-3">
        {/* ปุ่ม Import เดิม */}
        <button
          onClick={handleImport}
          disabled={running}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            running
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          }`}
        >
          {running ? "กำลังทำงาน..." : (
            <span className="inline-flex items-center gap-2">
              <Upload className="w-5 h-5" /> นำเข้าข้อมูลใหม่
            </span>
          )}
        </button>

        {/* ✅ ปุ่มใหม่สำหรับแก้ข้อมูลเก่า */}
        <button
          onClick={handleMigrateOldPasswords}
          disabled={running}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            running
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          }`}
        >
          {running ? "กำลังแปลงข้อมูล..." : (
            <span className="inline-flex items-center gap-2">
              <RefreshCw className="w-5 h-5" /> แปลงรหัสผ่านเก่าให้เป็น Hash (Migrate)
            </span>
          )}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-700">
        {running ? (
          <p>ดำเนินการแล้ว: {done.toLocaleString()} รายการ</p>
        ) : null}
      </div>

      {msg && (
        <div className="mt-4 p-3 rounded-xl border text-sm bg-emerald-50 border-emerald-200 text-emerald-800">
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
};

export default ImportHospitals;