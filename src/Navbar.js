import React, { useState } from 'react';
import { Menu, X, Activity, Droplet } from 'lucide-react';
import { useNavigate, useLocation  } from 'react-router-dom';
import Hp from './Img/loeih-logo_.png';
import Lru from './Img/colormag-logolru-11.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { label: 'ระดับที่ 1', icon: <Activity className="w-4 h-4" />, path: '/ThalassemiaScreening' },
    { label: 'ระดับที่ 2', icon: <Droplet className="w-4 h-4" />, path: '/Blood' },
  ];

const location = useLocation();

let levelText = '';
if (location.pathname === '/ThalassemiaScreening') {
  levelText = 'ระดับที่ 1';
} else if (location.pathname === '/Blood') {
  levelText = 'ระดับที่ 2';
} else if (location.pathname === '/Admin') {
  levelText = 'Admin';
}

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-lg w-full">
      <div className="flex justify-between items-center h-16 px-5 sm:px-7 lg:px-11">
        
        <div 
          className="flex items-center gap-3 sm:gap-4 cursor-pointer"
          onClick={() => navigate('/')}
        >
          {/* โลโก้ 1 */}
          <div className="p-1.5 bg-white rounded-xl shadow-sm">
            <img src={Hp} alt="HP" className="h-9 sm:h-8 w-auto" />
          </div>

          {/* โลโก้ 2 */}
          <div className="p-1 bg-white rounded-xl hidden sm:flex">
            <img src={Lru} alt="LRU" className="h-9 w-auto" />
          </div>

          {/* ชื่อระบบ */}
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
          
                <span
                className="px-4 py-1.5 rounded-full 
                            bg-white/20 backdrop-blur-sm 
                            font-extrabold text-lg sm:text-xl 
                            border border-white/30 shadow-md hover:bg-white/30 transition flex
                            tracking-wide"
                >
                <span
                    className="bg-gradient-to-r from-yellow-200 via-white to-cyan-100 
                            bg-clip-text text-transparent 
                            drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                >
                    ThalLoei Trial     Version 1.0
                </span>
 {levelText && (
    <span
      className={`ml-3 px-3 py-1 text-sm font-semibold rounded-full border shadow-sm ${
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

        {/* ✅ Right: Step Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3 sm:gap-4">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => navigate(step.path)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white 
                         hover:bg-white/20 transition-all duration-300 
                         border border-white/20 hover:border-white/40 hover:scale-105"
            >
              {step.icon}
              {step.label}
            </button>
          ))}
        </div>

        {/* ✅ Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ✅ Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-emerald-600 to-cyan-600 border-t border-white/20 shadow-lg">
          <div className="flex flex-col items-center py-3 space-y-3">
            <span className="text-white font-semibold text-base mb-2">
              Thalaloei Trail Version 1.0
            </span>
            {steps.map((step, i) => (
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
