import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Heart, Shield, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Login (themed) + Top Alert
 * - ธีมเดียวกับหน้าอื่น ๆ: การ์ดขาว/มุมโค้ง, เฮดเดอร์ไล่เฉด teal→cyan, ปุ่มหลัก emerald→green
 * - เพิ่มแถบแจ้งเตือนด้านบนของหน้าจอ (success/error) พร้อม auto-dismiss
 * - ปุ่ม/อินพุต disabled ดูจางและกดไม่ได้จริง ๆ
 */

const hospitals = [
  { id: 'hospital1', name: 'โรงพยาบาลอุดรธานี' },
  { id: 'hospital2', name: 'โรงพยาบาลมหาราชนครราชสีมา' },
  { id: 'hospital3', name: 'โรงพยาบาลศรีนครินทร์' },
  { id: 'hospital4', name: 'โรงพยาบาลขอนแก่น' },
  { id: 'hospital5', name: 'โรงพยาบาลลำปาง' },
  { id: 'hospital6', name: 'โรงพยาบาลสุรินทร์' },
  { id: 'hospital7', name: 'โรงพยาบาลบุรีรัมย์' },
  { id: 'hospital8', name: 'โรงพยาบาลร้อยเอ็ด' },
];

const LoginThemed = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', userType: '', hospital: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Top alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' }); // success | error
  const dismissTimer = useRef(null);
  const showAlert = (msg, type = 'success', timeout = 2500) => {
    setAlert({ show: true, message: msg, type });
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (timeout) {
      dismissTimer.current = setTimeout(() => setAlert((a) => ({ ...a, show: false })), timeout);
    }
  };
  useEffect(() => () => { if (dismissTimer.current) clearTimeout(dismissTimer.current); }, []);

  // Utilities: classes และ flags
  const disabledBtn =
    'bg-gradient-to-r from-gray-300 to-gray-300 text-white shadow-none cursor-not-allowed pointer-events-none';
  const activeBtn =
    'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';

  const isDoctorOrNurse = formData.userType === 'doctor' || formData.userType === 'nurse';
  const isFormComplete = isDoctorOrNurse && formData.username && formData.password && formData.hospital;
  const isSubmitDisabled = isLoading || !isFormComplete;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


// ...ภายใน handleSubmit (แพทย์/พยาบาล)
const handleSubmit = async () => {
  // ตรวจข้อมูลตามเดิม...
  await new Promise((r) => setTimeout(r, 700)); // mock API
  const hospitalName = hospitals.find((h) => h.id === formData.hospital)?.name || '';
  const okMsg = `เข้าสู่ระบบในฐานะ${formData.userType === 'doctor' ? 'แพทย์' : 'พยาบาล'} จาก${hospitalName} สำเร็จ!`;

  // ไปหน้า Blood พร้อมส่ง toast
  navigate('/ThalassemiaScreening', {
    state: {
      toast: { type: 'success', message: okMsg , timeout: 2000 }
    },
    replace: true, // กันกด Back แล้ว toast ยิงซ้ำจากหน้า Login
  });
};

// ...ภายใน handleGuestLogin (Guest)
const handleGuestLogin = () => {
  const okMsg = 'เข้าสู่ระบบในฐานะ Guest สำเร็จ! สามารถใช้งานระบบตรวจคัดกรองได้เลย';
  navigate('/ThalassemiaScreening', {
    state: {
      toast: { type: 'success', message: okMsg }
    },
    replace: true,
  });
};
  
  return (
    <div className="font-kanit min-h-screen bg-white flex items-center justify-center px-4">
      {/* Top Alert Bar */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
        <div
          className={[
            'mt-3 w-full max-w-xl rounded-xl border p-3 shadow-lg transition-all duration-300 pointer-events-auto',
            alert.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4',
            alert.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800',
          ].join(' ')}
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
      </div>

      <div className="w-full max-w-md">
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full mb-4 shadow-xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">ระบบตรวจคัดกรองธาลัสซีเมีย</h1>
          <p className="text-gray-600 text-sm sm:text-base">เข้าสู่ระบบเพื่อใช้งาน</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-center">
            <h2 className="text-xl font-bold text-white flex items-center justify-center">
              <Shield className="w-6 h-6 mr-2" /> เข้าสู่ระบบ
            </h2>
          </div>

          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทผู้ใช้</label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                >
                  <option value="">เลือกประเภทผู้ใช้</option>
                  <option value="doctor">แพทย์</option>
                  <option value="nurse">พยาบาล</option>
                </select>
              </div>

              {/* Hospital */}
              {isDoctorOrNurse && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">โรงพยาบาล</label>
                  <select
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                  >
                    <option value="">-- เลือกโรงพยาบาล --</option>
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Username */}
              {isDoctorOrNurse && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อผู้ใช้</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                      placeholder="กรอกชื่อผู้ใช้"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              {isDoctorOrNurse && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80"
                      placeholder="กรอกรหัสผ่าน"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember + Forgot */}
              {isDoctorOrNurse && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                    <span className="ml-2 text-gray-600">จดจำการเข้าสู่ระบบ</span>
                  </label>
                  <button type="button" className="text-emerald-700 hover:underline">ลืมรหัสผ่าน?</button>
                </div>
              )}

              {/* Submit / Main CTA */}
              {!formData.userType ? (
                <button
                  type="button"
                  disabled
                  aria-disabled
                  className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${disabledBtn}`}
                >
                  เข้าสู่ระบบ
                </button>
              ) : isDoctorOrNurse ? (
                <button
                  type="button"
                  onClick={handleSubmit}
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
                    `เข้าสู่ระบบในฐานะ${formData.userType === 'doctor' ? 'แพทย์' : 'พยาบาล'}`
                  )}
                </button>
              ) : null}

              {/* Divider */}
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <div className="flex-1 h-px bg-gray-200" />
                <span>หรือ</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Guest Quick Access */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 text-emerald-600 mr-2" />
                  <h3 className="font-semibold text-emerald-800">สำหรับผู้เยี่ยมชม</h3>
                </div>
                <p className="text-emerald-700 text-sm mb-3">เข้าใช้งานได้เลยโดยไม่ต้องลงทะเบียน</p>
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-300 ${activeBtn}`}
                >
                  เข้าใช้งานในฐานะ Guest
                </button>
              </div>

              {/* Message (ในการ์ด) */}
              {/* {message && (
                <div className="p-3 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-sm">
                  {message}
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* small footer */}
        <div className="py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} — All rights reserved.</div>
      </div>
    </div>
  );
};

export default LoginThemed;
