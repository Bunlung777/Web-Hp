import React, { forwardRef } from "react";
import { CheckCircle, AlertCircle } from "lucide-react"; // ใช้ Icon เดิมของคุณได้เลย

const PrintTemplate = forwardRef(({ data1, data2 }, ref) => {
  return (
    // กำหนดขนาด A4 คร่าวๆ และใช้สีขาว/ดำเป็นหลักเพื่อการพิมพ์ที่คมชัด
    <div ref={ref} className="w-full bg-white text-black p-10 font-sans mx-auto max-w-[210mm]">
      
      {/* Header เอกสาร */}
      <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold mb-2">รายงานผลการคัดกรองธาลัสซีเมีย</h1>
        <p className="text-gray-600">วันที่พิมพ์: {new Date().toLocaleDateString('th-TH')}</p>
      </div>

      {/* เปลี่ยนจาก grid เป็น flex col เพื่อเรียงบน-ล่าง */}
      <div className="flex flex-col gap-6">
        
        {/* ================= ส่วนบน: ผลเลือดหญิงตั้งครรภ์ ================= */}
        <div className="border border-gray-300 rounded-lg p-5 break-inside-avoid">
          <h2 className="text-xl font-bold border-b border-gray-200 pb-2 mb-4 text-emerald-700">
            1. ผลเลือดหญิงตั้งครรภ์
          </h2>
          
          <div className="flex gap-8 mb-4">
            <p><span className="font-semibold text-gray-600">MCV:</span> {data1?.mcv || "-"} fL</p>
            <p><span className="font-semibold text-gray-600">MCH:</span> {data1?.mch || "-"} pg</p>
            <p><span className="font-semibold text-gray-600">DCIP:</span> <span className="uppercase">{data1?.dcip || "-"}</span></p>
          </div>

          {data1?.result && (
            <div className="bg-emerald-50/50 p-4 rounded-md border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                {data1.result.type === 'normal' ? <CheckCircle className="w-6 h-6 text-green-600"/> : <AlertCircle className="w-6 h-6 text-amber-600"/>}
                <h3 className="font-bold text-lg text-gray-800">{data1.result.title}</h3>
              </div>
              
              <div className="mb-4">
                <p className="font-semibold text-sm mb-2 text-gray-700">แปลผล:</p>
                <div className="bg-white p-3 rounded border border-gray-100">
                  <ul className="list-disc pl-5 text-sm space-y-1 text-gray-800">
                    {Array.isArray(data1.result.details) 
                      ? data1.result.details.map((detail, idx) => <li key={idx}>{detail}</li>)
                      : <li>{data1.result.details || data1.result.detail}</li>
                    }
                  </ul>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-2 text-gray-700">คำแนะนำ:</p>
                <p className="text-sm bg-white p-3 border border-gray-100 rounded text-gray-800">{data1.result.advice}</p>
              </div>
            </div>
          )}
        </div>

        {/* ================= ส่วนล่าง: ผลเลือดสามี ================= */}
        <div className="border border-gray-300 rounded-lg p-5 break-inside-avoid">
          <h2 className="text-xl font-bold border-b border-gray-200 pb-2 mb-4 text-cyan-700">
            2. ผลเลือดสามี
          </h2>
          
          {data2?.result ? (
            <>
              <div className="flex gap-8 mb-4">
                <p><span className="font-semibold text-gray-600">MCV:</span> {data2.mcv || "-"} fL</p>
                <p><span className="font-semibold text-gray-600">MCH:</span> {data2.mch || "-"} pg</p>
                <p><span className="font-semibold text-gray-600">DCIP:</span> <span className="uppercase">{data2.dcip || "-"}</span></p>
              </div>

              <div className="bg-cyan-50/50 p-4 rounded-md border border-cyan-100">
                <div className="flex items-center gap-2 mb-3">
                  {data2.result.type === 'normal' ? <CheckCircle className="w-6 h-6 text-green-600"/> : <AlertCircle className="w-6 h-6 text-amber-600"/>}
                  <h3 className="font-bold text-lg text-gray-800">{data2.result.title}</h3>
                </div>
                
                <div className="mb-4">
                  <p className="font-semibold text-sm mb-2 text-gray-700">แปลผล:</p>
                  <div className="bg-white p-3 rounded border border-gray-100">
                    <ul className="list-disc pl-5 text-sm space-y-1 text-gray-800">
                      {Array.isArray(data2.result.details) 
                        ? data2.result.details.map((detail, idx) => <li key={idx}>{detail}</li>)
                        : <li>{data2.result.details || data2.result.detail}</li>
                      }
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-2 text-gray-700">คำแนะนำ:</p>
                  <p className="text-sm bg-white p-3 border border-gray-100 rounded text-gray-800">{data2.result.advice}</p>
                </div>
              </div>
            </>
          ) : (
             <div className="text-gray-400 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
               ยังไม่มีการประเมินผลเลือดสามี
             </div>
          )}
        </div>

      </div>

    </div>
  );
});

export default PrintTemplate;