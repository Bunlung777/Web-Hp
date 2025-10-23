import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle , FileText , Activity,X} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Lru from './Img/colormag-logolru-11.png';
import Hp from './Img/loeih-logo_.png';
import Dr from './Img/image 1.png';
import People from './Img/peole.png';
import Napat from './Img/0001 (3).jpg'
import Supailin from './Img/Supailin.jpg'
import Doctor from './Img/Doctor.jpg'
import Te1 from './Img/Te1.jpg'
import Te2 from './Img/Te2.jpg'
import Navbar from './Navbar';
import Footer from './Footer';
import { initializeApp, getApps, getApp } from "firebase/app";
import { doc, collection, addDoc, updateDoc, increment, serverTimestamp,getFirestore } from "firebase/firestore";

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

const ThalassemiaScreening = () => {
  const [step1MCV, setStep1MCV] = useState('');
  const [step1MCH, setStep1MCH] = useState('');
  const [step1DCIP, setStep1DCIP] = useState('');
  const [step2MCV, setStep2MCV] = useState('');
  const [step2MCH, setStep2MCH] = useState('');
  const [step2DCIP, setStep2DCIP] = useState('');
  const [step1Result, setStep1Result] = useState(null); 
  const [step2Result, setStep2Result] = useState(null); 
  const [showNextForm, setShowNextForm] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const alertTimer = useRef(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' }); // 'success' | 'error'
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
      console.log("✅ รับข้อมูล user:", location.state.user);
    }
  }, [location.state]);


  const showAlert = (message, type = 'success', timeout = 500) => {
    setAlert({ show: true, message, type });
    if (alertTimer.current) clearTimeout(alertTimer.current);
    if (timeout) {
      alertTimer.current = setTimeout(
        () => setAlert(a => ({ ...a, show: false })),
        timeout
      );
    }
  };

useEffect(() => { 
    const toast = location.state?.toast;
    if (toast?.message) {
      showAlert(toast.message, toast.type || 'success', toast.timeout ?? 2000);
      navigate('.', { replace: true, state: {} });
    }
    return () => {
      if (alertTimer.current) clearTimeout(alertTimer.current);
    };
  }, [location.state, navigate]);

async function saveStep1(user, form, result) {
  if (!user?.id) return;

  const userRef = doc(db, "User", user.id);
  const sessionRef = await addDoc(collection(userRef, "TestResults"), {
    status: result.type === "normal" ? "normal_only" : "awaiting_partner",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    patient: {
      MCV: Number(form.MCV),
      MCH: Number(form.MCH),
      DCIP: String(form.DCIP || "").toLowerCase(), // normalize
      result, // {type,title,details[],advice}
    },
  });

  // จดจำ session
  setSessionId(sessionRef.id);
  try { localStorage.setItem("lastSessionId", sessionRef.id); } catch {}

  // นับกดปุ่ม
  await updateDoc(userRef, { CountPress: increment(1) });

  return sessionRef.id;
}

const getStep1Result = async () => {
  const mcv = parseFloat(step1MCV);
  const mch = parseFloat(step1MCH);
  const dcip = String(step1DCIP || "").toLowerCase();

  let result = null;

  if (mcv >= 80 && mch >= 27 && dcip === "negative") {
    result = {
      type: 'normal',
      title: 'ปกติ - ไม่เสี่ยงต่อธาลัสซีเมีย',
      details: ['ไม่เป็นธาลัสซีเมีย หรือ ไม่เป็นธาลัสซีเมียชนิดรุนแรง'],
      advice: 'ไม่จำเป็นต้องตรวจเพิ่มเติม และไม่มีความจำเป็นต้องทราบผลตรวจคัดกรองธาลัสซีเมียของสามี'
    };
    setShowNextForm(false);
  } else if ((mcv < 80 || mch < 27) && dcip === "negative") {
    result = {
      type: 'unnormal',
      title: 'มีความเสี่ยงต่อธาลัสซีเมีย',
      details: [
        '- อาจมี α thalassemia และหรือ β -thalassemia โดย α thalassemia มีโอกาสเป็นได้ทั้ง α -thalassemia 1 และ α -thalassemia 2',
        '- ส่วน β –thalassemia มีโอกาสเป็นได้ทั้ง  β⁰ -thalassemia และ β⁺ -thalassemia',
        '- ไม่มี Hb E'
      ],
      advice: 'พิจารณาผลเลือดของสามี'
    };
    setShowNextForm(true);
  } else if (mcv >= 80 && mch >= 27 && dcip === "positive") {
    result = {
      type: 'unnormal',
      title: 'มีความเสี่ยงต่อธาลัสซีเมีย',
      details: [
        '- ไม่มี α thalassemia และหรือ β -thalassemia',
        '- มี Hb E'
      ],
      advice: 'พิจารณาผลเลือดของสามี'
    };
    setShowNextForm(true);
  } else if ((mcv < 80 || mch < 27) && dcip === "positive") {
    result = {
      type: 'unnormal',
      title: 'มีความเสี่ยงต่อธาลัสซีเมีย',
      details: [
        '- อาจมี α thalassemia และหรือ β -thalassemia โดย α thalassemia มีโอกาสเป็นได้ทั้ง α -thalassemia 1 และ α -thalassemia 2',
        '- ส่วน β –thalassemia มีโอกาสเป็นได้ทั้ง  β⁰ -thalassemia และ β⁺ -thalassemia',
        '- มี Hb E'
      ],
      advice: 'พิจารณาผลเลือดของสามี'
    };
    setShowNextForm(true);
  } else {
    setStep1Result(null);
    setShowNextForm(false);
    return;
  }

  // เซฟผลและเริ่ม session
  setStep1Result(result);
  await saveStep1(
    user,
    { MCV: step1MCV, MCH: step1MCH, DCIP: dcip },
    result
  );
};

async function saveStep2(user, sessionId, form, result, finalSummary) {
  if (!user?.id || !sessionId) return;

  const sessionDoc = doc(db, "User", user.id, "TestResults", sessionId);
  await updateDoc(sessionDoc, {
    status: "completed",
    updatedAt: serverTimestamp(),
    partner: {
      MCV: Number(form.MCV),
      MCH: Number(form.MCH),
      DCIP: String(form.DCIP || "").toLowerCase(),
      result,
    },
    finalSummary: finalSummary || result,
  });
}


const getStep2Result = async () => {
  const mcv = parseFloat(step2MCV);
  const mch = parseFloat(step2MCH);
  const dcip = String(step2DCIP || "").toLowerCase();

  let result = null;

  if (mcv >= 80 && mch >= 27 && dcip === "negative") {
    result = {
      type: 'normal',
      title: 'ปกติ - ไม่เสี่ยงต่อธาลัสซีเมีย',
      details: [
        '- สามีไม่เป็นธาลัสซีเมีย หรือ ไม่เป็นธาลัสซีเมียชนิดรุนแรง ',
        '- ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'
      ],
      advice: 'ไม่มีความจำเป็นต้องตรวจเพิ่มเติม'
    };
  } else if ((mcv < 80 || mch < 27) && dcip === "negative") {
    result = {
      type: 'unnormal',
      title: 'มีความเสี่ยงต่อธาลัสซีเมีย',
      details: [
        '- ผลเลือดของสามีอาจมี α thalassemia และหรือ β -thalassemia  โดย α thalassemia มีโอกาสเป็นได้ทั้ง α -thalassemia 1 และ α -thalassemia 2 ',
        '- ส่วน β -thalassemiaมีโอกาสเป็นได้ทั้ง  β⁰ -thalassemia และ β⁺ -thalassemia',
        '- สามีไม่มี Hb E',
        '- ทารกในครรภ์มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'
      ],
      advice: 'ส่งตรวจ Hb typing เพิ่มเติมทั้งหญิงตั้งครรภ์และสามีหญิงตั้งครรภ์'
    };
  } else if (mcv >= 80 && mch >= 27 && dcip === "positive") {
    result = {
      type: 'unnormal',
      title: 'มีความเสี่ยงต่อธาลัสซีเมีย',
      details: [
        '- สามีไม่มี α thalassemia และ β -thalassemia แต่มี Hb E',
        '- ทารกในครรภ์มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'
      ],
      advice: 'ส่งตรวจ Hb typing เพิ่มเติมทั้งหญิงตั้งครรภ์และสามีหญิงตั้งครรภ์'
    };
  } else if ((mcv < 80 || mch < 27) && dcip === "positive") {
    result = {
      type: 'unnormal',
      title: 'มีความเสี่ยงต่อธาลัสซีเมีย',
      details: [
        '- ผลเลือดของสามีอาจมี α thalassemia และหรือ β -thalassemia  โดย α thalassemia มีโอกาสเป็นได้ทั้ง α -thalassemia 1 และ α -thalassemia 2',
        '- ส่วน β -thalassemiaมีโอกาสเป็นได้ทั้ง  β⁰ -thalassemia และ β⁺ -thalassemia',
        '- สามีมี Hb E',
        '- ทารกในครรภ์มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'
      ],
      advice: 'ส่งตรวจ Hb typing เพิ่มเติมทั้งหญิงตั้งครรภ์และสามีหญิงตั้งครรภ์'
    };
  } else {
    setStep2Result(null);
    return;
  }

  // อัปเดต UI
  setStep2Result(result);

  // หา sessionId (จาก state หรือ localStorage เผื่อรีเฟรช)
  let sid = sessionId;
  if (!sid) {
    try {
      sid = localStorage.getItem("lastSessionId") || "";
    } catch {}
  }
  if (!sid) {
    // แจ้งผู้ใช้ให้ทำ Step1 ใหม่ ถ้าไม่มี session
    showAlert?.("ไม่พบรหัสเคส กรุณาวิเคราะห์หญิงตั้งครรภ์ (Step 1) ใหม่", "error", 2500);
    return;
  }

  // สร้างสรุปสุดท้ายถ้าต้องการรวมผลสองฝั่ง (optional)
  const finalSummary = makeFinalSummary?.(step1Result, result);

  // เซฟลง Firestore
  await saveStep2(user, sid, { MCV: step2MCV, MCH: step2MCH, DCIP: dcip }, result, finalSummary);
};

function makeFinalSummary(step1, step2) {
  if (!step1 || !step2) return null;

  // ถ้าทั้งคู่ปกติ
  if (step1.type === "normal" && step2.type === "normal") {
    return {
      type: "normal",
      title: "คู่สมรสทั้งสองปกติ",
      details: ["ทั้งหญิงตั้งครรภ์และสามีไม่มีความเสี่ยงต่อธาลัสซีเมีย"],
      advice: "ไม่จำเป็นต้องตรวจเพิ่มเติม"
    };
  }

  // ถ้าฝ่ายใดฝ่ายหนึ่งเสี่ยง
  return {
    type: "unnormal",
    title: "พบความเสี่ยงต่อธาลัสซีเมีย",
    details: [
      "หญิงตั้งครรภ์หรือสามีมีผลเลือดบ่งชี้ว่ามีความเสี่ยงต่อธาลัสซีเมีย",
      "ทารกในครรภ์อาจมีความเสี่ยงต่อการเกิดโรคธาลัสซีเมียชนิดรุนแรง"
    ],
    advice: "ควรส่งตรวจ Hb typing หรือการวิเคราะห์ DNA เพิ่มเติมทั้งสองฝ่าย"
  };
}


const isStep1Disabled = step1MCV === '' || step1MCH === '' || !step1DCIP;
const disabledBtn = 'bg-gradient-to-r from-gray-300 to-gray-300 text-white shadow-none cursor-not-allowed pointer-events-none';
const activeBtn   = 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
const isStep2Disabled = step2MCV === '' || step2MCH === '' || !step2DCIP;
  return (
 <div className="font-kanit bg-white max-w-full">
        <Navbar user={user}/> 
        {/* <div className="bg-emerald-50 text-emerald-800 text-center py-2 font-semibold border-b border-emerald-200">
  คุณกำลังอยู่ใน <span className="text-emerald-600">ระดับที่ 1</span>
</div> */}
  <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
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
           onClick={() => setAlert(a => ({ ...a, show: false }))}
           className="ml-auto rounded p-1 hover:bg-black/5"
           aria-label="ปิดแจ้งเตือน"
         >
           <X className="w-4 h-4" />
         </button>
       </div>
     </div>
    </div>
  {/* Header */}
    {/* <div className="">
      <div className="flex flex-col sm:hidden mb-6 border-b border-gray-300 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <img src={Hp} className="w-32 h-auto" alt="HP Logo" />
          <img src={Lru} className="w-[120px] h-auto rounded" alt="LRU Mark" />
        </div>
        <h1 className="text-lg font-bold text-gray-800 text-center">
          การตรวจคัดกรองธาลัสซีเมียในหญิงตั้งครรภ์
        </h1>
      </div>
      <div className="hidden sm:flex flex-row items-center justify-between mb-12 border-b border-gray-300 pb-4">
        <img src={Hp} className="w-40 lg:w-[170px] h-auto" alt="HP Logo" />
        <h1 className="text-2xl lg:text-[32px] font-bold text-gray-800 text-center flex-1 px-2">
          การตรวจคัดกรองธาลัสซีเมียในหญิงตั้งครรภ์
        </h1>
        <img src={Lru} className="w-[170px] h-auto rounded" alt="LRU Mark" />
      </div>
      </div> */}

 {/* Disease Types */}
      {/* <div className="mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 sm:p-4 rounded-lg col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-lg sm:text-xl lg:text-[25px] mb-2">ระดับที่ 1 </h3>
            <p className="text-gray-600 text-sm sm:text-base lg:text-[15px]">
              เพื่อค้นหาโรคเลือดจางธาลัสซีเมียขณะตั้งครรภ์
            </p>
          </div>
    <div className="text-center mb-12">
      <button
        onClick={() => navigate('/ThalassemiaScreening')}
        className="w-[300px] bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        ระดับที่ 1 
      </button>
          </div>
    <div className="text-center mb-12">
      <button
        onClick={() => navigate('/Blood')}
        className="w-[300px] bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
          ระดับที่ 2
      </button>
    </div>
    <div className="text-center mb-12">
      <button
        onClick={() => navigate('/Admin')}
        className="w-[300px] bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
          Admin
      </button>
    </div>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg lg:text-[20px] mb-1">2. Homozygous β-thalassemia</h3>
            <p className="text-xs sm:text-sm text-gray-600">โรคเลือดจางชนิดรุนแรง</p>
          </div>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg lg:text-[20px] mb-1">3. β⁰-thalassemia/Hb E</h3>
            <p className="text-xs sm:text-sm text-gray-600">โรคเลือดจางชนิดรุนแรง</p>
          </div>
        </div>
      </div> */}

  {/* Step 1 */}
<div className="p-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-12">
        {/* Step 1 Form */}
 <div className="bg-white/90 rounded-3xl border border-white/40 shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-500 to-cyan-600">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-xl sm:text-2xl flex items-center gap-3">
                  <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-white/20 font-bold">
                    1
                  </span>
                  ผลเลือดหญิงตั้งครรภ์
                </h2>
                {/* Progress small */}
                <div className="hidden sm:flex items-center gap-1 text-white/80 text-xs">
                  <div className="w-16 h-1 bg-white/40 rounded-full">
                    <div
                      className={`h-1 rounded-full ${
                        step1Result ? "w-16 bg-white" : "w-8 bg-white"
                      }`}
                    />
                  </div>
                  {step1Result ? "กรอกครบ" : "กำลังกรอก"}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="hidden lg:block shrink-0">
                  <img src={Dr} className="w-28 h-28 object-contain" alt="doctor" />
                </div>

                <div className="flex-1 space-y-4">
                  {/* MCV */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MCV</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        step="0.1"
                        value={step1MCV}
                        onChange={(e) => setStep1MCV(e.target.value)}
                        placeholder="กรอกค่า MCV"
                        className="w-full h-12 rounded-xl border border-gray-300 bg-white/80 px-4 pr-16 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">fL</span>
                    </div>
                  </div>

                  {/* MCH */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MCH</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        step="0.1"
                        value={step1MCH}
                        onChange={(e) => setStep1MCH(e.target.value)}
                        placeholder="กรอกค่า MCH"
                        className="w-full h-12 rounded-xl border border-gray-300 bg-white/80 px-4 pr-16 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">pg</span>
                    </div>
                  </div>

                  {/* DCIP segmented */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">DCIP Test Result</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setStep1DCIP("negative")}
                        className={`h-11 rounded-xl border transition flex items-center justify-center gap-2 ${
                          step1DCIP === "negative"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-300 hover:border-emerald-300"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" /> Negative
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep1DCIP("positive")}
                        className={`h-11 rounded-xl border transition flex items-center justify-center gap-2 ${
                          step1DCIP === "positive"
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-gray-300 hover:border-amber-300"
                        }`}
                      >
                        <AlertCircle className="w-4 h-4" /> Positive
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={getStep1Result}
                    disabled={isStep1Disabled}
                    className={`w-full h-12 rounded-2xl font-semibold transition ${isStep1Disabled ? disabledBtn : activeBtn}`}
                  >
                    วิเคราะห์ผลหญิงตั้งครรภ์
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Step 1 Result */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              ผลการวิเคราะห์หญิงตั้งครรภ์
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8">
            {step1Result ? (
              <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-500 ${
                step1Result.type === 'normal' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
                  : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
              }`}>
                {/* Result Header */}
                <div className="flex items-start sm:items-center mb-4 gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step1Result.type === 'normal' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {step1Result.type === 'normal' ? 
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" /> : 
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    }
                  </div>
                  <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 leading-tight">
                    {step1Result.title}
                  </h3>
                </div>
                
                {/* Details Section */}
                <div className="mb-4">
                  <p className="font-semibold text-base sm:text-lg text-gray-800 mb-2">แปลผล:</p>
                  <div className="space-y-2">
                    {step1Result.details.map((detail, index) => (
                      <div key={index} className={`text-sm sm:text-base text-gray-700 pl-3 sm:pl-4 border-l-4 p-2 sm:p-3 rounded-lg ${
                        step1Result.type === 'normal' 
                          ? 'border-green-300 bg-white' 
                          : 'border-yellow-300 bg-white'
                      }`}>
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Advice Section */}
                <div>
                  <p className="font-semibold text-base sm:text-lg text-gray-800 mb-2">คำแนะนำ:</p>
                  <div className={`text-sm sm:text-base text-gray-700 pl-3 sm:pl-4 border-l-4 p-2 sm:p-3 rounded-lg ${
                    step1Result.type === 'normal' 
                      ? 'border-green-300 bg-white' 
                      : 'border-yellow-300 bg-white'
                  }`}>
                    {step1Result.advice}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 sm:py-12 lg:py-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <p className="text-sm sm:text-base lg:text-lg px-4">
                  กรุณาใส่ค่าผลเลือดเพื่อดูผลการวิเคราะห์
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  {/* Step 2 */}
  {showNextForm && (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-12">
        {/* Step 2 Form */}
 <div className="bg-white/90 rounded-3xl border border-white/40 shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-500 to-cyan-600">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-xl sm:text-2xl flex items-center gap-3">
                  <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-white/20 font-bold">
                    2
                  </span>
                  ผลเลือดสามี
                </h2>
                {/* Progress small */}
                <div className="hidden sm:flex items-center gap-1 text-white/80 text-xs">
                  <div className="w-16 h-1 bg-white/40 rounded-full">
                    <div
                      className={`h-1 rounded-full ${
                        step2Result ? "w-16 bg-white" : "w-8 bg-white"
                      }`}
                    />
                  </div>
                  {step2Result ? "กรอกครบ" : "กำลังกรอก"}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="hidden lg:block shrink-0">
                  <img src={Dr} className="w-28 h-28 object-contain" alt="doctor" />
                </div>

                <div className="flex-1 space-y-4">
                  {/* MCV */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MCV</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        step="0.1"
                        value={step2MCV}
                        onChange={(e) => setStep2MCV(e.target.value)}
                        placeholder="กรอกค่า MCV"
                        className="w-full h-12 rounded-xl border border-gray-300 bg-white/80 px-4 pr-16 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">fL</span>
                    </div>
                  </div>

                  {/* MCH */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MCH</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        step="0.1"
                        value={step2MCH}
                        onChange={(e) => setStep2MCH(e.target.value)}
                        placeholder="กรอกค่า MCH"
                        className="w-full h-12 rounded-xl border border-gray-300 bg-white/80 px-4 pr-16 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">pg</span>
                    </div>
                  </div>

                  {/* DCIP segmented */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">DCIP Test Result</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setStep2DCIP("negative")}
                        className={`h-11 rounded-xl border transition flex items-center justify-center gap-2 ${
                          step2DCIP === "negative"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-300 hover:border-emerald-300"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" /> Negative
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep2DCIP("positive")}
                        className={`h-11 rounded-xl border transition flex items-center justify-center gap-2 ${
                          step2DCIP === "positive"
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-gray-300 hover:border-amber-300"
                        }`}
                      >
                        <AlertCircle className="w-4 h-4" /> Positive
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={getStep2Result}
                    disabled={isStep2Disabled}
                    className={`w-full h-12 rounded-2xl font-semibold transition ${isStep2Disabled ? disabledBtn : activeBtn}`}
                  >
                    วิเคราะห์ผลสามี
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Step 2 Result */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              ผลการวิเคราะห์สุดท้าย
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8">
            {step2Result ? (
              <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-500 ${
                step2Result.type === 'normal' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
                  : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
              }`}>
                {/* Result Header */}
                <div className="flex items-start sm:items-center mb-4 gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step2Result.type === 'normal' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {step2Result.type === 'normal' ? 
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" /> : 
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    }
                  </div>
                  <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 leading-tight">
                    {step2Result.title}
                  </h3>
                </div>
                
                {/* Details Section */}
                <div className="mb-4">
                  <p className="font-semibold text-base sm:text-lg text-gray-800 mb-2">แปลผล:</p>
                  <div className="space-y-2">
                    {step2Result.details.map((detail, index) => (
                      <div key={index} className={`text-sm sm:text-base text-gray-700 pl-3 sm:pl-4 border-l-4 p-2 sm:p-3 rounded-lg ${
                        step2Result.type === 'normal' 
                          ? 'border-green-300 bg-white' 
                          : 'border-yellow-300 bg-white'
                      }`}>
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Advice Section */}
                <div>
                  <p className="font-semibold text-base sm:text-lg text-gray-800 mb-2">คำแนะนำ:</p>
                  <div className={`text-sm sm:text-base text-gray-700 pl-3 sm:pl-4 border-l-4 p-2 sm:p-3 rounded-lg ${
                    step2Result.type === 'normal' 
                      ? 'border-green-300 bg-white' 
                      : 'border-yellow-300 bg-white'
                  }`}>
                    {step2Result.advice}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 sm:py-12 lg:py-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <p className="text-sm sm:text-base lg:text-lg px-4">
                  กรุณาใส่ค่าผลเลือดเพื่อดูผลการวิเคราะห์
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
    {/* Next Button */}
{step2Result ? (
  <div>
    <div className="text-center mb-12">
      <button
        onClick={() => navigate('/Blood')}
        className="w-[300px] bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        ขั้นตอนต่อไป
      </button>
    </div>
  </div>
) : null}
  {/* Reset Button */}
  <div className="text-center mb-12">
    <button
              onClick={() => {
          setStep1MCV('');
          setStep1MCH('');
          setStep1DCIP('เลือกผล DCIP');
          setStep2MCV('');
          setStep2MCH('');
          setStep2DCIP('เลือกผล DCIP');
          setStep1Result(null);        
          setStep2Result(null);     
          setShowNextForm(false);  
        }}
      className="w-[300px] bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      เริ่มใหม่
    </button>
  </div>

        {/* Reference Guide */}
 <div className="flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden w-full max-w-6xl">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center flex items-center justify-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            คู่มืออ้างอิง
          </h2>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            
            {/* ค่าอ้างอิง Section */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6 rounded-2xl border border-blue-200">
              <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 text-gray-800 flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <Activity className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                ค่าอ้างอิง
              </h3>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="flex items-center p-2 sm:p-3 bg-white/50 rounded-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span className="break-words">MCV ปกติ: ≥ 80 fL</span>
                </div>
                <div className="flex items-center p-2 sm:p-3 bg-white/50 rounded-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span className="break-words">MCH ปกติ: ≥ 27 pg</span>
                </div>
                <div className="flex items-center p-2 sm:p-3 bg-white/50 rounded-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span className="break-words">DCIP NEGATIVE: ไม่มี Hb E</span>
                </div>
                <div className="flex items-center p-2 sm:p-3 bg-white/50 rounded-lg">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span className="break-words">DCIP POSITIVE: มี Hb E</span>
                </div>
              </div>
            </div>
            
            {/* การแปลผล Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 rounded-2xl border border-green-200">
              <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 text-gray-800 flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                การแปลผล
              </h3>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="flex items-center p-2 sm:p-3 bg-white/50 rounded-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span className="break-words">ไม่เสี่ยง: ไม่จำเป็นตรวจเพิ่มเติม</span>
                </div>
                <div className="flex items-center p-2 sm:p-3 bg-white/50 rounded-lg">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span className="break-words">เสี่ยง: ส่งตรวจ Hb typing</span>
                </div>
                <div className="flex items-center p-2 sm:p-3 bg-white/50 rounded-lg">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span className="break-words">α-thalassemia: มีดา 1 และ 2</span>
                </div>
                <div className="flex items-center p-2 sm:p-3 bg-white/50 rounded-lg">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                  <span className="break-words">β-thalassemia: β⁰ และ β⁺</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
<Footer/>


</div>
  );
};

export default ThalassemiaScreening;
