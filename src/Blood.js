import React, { useState } from 'react';
import { CheckCircle, AlertCircle, FileText, Activity, Heart } from 'lucide-react';
import Lru from './Img/colormag-logolru-11.png';
import Hp from './Img/loeih-logo_.png';
import Dr from './Img/image 1.png';

const Blood = () => {
  const [Step1HBa2, setStep1HBa2] = useState('');
  const [Step1HbE, setStep1HbE] = useState('');
  const [Step1HbA2E, setStep1HbA2E] = useState('');
  const [Step1HbF, setStep1HbF] = useState('');
  const [Step2HBa2, setStep2HBa2] = useState('');
  const [Step2HbE, setStep2HbE] = useState('');
  const [Step2HbA2E, setStep2HbA2E] = useState('');
  const [Step2HbF, setStep2HbF] = useState('');
  const [step1Result, setStep1Result] = useState(null); 
const [pregnantWoman, setPregnantWoman] = useState({
    hbA2: '',
    hbE: '',
    hbF: '',
    type: ''
  });

  // State for husband (Step 2)  
  const [husband, setHusband] = useState({
    hbA2: '',
    hbE: '',
    hbF: '',
    type: ''
  });
const getResult = () => {
  const womanA2 = parseFloat(pregnantWoman.hbA2);
  const husbandA2 = parseFloat(husband.hbA2);
  const womanE = parseFloat(pregnantWoman.hbE);
  const husbandE = parseFloat(husband.hbE);
  const womanF = parseFloat(pregnantWoman.hbF);
  const husbandF = parseFloat(husband.hbF);

  const cases = [
    // 1
    {
      condition: () => womanA2 <= 3.5 && husbandA2 <= 3.5,
      result: {
        type: 'risk',
        title: 'A2A (Hb A2 ≤ 3.5 %) suspected α-thalassemia + A2A (Hb A2 ≤ 3.5 %) suspected  α –thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },
    // 2
    {
      condition: () => womanA2 >= 3.6 && womanA2 <= 8 && husbandA2 <= 3.5,
      result: {
        type: 'risk',
        title: 'A2A (Hb A2 3.6-8 %)  β -thalassemia trait with or without  α -thalassemia + A2A (Hb A2 ≤ 3.5 %) suspected  α –thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },
    // 3
    {
      condition: () => womanE > 0 && womanE < 25 && husbandA2 <= 3.5,
      result: {
        type: 'risk',
        title: 'EA (Hb E < 25 %) Suspected Hb E trait with or without α- thalassemia + A2A (Hb A2 ≤ 3.5 %) suspected –thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },
    // 4
    {
      condition: () => womanE >= 80 && husbandA2 <= 3.5,
      result: {
        type: 'risk',
        title: 'EE (Hb E ≥ 80 %) Homozygous Hb E with or without α- thalassemia + A2A (Hb A2 ≤ 3.5 %) suspected –thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },
    // 5
    {
      condition: () => womanA2 <= 3.5 && husbandA2 >= 3.6 && husbandA2 <= 8,
      result: {
        type: 'risk',
        title: 'A2A (Hb A2 ≤ 3.5 %) suspected –thalassemia + A2A (Hb A2 3.6-8 %) -thalassemia trait with or without -thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },
    // 6
    {
      condition: () => womanA2 <= 3.5 && husbandE > 0 && husbandE < 25,
      result: {
        type: 'risk',
        title: 'A2A (Hb A2 ≤ 3.5 %) suspected –thalassemia + EA (Hb E < 25 %) Suspected Hb E trait with or without α- thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด -Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },
    // 7
    {
      condition: () => womanE > 0 && womanE < 25 && husbandE > 0 && husbandE < 25,
      result: {
        type: 'risk',
        title: 'EA (Hb E < 25 %) Suspected Hb E trait with or without α- thalassemia + EA (Hb E < 25 %) Suspected Hb E trait with or without α- thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด -Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },
    // 8
    {
      condition: () => womanE >= 80 && husbandE > 0 && husbandE < 25,
      result: {
        type: 'risk',
        title: 'EE (Hb E ≥ 80 %) Homozygous Hb E with or without α- thalassemia + EA (Hb E < 25 %) Suspected Hb E trait with or without α- thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด -Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },
    // 9
    {
      condition: () => womanA2 <= 3.5 && husbandE >= 80,
      result: {
        type: 'risk',
        title: 'A2A (Hb A2 ≤ 3.5 %) suspected –thalassemia + EE (Hb E ≥ 80 %) Homozygous Hb E with or without α- thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด -Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },
    // 10
    {
      condition: () => womanE > 0 && womanE < 25 && husbandE >= 80,
      result: {
        type: 'risk',
        title: 'EA (Hb E < 25 %) Suspected Hb E trait with or without α- thalassemia + EE (Hb E ≥ 80 %) Homozygous Hb E with or without α- thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },
    // 11
    {
      condition: () => womanE >= 80 && husbandE >= 80,
      result: {
        type: 'risk',
        title: 'EE (Hb E ≥ 80 %) Homozygous Hb E with or without α- thalassemia + EE (Hb E ≥ 80 %) Homozygous Hb E with or without α- thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },

    // 17 (EF woman + A2A husband ≤3.5)
    {
      condition: () =>
        womanE >= 40 && womanE <= 80 && womanF >= 20 && womanF <= 60 && husbandA2 <= 3.5,
      result: {
        type: 'risk',
        title: 'EF (Hb E ≥ 40-80 % F ≥ 20-60%) 0 -thalassemia /Hb E or HPFH /HbE or (&0) –thalassemia/ Hb E with or without α- thalassemia + A2A (Hb A2 ≤ 3.5 %) suspected –thalassemia',
        details: ["ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด - Hb Bart's hydrops fetalis"],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1'
      }
    },

    // 20
    {
      condition: () => womanE > 0 && womanE < 25 && husbandA2 >= 3.6 && husbandA2 <= 8,
      result: {
        type: 'risk',
        title: 'EA (Hb E < 25 %)Suspected Hb E trait with or without α- thalassemia + A2A (Hb A2 3.6-8 %) β -thalassemia trait with or without  α -thalassemia',
        details: [
          "-Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β0-thalassemia or α-thalassemia 1'
      }
    },
    // 21
    {
      condition: () => womanE >= 80 && husbandA2 >= 3.6 && husbandA2 <= 8,
      result: {
        type: 'risk',
        title: 'EE (Hb E ≥ 80 %)Homozygous Hb E with or without α- thalassemia + A2A (Hb A2  3.6-8 %) β -thalassemia trait with or withoutα -thalassemia',
        details: [
          "-Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β0-thalassemia or α-thalassemia 1'
      }
    },
    // 22
    {
      condition: () => womanA2 >= 3.6 && womanA2 <= 8 && husbandE > 0 && husbandE < 25,
      result: {
        type: 'risk',
        title: 'A2A (Hb A2  3.6-8 %) β -thalassemia trait with or withoutα -thalassemia + EA (Hb E < 25 %) Suspected Hb E trait with or without α- thalassemia ',
        details: [
          "-Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β0-thalassemia or α-thalassemia 1'
      }
    },
    // 23
    {
      condition: () => womanA2 >= 3.6 && womanA2 <= 8 && husbandE >= 80,
      result: {
        type: 'risk',
        title: 'A2A (Hb A2  3.6-8 %)  β -thalassemia trait with or withoutα -thalassemia + EE (Hb E ≥ 80 %) Homozygous Hb E with or without α- thalassemia ',
        details: [
          "-Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β0-thalassemia or α-thalassemia 1'
      }
    },
    // 24
    {
      condition: () => (husbandE >= 75 || husbandF >= 5) && womanE >= 80,
      result: {
        type: 'risk',
        title: 'β0-thalassemia/Hb E or HPFH/HbE or (δβ0)-thalassemia/Hb E with or without α-thalassemia + Suspected Homozygous β0-thalassemia/Hb E with or without α-thalassemia',
        details: [
          "- Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1, β0-thalassemia'
      }
    },
    // 25
    {
      condition: () =>
        (husbandE >= 75 || husbandF >= 5) && (womanE >= 75 || womanF >= 5),
      result: {
        type: 'risk',
        title: 'β0-thalassemia/Hb E or HPFH/HbE or (δβ0)-thalassemia/Hb E with or without α-thalassemia + Suspected Homozygous β0-thalassemia/Hb E with or without α-thalassemia',
        details: [
          "- Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1, β0-thalassemia'
      }
    },
    // 26
    {
      condition: () => (husbandE >= 75 || husbandF >= 5) && womanE >= 80,
      result: {
        type: 'risk',
        title: 'EF (Hb E ≥ 40-80 % F ≥ 20-60%) or 0 -thalassemia /Hb E or HPFH /HbE or (&β0)–thalassemia/Hb E with or without α- thalassemia + EF (Hb E ≥ 40-80 % F ≥ 20-60%) or β0 -thalassemia /Hb E or HPFH /HbE or (&β0 ) –thalassemia/Hb E with or without α- thalassemia ',
        details: [
          "- Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1, β0-thalassemia'
      }
    },
    // 27 (ตามโค้ดเดิมใช้ husbandF ซ้ำในฝั่งหลัง)
    {
      condition: () => (husbandE >= 75 || husbandF >= 5) && (womanE >= 80 || husbandF >= 5),
      result: {
        type: 'risk',
        title: 'EF (Hb E ≥ 40-80 % F ≥ 20-60%) or 0 -thalassemia /Hb E or HPFH /HbE or (&β0)–thalassemia/Hb E with or without α- thalassemia + EF (Hb E ≥ 40-80 % F ≥ 20-60%) or β0 -thalassemia /Hb E or HPFH /HbE or (&β0 ) –thalassemia/Hb E with or without α- thalassemia ',
        details: [
          "- Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1, β0-thalassemia'
      }
    },
    // 28
    {
      condition: () =>
        ((husbandE >= 40 && husbandE <= 80) || (husbandF >= 20 && husbandF <= 60)) &&
        ((womanE >= 40 && womanE <= 80) || (womanF >= 20 && womanF <= 60)),
      result: {
        type: 'risk',
        title: 'EF (Hb E ≥ 40-80 % F ≥ 20-60%) or 0 -thalassemia /Hb E or HPFH /HbE or (&β0)–thalassemia/Hb E with or without α- thalassemia + EF (Hb E ≥ 40-80 % F ≥ 20-60%) or β0 -thalassemia /Hb E or HPFH /HbE or (&β0 ) –thalassemia/Hb E with or without α- thalassemia ',
        details: [
          "- Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1, β0-thalassemia'
      }
    },
    // 29
    {
      condition: () =>
        ((husbandE >= 40 && husbandE <= 80) || (husbandF >= 20 && husbandF <= 60)) &&
        (womanE >= 75 || womanF >= 5),
      result: {
        type: 'risk',
        title: 'EF (Hb E ≥ 40-80 % F ≥ 20-60%)β0 -thalassemia /Hb E or HPFH /HbE or (&β0 ) –thalassemia/Hb E with or without α- thalassemia +	EF/EF (Hb E ≥ 75 % F ≥ 5 %)Suspected Homozygous β –thalassemia/ Hb E with or without α- thalassemia ',
        details: [
          "- Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1, β0-thalassemia'
      }
    },
    // 30
    {
      condition: () =>
        ((husbandE >= 40 && husbandE <= 80) || (husbandF >= 20 && husbandF <= 60)) &&
        womanE >= 80,
      result: {
        type: 'risk',
        title: 'EF (Hb E ≥ 40-80 % F ≥ 20-60%)β0 -thalassemia /Hb E or HPFH /HbE or (&β0 ) –thalassemia/Hb E with or without α- thalassemia + EE (Hb E ≥ 80 %)Homozygous Hb E with or without α- thalassemia',
        details: [
          "- Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1, β0-thalassemia'
      }
    },
    // 31
    {
      condition: () =>
        ((husbandE >= 40 && husbandE <= 80) || (husbandF >= 20 && husbandF <= 60)) &&
        (womanA2 >= 3.6 && womanA2 <= 8),
      result: {
        type: 'risk',
        title: 'EF (Hb E ≥ 40-80 % F ≥ 20-60%)  orβ0 -thalassemia /Hb E or HPFH /HbE or (&β0 ) –thalassemia/Hb E with or without α- thalassemia + A2A (Hb A2 3.6-8 %)  β -thalassemia trait with or without  α -thalassemia',
        details: [
          "- Hb Bart's hydrops fetalis",
          '- β0-thalassemia/Hb E'
        ],
        advice: 'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1, β0-thalassemia'
      }
    },

    // 32 (ชุดสีเขียว)
    {
      condition: () => husbandE >= 25 && womanE >= 25,
      result: {
        type: 'risk',
        title: 'EA (Hb E ≥ 25 %) Hb E trait + EA (Hb E ≥ 25 %) Hb E trait',
        details: ['ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'],
        advice: ['-ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์(genetic counseling)', '-ไม่มีความจำเป็นต้องตรวจเพิ่มเติม']
      }
    },
    // 33
    {
      condition: () => husbandE < 25 && womanE >= 25,
      result: {
        type: 'risk',
        title: 'EA (Hb E < 25 %) Suspected Hb E trait with or without α- thalassemia + EA (Hb E ≥ 25 %) Hb E trait',
        details: ['ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'],
        advice: ['-ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์(genetic counseling)', '-ไม่มีความจำเป็นต้องตรวจเพิ่มเติม']
      }
    },
    // 34
    {
      condition: () => husbandE >= 80 && womanE >= 25,
      result: {
        type: 'risk',
        title: 'EE (Hb E ≥ 80 %) Homozygous Hb E with or without α- thalassemia + EA (Hb E ≥ 25 %) Hb E trait',
        details: ['ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'],
        advice: ['-ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์(genetic counseling)', '-ไม่มีความจำเป็นต้องตรวจเพิ่มเติม']
      }
    },
    // 35
    {
      condition: () => husbandE >= 25 && womanE < 25,
      result: {
        type: 'risk',
        title: 'EA (Hb E ≥ 25 %) Hb E trait + EA (Hb E < 25 %) Suspected Hb E trait with or without α- thalassemia',
        details: ['ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'],
        advice: ['-ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์(genetic counseling)', '-ไม่มีความจำเป็นต้องตรวจเพิ่มเติม']
      }
    },
    // 36
    {
      condition: () => husbandE >= 25 && womanE >= 80,
      result: {
        type: 'risk',
        title: 'EA (Hb E ≥ 25 %) Hb E trait + EE (Hb E ≥ 80 %) Homozygous Hb E with or without α- thalassemia',
        details: ['ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'],
        advice: ['-ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์(genetic counseling)', '-ไม่มีความจำเป็นต้องตรวจเพิ่มเติม']
      }
    },

    // 37 (ไม่มีสี)
    {
      condition: () => husbandE >= 25 && womanE <= 3.5, // ตามโค้ดเดิมเป๊ะ
      result: {
        type: 'risk',
        title: 'EA (Hb E ≥ 25 %) Hb E trait + A2A (Hb A2 ≤ 3.5 %) suspectedα –thalassemia',
        details: ['ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'],
        advice: ['-ไม่มีความจำเป็นต้องตรวจเพิ่มเติม']
      }
    },
    // 38
    {
      condition: () => (husbandE >= 3.6 && husbandE <= 8) && (womanE >= 3.6 && womanE <= 8), // ตามเงื่อนไขเดิม
      result: {
        type: 'risk',
        title: 'A2A (Hb A2  3.6-8 %)  β -thalassemia trait with or withoutα -thalassemia + A2A (Hb A2  3.6-8 %) β -thalassemia trait with or without  α -thalassemia',
        details: [
          "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด -Hb Bart's hydrops fetalis-Homozygous β -thalassemia",
          '-Hb Bart\'s hydrops fetalis',
          '-Homozygous β -thalassemia'
        ],
        advice: ['ส่งพบแพทย์พิจารณาเจาะน้ำคร่ำเพื่อวินิจฉัยทารกในครรภ์(amniocentesis)']
      }
    },
    // 39
    {
      condition: () => husbandE >= 25 && (womanA2 >= 3.6 && womanA2 <= 8),
      result: {
        type: 'risk',
        title: 'EA (Hb E ≥ 25 %) Hb E trait + A2A (Hb A2 3.6-8 %) β -thalassemia trait with or without α-thalassemia',
        details: ['ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด β0 -thalassemia/Hb E'],
        advice: ['ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β0 -thalassemia']
      }
    },
    // 40
    {
      condition: () => husbandA2 <= 3.5 && womanE >= 25,
      result: {
        type: 'risk',
        title: 'A2A (Hb A2 ≤ 3.5 %) suspected α–thalassemia + EA (Hb E ≥ 25 %) Hb E trait',
        details: ['ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'],
        advice: ['ไม่มีความจำเป็นต้องตรวจเพิ่มเติม']
      }
    },
    // 41
    {
      condition: () => (husbandA2 >= 3.6 && husbandA2 <= 8) && womanE >= 25,
      result: {
        type: 'risk',
        title: 'A2A (Hb A2 ≤ 3.5 %) suspected α–thalassemia + EA (Hb E ≥ 25 %) Hb E trait', // คงข้อความตามเดิม
        details: ['ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด β0 -thalassemia/Hb E'],
        advice: ['ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β0 -thalassemia']
      }
    },

    // เคสปกติที่คุณมีไว้ตอนท้าย
    {
      condition: () => womanE >= 25 && womanE < 80 && husbandA2 <= 3.5,
      result: {
        type: 'normal',
        title: 'EA (Hb E >= 25 %) Hb E trait',
        details: ['ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง'],
        advice: 'ไม่มีความจำเป็นต้องตรวจเพิ่มเติม'
      }
    }
  ];

  const match = cases.find(c => c.condition());

  setStep1Result(
    match
      ? match.result
      : {
          type: 'unknown',
          title: 'ผลการวิเคราะห์ไม่อยู่ในเกณฑ์มาตรฐาน',
          details: [
            'กรุณาตรวจสอบค่าที่กรอกใหม่อีกครั้ง หรือปรึกษาแพทย์เพื่อการตรวจวินิจฉัยเพิ่มเติม'
          ],
          advice: 'ควรปรึกษาแพทย์ผู้เชี่ยวชาญเพื่อการตรวจวินิจฉัยที่แม่นยำ'
        }
  );
};



  // ฟังก์ชันสำหรับ Reset
  const resetForm = () => {
    setPregnantWoman({
      hbA2: '',
      hbE: '',
      hbF: '',
      type: ''
    });
    setHusband({
      hbA2: '',
      hbE: '',
      hbF: '',
      type: ''
    });
    setStep1Result(null);
  };

//   // ฟังก์ชันสำหรับกำหนดสีตาม risk level
//   const getRiskColor = (level) => {
//     switch(level) {
//       case 'high': return 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200';
//       case 'medium': return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200';
//       case 'low': return 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200';
//       default: return 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200';
//     }
//   };

//   const getRiskIcon = (level) => {
//     switch(level) {
//       case 'high': return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />;
//       case 'medium': return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />;
//       case 'low': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />;
//       default: return <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />;
//     }
//   };

  const getRiskIconBg = (level) => {
    switch(level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="font-kanit mx-auto bg-white px-4 sm:px-6 lg:px-10 py-4 sm:py-6 max-w-[1600px]">
      {/* Header */}
      <div className="">
        {/* Mobile Layout: Images on top row, text below */}
        <div className="flex flex-col sm:hidden mb-6 border-b border-gray-300 pb-4 space-y-4">
          {/* Top row with images */}
          <div className="flex items-center justify-between">
            <img src={Hp} className="w-32 h-auto" alt="HP Logo" />
            <img src={Lru} className="w-[120px] h-auto rounded" alt="LRU Mark" />
          </div>
          {/* Bottom row with title */}
          <h1 className="text-lg font-bold text-gray-800 text-center">
            การตรวจคัดกรองธาลัสซีเมียในหญิงตั้งครรภ์
          </h1>
        </div>

        {/* Desktop/Tablet Layout: Original horizontal layout */}
        <div className="hidden sm:flex flex-row items-center justify-between mb-12 border-b border-gray-300 pb-4">
          <img src={Hp} className="w-40 lg:w-[170px] h-auto" alt="HP Logo" />
          <h1 className="text-2xl lg:text-[32px] font-bold text-gray-800 text-center flex-1 px-2">
            การตรวจคัดกรองธาลัสซีเมียในหญิงตั้งครรภ์
          </h1>
          <img src={Lru} className="w-[170px] h-auto rounded" alt="LRU Mark" />
        </div>
      </div>

      {/* Disease Types */}
      <div className="mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 sm:p-4 rounded-lg col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-lg sm:text-xl lg:text-[25px] mb-2">วัตถุประสงค์</h3>
            <p className="text-gray-600 text-sm sm:text-base lg:text-[15px]">
              เพื่อค้นหาโรคเลือดจางธาลัสซีเมียขณะตั้งครรภ์
            </p>
          </div>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg lg:text-[20px] mb-1">1. Homozygous α1 thalassemia</h3>
            <p className="text-xs sm:text-sm text-gray-600">Hb Bart's hydrops fetalis</p>
          </div>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg lg:text-[20px] mb-1">2. Homozygous β-thalassemia</h3>
            <p className="text-xs sm:text-sm text-gray-600">โรคเลือดจางชนิดรุนแรง</p>
          </div>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg lg:text-[20px] mb-1">3. β0-thalassemia/Hb E</h3>
            <p className="text-xs sm:text-sm text-gray-600">โรคเลือดจางชนิดรุนแรง</p>
          </div>
        </div>
      </div>

      {/* Step 1 and Step 2 Forms */}
      <div className="p-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-12">
          {/* Step 1 Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-cyan-600 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <span className="text-white font-bold text-sm sm:text-2xl">1</span>
                </div>
                ผลเลือดหญิงตั้งครรภ์
              </h2>
            </div>
            
            {/* Form Content */}
            <div className="p-4 sm:p-6">
              {/* Doctor Image and Form Fields */}
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center lg:items-start">
                {/* Doctor Image - Hidden on small screens, centered on large screens */}
                <div className="hidden lg:flex w-24 h-24 xl:w-32 xl:h-32">
                  <div className="w-full h-full">
                    <img src={Dr} className="w-32 h-32 object-contain" alt="Doctor" />
                  </div>
                </div>
                
                {/* Form Fields */}
                <div className="flex-1 w-full max-w-md lg:max-w-none space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hb A2 (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={pregnantWoman.hbA2}
                      onChange={(e) => setPregnantWoman({...pregnantWoman, hbA2: e.target.value})}
                      placeholder="ใส่ค่า Hb A2"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hb E (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={pregnantWoman.hbE}
                      onChange={(e) => setPregnantWoman({...pregnantWoman, hbE: e.target.value})}
                      placeholder="ใส่ค่า Hb E"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-2 sm:mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hb F (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={pregnantWoman.hbF}
                  onChange={(e) => setPregnantWoman({...pregnantWoman, hbF: e.target.value})}
                  placeholder="ใส่ค่า Hb F"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                ผลเลือดสามี
              </h2>
            </div>
               
            {/* Form Content */}
            <div className="p-4 sm:p-6">
              {/* Doctor Image and Form Fields */}
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center lg:items-start">
                {/* Doctor Image - Hidden on small screens, centered on large screens */}
                <div className="hidden lg:flex w-24 h-24 xl:w-32 xl:h-32">
                  <div className="w-full h-full">
                    <img src={Dr} className="w-32 h-32 object-contain" alt="Doctor" />
                  </div>
                </div>
                
                {/* Form Fields */}
                <div className="flex-1 w-full max-w-md lg:max-w-none space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hb A2 (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={husband.hbA2}
                      onChange={(e) => setHusband({...husband, hbA2: e.target.value})}
                      placeholder="ใส่ค่า Hb A2"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hb E (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={husband.hbE}
                      onChange={(e) => setHusband({...husband, hbE: e.target.value})}
                      placeholder="ใส่ค่า Hb E"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-2 sm:mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hb F (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={husband.hbF}
                  onChange={(e) => setHusband({...husband, hbF: e.target.value})}
                  placeholder="ใส่ค่า Hb F"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-12">
          <button
            onClick={getResult}
            className="w-[300px] bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-8 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            วิเคราะห์ผลลัพธ์
          </button>
        </div>

        {/* Result */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 sm:p-6">
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
                  <p className="font-semibold text-base sm:text-lg text-gray-800 mb-2">แนวคิด:</p>
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


        {/* Reset Button */}
        <div className="text-center mt-8 mb-12">
          <button
            onClick={getResult}
            className="w-[300px] bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            เริ่มใหม่
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blood;