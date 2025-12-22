
import React, { useMemo } from "react";
import hospitalsByDistrict from "./hospitals-by-district.json";
import { useEffect } from "react";

export default function DistrictHospitalSelect({ value, onChange, disabled }) {
  // value รูปแบบ: { district: "", hospitalCode: "", hospitalName: "" }
useEffect(() => {
    console.log("value changed:", value);
  }, [value]);

  // รายชื่ออำเภอ (เรียงตามตัวอักษรไทย)
  const districts = useMemo(
    () => Object.keys(hospitalsByDistrict).sort((a, b) => a.localeCompare(b, "th-TH")),
    []
  );
  
  // ตัวเลือกโรงพยาบาลตามอำเภอที่เลือก
  const  hospitalOptions = useMemo(() => {
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
  value={value?.hospitalName || ""}
  onChange={(e) => {
    onChange({
      district: value?.district || "",
      hospitalCode: "",
      hospitalName: e.target.value,
    });
  }}
  disabled={disabled || !value?.district}
>
  <option value="">
    {value?.district ? "-- เลือกหน่วยบริการ --" : "กรุณาเลือกอำเภอก่อน"}
  </option>

  {hospitalOptions.map((h) => (
    <option key={h.code} value={h.name}>
      {h.name}
    </option>
  ))}
</select>

      </div>
    </div>
  );
}
