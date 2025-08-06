import React, { useState } from 'react';
import { CheckCircle, AlertCircle , FileText , Activity} from 'lucide-react';
import Lru from './Img/colormag-logolru-11.png';
import Hp from './Img/loeih-logo_.png';
import Dr from './Img/image 1.png';
const ThalassemiaScreening = () => {
  const [step1MCV, setStep1MCV] = useState('');
  const [step1MCH, setStep1MCH] = useState('');
  const [step1DCIP, setStep1DCIP] = useState('เลือกผล DCIP');
  const [step2MCV, setStep2MCV] = useState('');
  const [step2MCH, setStep2MCH] = useState('');
  const [step2DCIP, setStep2DCIP] = useState('เลือกผล DCIP');
  const [step1Result, setStep1Result] = useState(null); 
  const [step2Result, setStep2Result] = useState(null); 
const [showNextForm, setShowNextForm] = useState(false);
  const getStep1Result = () => {
    const mcv = parseFloat(step1MCV);
    const mch = parseFloat(step1MCH);
    const dcip = step1DCIP
    if (mcv >= 80 && mch >= 27 && dcip === "negative") {
      setStep1Result({
        type: 'normal',
        title: 'ปกติ - ไม่เสี่ยงต่อราลัสซีเมีย',
        details: [
          'ไม่เป็นธาลัสซีเมียรุนแรง'
        ],
        advice: 'ไม่ต้องตรวจเพิ่ม ไม่ต้องตรวจสามี'
      });
      setShowNextForm(false);
    } 
    else if ((mcv < 80 || mch < 27) && dcip === "negative"){
     setStep1Result({
        type: 'unnormal',
        title: 'มีความเสี่ยงต่อราลัสซีเมีย',
        details: [
          'อาจมี α หรือ β-thalassemia',
        ],
        advice: 'ตรวจเลือดสามีเพื่อประเมินความเสี่ยงทารก'
      }) 
      setShowNextForm(true);
    }
    else if (mcv >= 80 && mch >= 27 && dcip === "positive") {
      setStep1Result({
              type: 'normal',
              title: 'ไม่พบพาหะ',
              details: [
                'ไม่มี α หรือ β-thalassemia แต่มี Hb E',
              ],
              advice: 'ตรวจเลือดสามีเพื่อประเมินความเสี่ยงทารก'
            })
      setShowNextForm(true);
    }
    else if ((mcv < 80 || mch < 27) && dcip === "positive") {
      setStep1Result({
              type: 'normal',
              title: 'ไม่พบพาหะ',
              details: [
                'อาจมี ไม่มี α หรือ β-thalassemia แต่มี Hb E',
              ],
              advice: 'ตรวจเลือดสามีเพื่อประเมินความเสี่ยงทารก'
            })
      setShowNextForm(true);     
    }
    else {
      setStep1Result(null); // เคลียร์ผลลัพธ์ถ้าเงื่อนไขไม่ตรง
      setShowNextForm(false); // ไม่แสดงฟอร์มเพิ่ม
    }
  };

  const getStep2Result = () => {
    const mcv = parseFloat(step2MCV);
    const mch = parseFloat(step2MCH);
    const dcip = step1DCIP
    if (mcv >= 80 && mch >= 27 && dcip === "negative") {
      setStep2Result({
        type: 'normal',
        title: 'ไม่พบพาหะ',
        details: [
          'ไม่เป็นธาลัสซีเมียรุนแรง'
        ],
        advice: 'ไม่ต้องตรวจเพิ่ม'
      });
    } 
    else if ((mcv < 80 || mch < 27) && dcip === "negative"){
     setStep2Result({
        type: 'normal',
        title: 'ไม่พบพาหะ',
        details: [
          'อาจมี α หรือ β-thalassemia',
        ],
        advice: 'ส่งตรวจ Hb typing ทั้งคู่'
      }) 
    }
    else if (mcv >= 80 && mch >= 27 && dcip === "positive") {
      setStep2Result({
              type: 'normal',
              title: 'ไม่พบพาหะ',
              details: [
                'ไม่มี α หรือ β-thalassemia แต่มี Hb E',
              ],
              advice: 'ส่งตรวจ Hb typing ทั้งคู่'
            })
    }
    else if ((mcv < 80 || mch < 27) && dcip === "positive") {
      setStep2Result({
              type: 'normal',
              title: 'ไม่พบพาหะ',
              details: [
                'อาจมี ไม่มี α หรือ β-thalassemia แต่มี Hb E',
              ],
              advice: 'ส่งตรวจ Hb typing ทั้งคู่'
            })  
    }
    else {
      setStep2Result(null); 
    }
  };


  return (
 <div className="mx-auto bg-white font-kanit px-8 py-6 max-w-[1600px]">
  {/* Header */}
  <div className="flex items-center justify-between mb-12 border-b border-gray-300 pb-4">
    <img src={Hp} className="w-[170px] h-auto rounded" />
    <h1 className="text-[32px] font-bold text-gray-800 text-center flex-1">
      การตรวจคัดกรองธาลัสซีเมียในหญิงตั้งครรภ์
    </h1>
    <img src={Lru} className="w-[170px] h-auto rounded" />
  </div>

 {/* Disease Types */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg">
            <h3 className="font-semibold text-[25px]">วัตถุประสงค์</h3>
            <p className="text-gray-600 text-[17px]">เพื่อค้นหาโรคเลือดจางธาลัสซีเมียขณะตั้งครรภ์</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg h-[90px]">
            <h3 className="font-semibold text-[20px]">1. Homozygous α1 thalassemia</h3>
            <p className="text-sm text-gray-600">Hb Bart's hydrops fetalis</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg h-[90px]">
            <h3 className="font-semibold text-[20px]">2. Homozygous β-thalassemia</h3>
            <p className="text-sm text-gray-600">โรคเลือดจางชนิดรุนแรง</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg h-[90px]">
            <h3 className="font-semibold text-[20px]">3. β0-thalassemia/Hb E</h3>
            <p className="text-sm text-gray-600">โรคเลือดจางชนิดรุนแรง</p>
          </div>
        </div>
      </div>

  {/* Step 1 */}
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
    {/* Step 1 Form */}
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden h-[450px]">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">1</span>
                      </div>
                      ผลเลือดหญิงตั้งครรภ์
                    </h2>
        </div>
      <div className="flex flex-col lg:flex-row gap-6 mb-6 items-start mt-[20px] justify-center">
        <img src={Dr} className="w-32 h-32 object-contain" />
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MCV (fL)</label>
            <input
              type="number"
              value={step1MCV}
              onChange={(e) => setStep1MCV(e.target.value)}
              placeholder="ใส่ค่า MCV"
              className="w-[300px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MCH (pg)</label>
            <input
              type="number"
              value={step1MCH}
              onChange={(e) => setStep1MCH(e.target.value)}
              placeholder="ใส่ค่า MCH"
              className="w-[300px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className='ml-[170px]'>
          <label className="block text-sm font-medium text-gray-700 mb-1">DCIP Test Result</label>
          <select
            value={step1DCIP}
            onChange={(e) => setStep1DCIP(e.target.value)}
            className="w-[430px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option>เลือกผล DCIP</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </select>
        </div>
        <div className='p-4'>
          <button 
                  onClick={getStep1Result}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  วิเคราะห์ผลเลือดขั้นตอนแรก
       </button>
        </div>
         
      </div>
    </div>

    {/* Step 1 Result */}
   <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 ">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FileText className="w-6 h-6 mr-3" />
                ผลการวิเคราะห์หญิงตั้งครรภ์
              </h2>
            </div>
            
            <div className="p-8">
              {step1Result ? (
                <div className={`p-6 rounded-2xl transition-all duration-500 ${
                  step1Result.type === 'normal' 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
                    : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      step1Result.type === 'normal' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {step1Result.type === 'normal' ? 
                        <CheckCircle className="w-6 h-6 text-white" /> : 
                        <AlertCircle className="w-6 h-6 text-white" />
                      }
                    </div>
                    <h3 className="font-bold text-xl text-gray-800">{step1Result.title}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-semibold text-lg text-gray-800 mb-2">แนวคิด:</p>
                    <div className="space-y-1">
                      {step1Result.details.map((detail, index) => (
                        <p key={index} className={`text-gray-700 pl-4 border-l-[5px] border-green-300 bg-[#ffffff] p-3 rounded-lg${
                          step1Result.type === 'normal' 
                            ? 'text-gray-700 pl-4 border-l-[5px] border-green-300 bg-[#ffffff] p-3 rounded-lg' 
                            : 'text-gray-700 pl-4 border-l-[5px] border-yellow-300 bg-[#ffffff] p-3 rounded-l'
                        }`}>{detail}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-lg text-gray-800 mb-2">คำแนะนำ:</p>
                    <p className={`text-gray-700 pl-4 border-l-[5px] border-green-300 bg-[#ffffff] p-3 rounded-lg${
                          step1Result.type === 'normal' 
                            ? 'text-gray-700 pl-4 border-l-[5px] border-green-300 bg-[#ffffff] p-3 rounded-lg' 
                            : 'text-gray-700 pl-4 border-l-[5px] border-yellow-300 bg-[#ffffff] p-3 rounded-l'
                        }`}>
                          {step1Result.advice}
                      </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-16">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg">กรุณาใส่ค่าผลเลือดเพื่อดูผลการวิเคราะห์</p>
                </div>
              )}
            </div>
          </div>
        </div>

  {/* Step 2 */}
  {showNextForm && (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
      {/* Step 2 Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden h-[450px]">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold">1</span>
                      </div>
                      ผลเลือดหญิงตั้งครรภ์
                    </h2>
        </div>
      <div className="flex flex-col lg:flex-row gap-6 mb-6 items-start mt-[20px] justify-center">
        <img src={Dr} className="w-32 h-32 object-contain" />
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MCV (fL)</label>
            <input
              type="number"
              value={step2MCV}
              onChange={(e) => setStep2MCV(e.target.value)}
              placeholder="ใส่ค่า MCV"
              className="w-[300px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MCH (pg)</label>
            <input
              type="number"
              value={step2MCH}
              onChange={(e) => setStep2MCH(e.target.value)}
              placeholder="ใส่ค่า MCH"
              className="w-[300px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className='ml-[170px]'>
          <label className="block text-sm font-medium text-gray-700 mb-1">DCIP Test Result</label>
          <select
            value={step2DCIP}
            onChange={(e) => setStep2DCIP(e.target.value)}
            className="w-[430px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option>เลือกผล DCIP</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </select>
        </div>
        <div className='p-4'>
          <button 
                  onClick={getStep2Result}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  วิเคราะห์ผลเลือดขั้นตอนแรก
       </button>
        </div>
         
      </div>
    </div>

      {/* Step 2 Result */}
<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FileText className="w-6 h-6 mr-3" />
                ผลการวิเคราะห์หญิงตั้งครรภ์
              </h2>
            </div>
            
            <div className="p-8">
              {step2Result ? (
                <div className={`p-6 rounded-2xl transition-all duration-500 ${
                  step2Result.type === 'normal' 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
                    : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      step2Result.type === 'normal' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {step2Result.type === 'normal' ? 
                        <CheckCircle className="w-6 h-6 text-white" /> : 
                        <AlertCircle className="w-6 h-6 text-white" />
                      }
                    </div>
                    <h3 className="font-bold text-xl text-gray-800">{step2Result.title}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-semibold text-lg text-gray-800 mb-2">แนวคิด:</p>
                    <div className="space-y-1">
                      {step2Result.details.map((detail, index) => (
                        <p key={index} className={`text-gray-700 pl-4 border-l-[5px] border-green-300 bg-blue-50 p-3 rounded-lg${
                          step2Result.type === 'normal' 
                            ? 'text-gray-700 pl-4 border-l-[5px] border-green-300 bg-[#ffffff] p-3 rounded-lg' 
                            : 'text-gray-700 pl-4 border-l-[5px] border-yellow-300 bg-[#ffffff] p-3 rounded-l'
                        }`}>{detail}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-lg text-gray-800 mb-2">คำแนะนำ:</p>
                    <p className={`text-gray-700 pl-4 border-l-[5px] border-green-300 bg-blue-50 p-3 rounded-lg${
                          step2Result.type === 'normal' 
                            ? 'text-gray-700 pl-4 border-l-[5px] border-green-300 bg-[#ffffff] p-3 rounded-lg' 
                            : 'text-gray-700 pl-4 border-l-[5px] border-yellow-300 bg-[#ffffff] p-3 rounded-l'
                        }`}>{step2Result.advice}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-16">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg">กรุณาใส่ค่าผลเลือดเพื่อดูผลการวิเคราะห์</p>
                </div>
              )}
            </div>
          </div>
        </div>
  )}

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
      }}
      className="w-[300px] bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      เริ่มใหม่
    </button>
  </div>

        {/* Reference Guide */}
        <div className="flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden w-[1000px]">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6">
            <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center">
              <FileText className="w-6 h-6 mr-3" />
              คู่มืออ้างอิง
            </h2>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  ค่าอ้างอิง
                </h3>
                <div className="space-y-3 text-[16px]">
                  <div className="flex items-center p-3 bg-white/50 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>MCV ปกติ: ≥ 80 fL</span>
                  </div>
                  <div className="flex items-center p-3 bg-white/50 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>MCH ปกติ: ≥ 27 pg</span>
                  </div>
                  <div className="flex items-center p-3 bg-white/50 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>DCIP NEGATIVE: ไม่มี Hb E</span>
                  </div>
                  <div className="flex items-center p-3 bg-white/50 rounded-lg">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    <span>DCIP POSITIVE: มี Hb E</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  การแปลผล
                </h3>
                <div className="space-y-3 text-[16px]">
                  <div className="flex items-center p-3 bg-white/50 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span>ไม่เสี่ยง: ไม่จำเป็นตรวจเพิ่มเติม</span>
                  </div>
                  <div className="flex items-center p-3 bg-white/50 rounded-lg">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    <span>เสี่ยง: ส่งตรวจ Hb typing</span>
                  </div>
                  <div className="flex items-center p-3 bg-white/50 rounded-lg">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    <span>α-thalassemia: มีดา 1 และ 2</span>
                  </div>
                  <div className="flex items-center p-3 bg-white/50 rounded-lg">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    <span>β-thalassemia: β0 และ β+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
</div>
  );
};

export default ThalassemiaScreening;
