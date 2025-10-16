import React, { useState } from 'react';
import { Menu, X, Activity, Droplet } from 'lucide-react';
import { useNavigate, useLocation  } from 'react-router-dom';
import Hp from './Img/loeih-logo_.png';
import Lru from './Img/colormag-logolru-11.png';
import People from './Img/peole.png';
import Napat from './Img/0001 (3).jpg'
import Supailin from './Img/Supailin.jpg'
import Doctor from './Img/Doctor.jpg'
import Te1 from './Img/Te1.jpg'
import Te2 from './Img/Te2.jpg'
const Footer = () => {


  return (
<>    {/* Developer Section */}
<section className="mt-20 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-12 relative overflow-hidden">
  <div className="max-w-6xl mx-auto px-6 relative z-10">
    <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-emerald-700 mb-12">
      ผู้ร่วมพัฒนาระบบ
    </h2>

    {/* 3 คนแถวบน */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {[{ name: "นายแพทย์ ทวิช ศรีเกษม", 
          role: (
            <>
              นพ.ชำนาญการพิเศษ แพทย์ผู้เชี่ยวชาญด้านสูติศาสตร์-นรีเวชวิทยา แผนกเวชกรรมสังคม 
              <br />
              โรงพยาบาลเลย
            </>
          ), 
          img: Doctor
        },
        { name: "รศ.ดร. กิตติศักดิ์ แสนประสิทธ์", role: "คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏเลย", img: Te1 },
        { name: "ผศ.ดร. คมยุทธ ไชยวงษ์", role: "คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏเลย", img: Te2 },
      ].map((dev, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-emerald-300 shadow-md bg-white flex items-center justify-center">
            <img
              src={dev.img}
              alt={dev.name}
              className="w-[80%] h-[80%] object-cover rounded-full"
            />
          </div>
          <h3 className="mt-4 text-lg font-bold text-gray-800">{dev.name}</h3>
          <p className="text-emerald-600 font-medium text-sm">{dev.role}</p>
        </div>
      ))}
    </div>

    {/* 2 คนแถวล่าง (ตรงกลาง) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-center max-w-3xl mx-auto">
      {[
        { name: "ดร.สุไพลิน พิชัย", role: "สาขาวิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏเลย", img: Supailin },
        { name: "นายณภัทร พลหอม", role: "สาขาวิชาวิทยาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏเลย", img: Napat },
      ].map((dev, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-cyan-300 shadow-md bg-white flex items-center justify-center">
            <img
              src={dev.img}
              alt={dev.name}
              className="w-[80%] h-[80%] object-cover rounded-full"
            />
          </div>
          <h3 className="mt-4 text-lg font-bold text-gray-800">{dev.name}</h3>
          <p className="text-cyan-600 font-medium text-sm">{dev.role}</p>
        </div>
      ))}
    </div>

    {/* ข้อความปิดท้าย */}
    <p className="text-center text-gray-500 mt-12 text-sm">
      © {new Date().getFullYear()} ThalLoei Trial V.1.0 — Science and Technology, Loei Rajabhat University
    </p>
  </div>

  {/* เพิ่มแสงตกแต่งพื้นหลังเบา ๆ */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-200/20 blur-[100px] rounded-full"></div>
</section></>
  );
};

export default Footer;
