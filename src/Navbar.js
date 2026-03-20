import React, { useState,useEffect, useRef } from 'react';
import { Menu, X, Activity, Droplet,UserCircle, LogOut, ChevronDown,LogIn,LayoutDashboard  } from 'lucide-react';
import { useNavigate, useLocation  } from 'react-router-dom';
import Hp from './Img/loeih-logo_.png';
import Lru from './Img/colormag-logolru-11.png';

const Navbar = ({ user: userProp }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfile = () => {
    setOpen(false);
    navigate("/profile", { state: { user } });
  };

  const handleLogout = () => {
    setOpen(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn")
    navigate("/login");
  };

  // ปิด dropdown เมื่อคลิกนอกพื้นที่
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // รับ user จาก prop → ถ้าไม่มี ลองจาก state → ถ้าไม่มี ลองจาก localStorage
  const [user, setUser] = useState(() => {
    if (userProp) return userProp;
    try {
      const cached = localStorage.getItem("user");
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
      try { localStorage.setItem("user", JSON.stringify(location.state.user)); } catch {}
    }
    console.log("Login",user?.UserName)
  }, [location.state?.user]);

  const steps = [
    { label: "ระดับที่ 1", icon: <Activity className="w-4 h-4" />, path: "/ThalassemiaScreening" },
    { label: "ระดับที่ 2", icon: <Droplet className="w-4 h-4" />, path: "/Blood" },
    { label: "Admin", icon: <UserCircle className="w-4 h-4" />, path: "/Admin" },
    { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, path: "/Dashboard" },
  ];
let visibleSteps;

if (user?.UserName == "โรงพยาบาลเลย") {
  visibleSteps = steps;
} else {
  visibleSteps = steps.filter(step => 
    step.label !== "Admin" && step.label !== "Dashboard"
  );
  
}

  const handleProfileClick = () => {
    navigate("/profile", {
      state: {
        user, // ส่งอ็อบเจ็กต์ผู้ใช้ไป
        level1Keys: ["UserName", "displayName", "Email", "Role", "Type"],
        level2Keys: ["Phone", "Department", "Permissions", "Address", "LastLoginAt", "createdAt", "updatedAt"],
      },
    });
  };
  const handleNavigate = (path) => {
    // ส่ง user ต่อเฉพาะ state (ไม่ขนข้อมูลผลระดับ 1)
    navigate(path, { state: { user } });
  };

let levelText = '';
if (location.pathname === '/ThalassemiaScreening') {
  levelText = 'ระดับที่ 1';
} else if (location.pathname === '/Blood') {
  levelText = 'ระดับที่ 2';
} else if (location.pathname === '/Admin') {
  levelText = 'Admin';
}
 else if (location.pathname === '/Dashborad') {
  levelText = 'Admin';
}

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-lg w-full">
<div className="flex items-center h-16 px-3 sm:px-5 lg:px-8 gap-3">

        
<div
  className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1"
  // onClick={() => navigate('/ThalassemiaScreening')}
>

            {/* โลโก้ 1 */}
            <div className="p-1 bg-white rounded-lg shadow-sm">
              <img src={Hp} alt="HP" className="h-7 sm:h-8 w-auto" />
            </div>

            {/* โลโก้ 2 */}
            <div className="p-1 bg-white rounded-lg hidden sm:flex">
              <img src={Lru} alt="LRU" className="h-7 w-auto" />
            </div>


          {/* ชื่อระบบ */}
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">

          
<span
  className="px-3 py-1 rounded-full 
             bg-white/20 backdrop-blur-sm 
             font-bold text-sm sm:text-base lg:text-lg
             border border-white/30 shadow-md 
             flex items-center gap-2 min-w-0"
>
  <button 
            onClick={() => navigate('/')}
    className="bg-gradient-to-r from-yellow-200 via-white to-cyan-100 
               bg-clip-text text-transparent 
               truncate max-w-[160px] sm:max-w-[220px] lg:max-w-none"
  >
    ThalLoei
  </button>

 {levelText && (
    <span
      className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full border ${
          levelText === 'ระดับที่ 1'
            ? 'bg-emerald-500/30 border-emerald-400 text-white'
            : levelText === 'ระดับที่ 2'
            ? 'bg-cyan-500/30 border-cyan-400 text-white'
            : 'bg-yellow-500/30 border-yellow-400 text-white'
        }`}
    >
      {levelText}
    </span>
  )}

                </span>

            </div>
          </div>
        </div>
  <div className="hidden md:flex items-center gap-3 sm:gap-4">
      {visibleSteps.map((step, i) => (
        <button
          key={i}
          onClick={() => handleNavigate(step.path)}
  className="flex items-center gap-2 px-3 py-1.5 rounded-lg   
             font-medium text-sm text-white 
             hover:bg-white/20 transition-all 
             border border-white/20 whitespace-nowrap"
        >
          {step.icon}
          {step.label}
        </button>
      ))}

      <div className="hidden md:flex items-center gap-3 sm:gap-4 relative" ref={dropdownRef}>
      {user ? (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-white/10 hover:bg-white/20 border border-white/30
                       transition-all duration-300 text-white font-medium group"
          >
            <UserCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-base">{user.UserName}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* dropdown */}
          {open && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 
                         overflow-hidden animate-fadeIn"
            >
              <button
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 flex items-center gap-2 text-gray-700 
                           hover:bg-gray-50 transition-colors"
              >
                <UserCircle className="w-4 h-4 text-cyan-600" />
                ดูโปรไฟล์ของฉัน
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 flex items-center gap-2 text-red-600 
                           hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={() => navigate('/Login')}
         className="flex items-center gap-2 px-3 py-1.5 rounded-lg   
             font-medium text-sm text-white 
             hover:bg-white/20 transition-all 
             border border-white/20 whitespace-nowrap">
            <LogIn className="w-4 h-4" />
            เข้าสู่ระบบ
              </button>
      )}
    </div>
    </div>
  
        <button
          className="md:hidden text-white hover:text-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-emerald-600 to-cyan-600 border-t border-white/20 shadow-lg">
          <div className="flex flex-col items-center py-3 space-y-3">
            <span className="text-white font-semibold text-base mb-2">
              Thalaloei Trail Version 1.0
            </span>
            {visibleSteps.map((step, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(step.path);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-[80%] justify-center py-2 rounded-xl text-white font-medium 
                           bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                {step.icon}
                {step.label}
              </button>
            ))}
                    <button 
          onClick={() => navigate('/Login')}
         className="flex items-center gap-2 w-[80%] justify-center py-2 rounded-xl text-white font-medium 
                           bg-white/10 hover:bg-white/20 transition-all duration-300">
            <LogIn className="w-4 h-4" />
            เข้าสู่ระบบ
              </button>
                            <button
                onClick={handleProfile}
                className="flex items-center gap-2 w-[80%] justify-center py-2 rounded-xl text-white font-medium 
                           bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <UserCircle className="w-4 h-4" />
                ดูโปรไฟล์ของฉัน
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
