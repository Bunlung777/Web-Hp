// src/components/DistrictHospitalSelect.jsx
import React, { useMemo } from "react";

// วิธีที่ 1 (ทั่วไปกับ Vite/CRA/Next):
import hospitalsByDistrict from "./hospitals-by-district.json";

// ถ้าโปรเจกต์คุณต้องการ ESM assertion ค่อยเปลี่ยนเป็นแบบนี้แทน (อย่างใดอย่างหนึ่งเท่านั้น)
// import hospitalsByDistrict from "../data/hospitals-by-district.json" assert { type: "json" };

export default function DistrictHospitalSelect({ value, onChange, disabled }) {
  // value รูปแบบ: { district: "", hospitalCode: "", hospitalName: "" }

  // รายชื่ออำเภอ (เรียงตามตัวอักษรไทย)
  const districts = useMemo(
    () => Object.keys(hospitalsByDistrict).sort((a, b) => a.localeCompare(b, "th-TH")),
    []
  );

  // ตัวเลือกโรงพยาบาลตามอำเภอที่เลือก
  const hospitalOptions = useMemo(() => {
    if (!value?.district) return [];
    return (hospitalsByDistrict[value.district] || []).slice().sort((a, b) =>
      a.name.localeCompare(b.name, "th-TH")
    );
  }, [value?.district]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* อำเภอ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">อำเภอ</label>
        <select
          value={value?.district || ""}
          onChange={(e) =>
            onChange({ district: e.target.value, hospitalCode: "", hospitalName: "" })
          }
          disabled={disabled}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
        >
          <option value="">-- เลือกอำเภอ --</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* โรงพยาบาล */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">หน่วยบริการ / โรงพยาบาล</label>
        <select
          value={value?.hospitalCode || ""}
          onChange={(e) => {
            const sel = hospitalOptions.find((x) => x.code === e.target.value);
            onChange({
              district: value?.district || "",
              hospitalCode: sel?.code || "",
              hospitalName: sel?.name || "",
            });
          }}
          disabled={disabled || !value?.district}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
        >
          <option value="">
            {value?.district ? "-- เลือกหน่วยบริการ --" : "กรุณาเลือกอำเภอก่อน"}
          </option>
          {hospitalOptions.map((h) => (
            <option key={h.code} value={h.code}>
              {h.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
