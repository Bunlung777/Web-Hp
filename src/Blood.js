import React, { useState,useEffect,useRef } from 'react';
import { CheckCircle, AlertCircle, FileText, Activity } from 'lucide-react';
import Lru from './Img/colormag-logolru-11.png';
import Hp from './Img/loeih-logo_.png';
import Dr from './Img/image 1.png';
import { useNavigate,useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import People from './Img/peole.png';
import Footer from './Footer';
// --- Firebase ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, updateDoc,addDoc,increment,serverTimestamp } from "firebase/firestore";
import { useReactToPrint } from 'react-to-print';
// ถ้ามี firebaseConfig อยู่ไฟล์อื่น ให้ import มาแทนบรรทัดนี้
// import { firebaseConfig } from "@/firebaseConfig";
const screeningRules = {
  A2A_low: {
    label: 'A₂A (Hb A₂ ≤ 3.5%)',
    description: 'suspected α-thalassemia',
  },
  A2A_high: {
    label: 'A₂A (Hb A₂ 3.6-8%)',
    description: 'β-thalassemia trait with or without α-thalassemia',
  },
  EA_high: {
    label: 'EA (Hb E ≥ 25%)',
    description: 'Hb E trait',
  },
  EA_low: {
    label: 'EA (Hb E < 25%)',
    description: 'Suspected Hb E trait with or without α-thalassemia',
  },
  EE: {
    label: 'EE (Hb E ≥ 80%)',
    description: 'Homozygous Hb E with or without α-thalassemia',
  },
  HbH: {
    label: "A₂AH or A₂A Bart'sH",
    description: 'Hb H disease',
  },
  HbH_Cs: {
    label: "CsA₂AH or CsA₂A Bart'sH",
    description: 'Hb H-Cs disease',
  },
  EF: {
    label: 'EF (Hb E ≥ 40-80%, F ≥ 20-60%)',
    description: 'β⁰ -thalassemia /Hb E or HPFH/HbE or (&β⁰ )\n –thalassemia/Hb E with or without α-thalassemia',
  },
  EF_homozygous: {
    label: 'EE/EF (Hb E ≥ 75%, F ≥ 5%)',
    description: 'Suspected Homozygous β –thalassemia/ Hb E with or without α- thalassemia ',
  },
};

const combinations = {
  // ไม่มีความเสี่ยง
  A2A_low_EA_high: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice: 'ไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  EA_high_A2A_low: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice:
      'ไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  EA_high_EA_high: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice:
      'ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)\n- ไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  EA_low_EA_high: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice:
      'ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)\n- ไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  EA_high_EA_low: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice:
      'ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)\n- ไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  EE_EA_high: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice:
      'ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)\n- ไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  EA_high_EE: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
      advice: `ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)
      - ไม่มีความจำเป็นต้องตรวจเพิ่มเติม`,
  },
      EA_high_HbH: {
      risk: 'no_risk',
      details: `ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง`,
      advice: `ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)
      - ไม่มีความจำเป็นต้องตรวจเพิ่มเติม`,
    },
    EA_high_HbH_Cs: {
      risk: 'no_risk',
      details: `ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง`,
      advice: `ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)
      - ไม่มีความจำเป็นต้องตรวจเพิ่มเติม`,
    },
    EA_high_A2A_low: {
      risk: 'no_risk',
      details: `ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง`,
      advice: `- ไม่มีความจำเป็นต้องตรวจเพิ่มเติม`,
    },
    EA_high_A2A_high: {
      risk: 'no_risk',
      details: `ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง`,
      advice: `- ไม่มีความจำเป็นต้องตรวจเพิ่มเติม`,
    },
    EA_high_EA_high: {
      risk: 'no_risk',
      details: `ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง`,
      advice: `ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)
      - ไม่มีความจำเป็นต้องตรวจเพิ่มเติม`,
    },
    EA_low_EA_high: {
      risk: 'no_risk',
      details: `ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง`,
      advice: `ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)
      - ไม่มีความจำเป็นต้องตรวจเพิ่มเติม`,
    },
  HbH_EA_high: {
      risk: 'no_risk',
      details: `ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง`,
      advice: `ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)
      \n- ไม่มีความจำเป็นต้องตรวจเพิ่มเติม`,
  },
    HbH_Cs_EA_high: {
      risk: 'no_risk',
      details: `ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง`,
      advice: `ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)
      - ไม่มีความจำเป็นต้องตรวจเพิ่มเติม`,
  },

  // ความเสี่ยงสูง
    HbH_Cs_EF_homozygous: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  HbH_EF_homozygous: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
    EF_homozygous_A2A_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  EF_homozygous_A2A_high: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰ -thalassemia/Hb E \n- Homozygousβ -thalassemia ",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α -thalassemia 1 และ β⁰ -thalassemia',
  },
    EF_homozygous_EA_high: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด β⁰ -thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β⁰ -thalassemia',
  },
  EF_homozygous_EA_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰ -thalassemia/Hb E ",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α -thalassemia 1 และ β⁰ -thalassemia',
  },
  A2A_low_A2A_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
    A2A_low_HbH: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  A2A_low_HbH_Cs: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  A2A_low_EA_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  A2A_low_A2A_high: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  A2A_high_A2A_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  A2A_high_A2A_high: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- Homozygous β-thalassemia",
    advice:
      'ส่งพบแพทย์พิจารณาเจาะน้ำคร่ำเพื่อวินิจฉัยทารกในครรภ์ (amniocentesis)',
  },
  A2A_high_EA_high: {
    risk: 'high_risk',
    details:
      'ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด β⁰-thalassemia/Hb E',
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา β⁰-thalassemia',
  },
  A2A_low_EA_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
    A2A_high_EA_low: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰ -thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β⁰ -thalassemia or α -thalassemia 1',
  },
  EA_high_A2A_high: {
    risk: 'high_risk',
    details:
      'ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด β⁰-thalassemia/Hb E',
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา β⁰-thalassemia',
  },
  EA_low_A2A_high: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰ -thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β⁰ -thalassemia or α -thalassemia 1',
  },
  EE_EA_low: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α -thalassemia 1',
  },
  EF_homozygous_EE: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart' s hydrops fetalis\n- β⁰ -thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α -thalassemia 1 β⁰ -thalassemia',
  },
    EF_homozygous_EF_homozygous: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
    - Hb Bart's hydrops fetalis
    - β⁰-thalassemia/Hb E,
    - Homozygous β -thalassemia`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
    เพื่อค้นหา α-thalassemia 1 หรือ β⁰-thalassemia`,
    }
    ,
  EF_EF_homozygous: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰ -thalassemia/Hb E \n - Homozygous β -thalassemia ",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α -thalassemia 1 β⁰ -thalassemia',
  },
  EA_low_A2A_low: {
    risk: 'high_risk',
    details:
      `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart' s hydropsfetalis`,
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNAanalysis) เพื่อค้นหา 𝛼 -thalassemia 1',
  },
  EE_EE: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  EE_A2A_high: {
    risk: 'high_risk',
    details: [
        "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด -Hb Bart's hydrops fetalis\n - β⁰ -thalassemia/Hb E",
      ],
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β⁰ -thalassemia or α -thalassemia 1',
  },
  EE_A2A_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  HbH_HbH: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  EF_EF: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰-thalassemia/Hb E \n- Homozygous β -thalassemia",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia ',
  },
  A2A_high_EF: {
    risk: 'high_risk',
    details:
      'ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด β⁰-thalassemia/Hb E',
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา β⁰-thalassemia',
  },
  EF_A2A_high: {
    risk: 'high_risk',
    details:
      'ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด \n- Hb Barts hydrops fetalis- β⁰ \n-thalassemia/Hb E- Homozygous β -thalassemia',
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia',
  },
  EF_HbH_Cs: {
    risk: 'high_risk',
    details:
      'ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด - Hb Barts hydrops fetalis',
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  EF_HbH: {
    risk: 'high_risk',
    details:
      'ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด - Hb Barts hydrops fetalis',
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
    EA_high_EE: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice:
      'ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)\nไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  

  // ===== กลุ่ม "ความเสี่ยงสูง" ตามตารางเอกสาร =====
  // EA_low + EA_low → Hb Bart’s hydrops fetalis
  EA_low_EA_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },

  // EA_low + EE → Hb Bart’s
  EA_low_EE: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },

  // A2A_low + EE → Hb Bart’s
  A2A_low_EE: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },

  // A2A_high + EE → Hb Bart’s และ/หรือ β⁰-thal/HbE
  A2A_high_EE: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰-thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา β⁰-thalassemia or α-thalassemia 1',
  },

  // EF + EE → Hb Bart’s และ β⁰-thal/HbE
  EF_EE: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰-thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia',
  },

  // EF + A2A_low → ส่วนใหญ่เสี่ยง Hb Bart’s (ฝั่ง EF ในเอกสารครอบคลุม pairing กว้าง)
  EF_A2A_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },

  // A2A_low + EF (ถ้ายังไม่มี)
  A2A_low_EF: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },

  // ===== กลุ่มที่เกี่ยวกับ HbH / HbH-Cs ตามแผนภาพ (เสี่ยง Hb Bart’s) =====
  // หมายเหตุ: ทั้ง HbH และ HbH_Cs เมื่อจับคู่กับกลุ่มเสี่ยงส่วนใหญ่ให้ถือว่าเสี่ยง Hb Bart’s และส่งตรวจ DNA α-thal 1
  HbH_A2A_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  HbH_A2A_high: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  HbH_EA_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },

  HbH_EE: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  HbH_EF: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰-thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia',
  },
  HbH_HbH_Cs: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },

  HbH_Cs_A2A_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  HbH_Cs_A2A_high: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  HbH_Cs_EA_low: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  HbH_Cs_EE: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  HbH_Cs_HbH_Cs: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
  },
  EF_HbH: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #52 EF (หญิง) + EA_high (ชาย)
    EF_EA_high: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา β⁰-thalassemia`,
    },

    // #53 EF (หญิง) + EA_low (ชาย)
    EF_EA_low: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia`,
    },

    // #54 HbH_Cs (หญิง) + A2A_low (ชาย)
    HbH_Cs_A2A_low: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #55 HbH_Cs (หญิง) + EF (ชาย)
      HbH_Cs_EF: {
        risk: 'high_risk',
        details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
      - Hb Bart’s hydrops fetalis`,
        advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis) เพื่อค้นหา
      - α-thalassemia 1`,
      },

    // #56 HbH_Cs (หญิง) + HbH (ชาย)
    HbH_Cs_HbH: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งพบแพทย์พิจารณาเจาะน้ำคร่ำเพื่อวินิจฉัยทารกในครรภ์ (amniocentesis)`,
    },

    // #57 HbH_Cs (หญิง) + HbH_Cs (ชาย)
    HbH_Cs_HbH_Cs: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งพบแพทย์พิจารณาเจาะน้ำคร่ำเพื่อวินิจฉัยทารกในครรภ์ (amniocentesis)`,
    },

    // #58 A2A_low (หญิง) + EF_homozygous (ชาย)
    A2A_low_EF_homozygous: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #59 A2A_high (หญิง) + EF_homozygous (ชาย)
    A2A_high_EF_homozygous: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis
- β⁰-thalassemia/Hb E
- Homozygous β-thalassemia`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia`,
    },

    // #60 EA_high (หญิง) + EF_homozygous (ชาย)
    EA_high_EF_homozygous: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา β⁰-thalassemia`,
    },

    // #61 EA_low (หญิง) + EF_homozygous (ชาย)
    EA_low_EF_homozygous: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia`,
    },

    // #62 EE (หญิง) + EF_homozygous (ชาย)
    EE_EF_homozygous: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia`,
    },

    // #63 A2A_low (หญิง) + HbH (ชาย)
    A2A_low_HbH: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #64 A2A_high (หญิง) + HbH (ชาย)
    A2A_high_HbH: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #66 EA_low (หญิง) + HbH (ชาย)
    EA_low_HbH: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #67 EE (หญิง) + HbH (ชาย)
    EE_HbH: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #68 A2A_high (หญิง) + HbH_Cs (ชาย)
    A2A_high_HbH_Cs: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #70 EA_low (หญิง) + HbH_Cs (ชาย)
    EA_low_HbH_Cs: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #71 EE (หญิง) + HbH_Cs (ชาย)
    EE_HbH_Cs: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #72 A2A_low (หญิง) + EF (ชาย)
    A2A_low_EF: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #73 A2A_high (หญิง) + EF (ชาย)
    A2A_high_EF: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis
- β⁰-thalassemia/Hb E
- Homozygous β-thalassemia`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia`,
    },

    // #74 EA_high (หญิง) + EF (ชาย)
    EA_high_EF: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา β⁰-thalassemia`,
    },

    // #75 EA_low (หญิง) + EF (ชาย)
    EA_low_EF: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia`,
    },

    // #76 EE (หญิง) + EF (ชาย)
    EE_EF: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia`,
    },

    // #77 A2A_low (หญิง) + EF_homozygous (ชาย)
    A2A_low_EF_homozygous_2: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1`,
    },

    // #78 A2A_high (หญิง) + EF_homozygous (ชาย)
    A2A_high_EF_homozygous_2: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis
- β⁰-thalassemia/Hb E
- Homozygous β-thalassemia`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia`,
    },

    // #79 EA_high (หญิง) + EF_homozygous (ชาย)
    EA_high_EF_homozygous_2: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา β⁰-thalassemia`,
    },

    // #80 EA_low (หญิง) + EF_homozygous (ชาย)
    EA_low_EF_homozygous_2: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia`,
    },

    // #81 EE (หญิง) + EF_homozygous (ชาย)
    EE_EF_homozygous_2: {
      risk: 'high_risk',
      details: `ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด
- Hb Bart’s hydrops fetalis
- β⁰-thalassemia/Hb E`,
      advice: `ส่งตรวจวิเคราะห์เพิ่มเติมระดับดีเอ็นเอ (DNA analysis)
เพื่อค้นหา α-thalassemia 1 และ β⁰-thalassemia`,
    },
};

function getScreeningResult(womanKey, husbandKey) {
  const key = `${womanKey}_${husbandKey}`;
  return (
    combinations[key] || {
      risk: 'moderate_risk',
      details: 'ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิดโรคเลือดจางธาลัสซีเมีย',
      advice: 'แนะนำให้ปรึกษาแพทย์เพื่อประเมินความเสี่ยงเพิ่มเติม',
    }
  );
}

const RISK_MAP = {
  no_risk: {
    label: 'ไม่มีความเสี่ยง',
    wrap: 'bg-green-50 border-green-200',
    dot: 'bg-green-500',
    heading: 'text-green-800',
    bar: 'border-green-300',
  },
  high_risk: {
    label: 'ความเสี่ยงสูง',
    wrap: 'bg-red-50 border-red-200',
    dot: 'bg-red-500',
    heading: 'text-red-800',
    bar: 'border-red-300',
  },
  moderate_risk: {
    label: 'ความเสี่ยงปานกลาง',
    wrap: 'bg-yellow-50 border-yellow-200',
    dot: 'bg-yellow-500',
    heading: 'text-yellow-800',
    bar: 'border-yellow-300',
  },
};

const getRiskUI = (level) => RISK_MAP[level] || RISK_MAP.moderate_risk;


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

const Blood = () => {
  const navigate = useNavigate();
  const [pregnantWomanHb, setPregnantWomanHb] = useState('');
  const [husbandHb, setHusbandHb] = useState('');
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
      contentRef,
      documentTitle: "ผลตรวจเลือด",
    });
  useEffect(() => {
  const u = location.state?.user || JSON.parse(localStorage.getItem("user") || "null");
  setUser(u);
}, [location.state]);

const handleSubmit = async () => {
  if (!pregnantWomanHb || !husbandHb) {
    alert('กรุณาเลือกผลการตรวจของทั้งสองคน');
    return;
  }
  if (!user?.id) {
    setResult({
      woman: screeningRules[pregnantWomanHb],
      husband: screeningRules[husbandHb],
  
    });
  }

  try {
    const screening = getScreeningResult(pregnantWomanHb, husbandHb);

    setResult({
      woman: screeningRules[pregnantWomanHb],
      husband: screeningRules[husbandHb],
      screening,
    });

    await saveToTestResults2(user, pregnantWomanHb, husbandHb, screening);
    // showAlert?.("บันทึกผลระดับที่ 2 เรียบร้อย", "success");
  } catch (e) {
    console.error(e);
    // alert(`บันทึกไม่สำเร็จ: ${e.message || e}`);
  }
};



  const handleReset = () => {
    setPregnantWomanHb('');
    setHusbandHb('');
    setResult(null);
  };

  const riskUI = result ? getRiskUI(result.screening.risk) : null;
async function saveToTestResults2(user, pregnantWomanHb, husbandHb, screening) {
  if (!user?.id) throw new Error("ไม่พบข้อมูลผู้ใช้ (user.id)");

  const userRef = doc(db, "User", user.id); // ชื่อคอลเลกชันต้องตรง: "User"

  const payload = {
    type: "hbtyping",
    status: "completed",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    couple: {
      womanKey: pregnantWomanHb,
      husbandKey: husbandHb,
      woman: {
        label: screeningRules[pregnantWomanHb]?.label,
        description: screeningRules[pregnantWomanHb]?.description,
      },
      husband: {
        label: screeningRules[husbandHb]?.label,
        description: screeningRules[husbandHb]?.description,
      },
    },
    screening,
    finalSummary: {
      title:
        screening.risk === "no_risk"
          ? "ไม่มีความเสี่ยงต่อธาลัสซีเมียรุนแรง"
          : screening.risk === "high_risk"
          ? "มีความเสี่ยงสูงต่อธาลัสซีเมียรุนแรง"
          : "มีความเสี่ยงต่อธาลัสซีเมีย",
      details: Array.isArray(screening.details) ? screening.details : [screening.details],
      advice: screening.advice || "",
    },
  };

  try {
    const colRef = collection(userRef, "TestResults2");
    const docRef = await addDoc(colRef, payload);
    console.log("บันทึก TestResults2 แล้ว:", docRef.path); // e.g. User/abc123/TestResults2/xyz
  } catch (err) {
    console.error("บันทึก TestResults2 ไม่สำเร็จ:", err);
    throw err;
  }

  await updateDoc(userRef, { CountPress: increment(1) });
}




  return (
    <div className="font-kanit mx-auto bg-white">
        <Navbar /> 

      {/* Step 1 and Step 2 Forms */}
      <div className="p-4 max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-12">
          {/* Step 1 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-cyan-600 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <span className="text-white font-bold text-sm sm:text-2xl">1</span>
                </div>
                ผลเลือดหญิงตั้งครรภ์
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center lg:items-start">
                <div className="hidden lg:flex w-24 h-24 xl:w-32 xl:h-32">
                  <img src={Dr} className="w-32 h-32 object-contain" alt="Doctor" />
                </div>
                <div className="flex-1 w-full max-w-md lg:max-w-none space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เลือกผลคัดกรอง (หญิงตั้งครรภ์)
                    </label>
                    <select
                      value={pregnantWomanHb}
                      onChange={(e) => setPregnantWomanHb(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
                    >
                      <option value="">-- เลือกผลการตรวจ --</option>
                      {Object.entries(screeningRules).map(([key, rule]) => (
                        <option key={key} value={key}>
                          {rule.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {pregnantWomanHb && (
                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                      <p className="text-sm text-pink-800">
                        <strong>คำอธิบาย:</strong> {screeningRules[pregnantWomanHb]?.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <span className="text-white font-bold text-sm sm:text-2xl">2</span>
                </div>
                ผลเลือดสามี
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center lg:items-start">
                <div className="hidden lg:flex w-24 h-24 xl:w-32 xl:h-32">
                  <img src={Dr} className="w-32 h-32 object-contain" alt="Doctor" />
                </div>
                <div className="flex-1 w-full max-w-md lg:max-w-none space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เลือกผลคัดกรอง (สามี)
                    </label>
                    <select
                      value={husbandHb}
                      onChange={(e) => setHusbandHb(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">-- เลือกผลการตรวจ --</option>
                      {Object.entries(screeningRules).map(([key, rule]) => (
                        <option key={key} value={key}>
                          {rule.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {husbandHb && (
                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                      <p className="text-sm text-blue-800">
                        <strong>คำอธิบาย:</strong> {screeningRules[husbandHb]?.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
</div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleSubmit}
            disabled={!pregnantWomanHb || !husbandHb}
            className="w-full sm:w-[200px] bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
          >
            วิเคราะห์ผลลัพธ์
          </button>          
        </div>
        {/* Results Section */}
        <div ref={contentRef}>
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 p-6">
            <h2 className="text-[20px] font-bold text-white flex items-center">
              <FileText className="w-6 h-6 mr-3" />
              ผลการวิเคราะห์
            </h2>
          </div>

          <div className="p-6">
            {result ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                    <h3 className="font-semibold text-pink-800 mb-2 text-[20px]">หญิงตั้งครรภ์</h3>
                    <p className="text-sm text-pink-700 text-[16px]">{result.woman.label}</p>
                    <p className="text-xs text-pink-600 mt-1 text-[16px]">{result.woman.description}</p>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                    <h3 className="font-semibold text-blue-800 mb-2 text-[20px]">สามี</h3>
                    <p className="text-sm text-blue-700 text-[16px]">{result.husband.label}</p>
                    <p className="text-xs text-blue-600 mt-1 text-[16px]">{result.husband.description}</p>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className={`p-6 rounded-xl border-2 ${riskUI.wrap}`}>
                  {/* <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${riskUI.dot}`}>
                      {result.screening.risk === 'no_risk' ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg mb-2 mt-2 text-[20px] ${riskUI.heading}`}>
                        {riskUI.label}
                      </h3>
                    </div>
                  </div> */}

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">แปลผล:</h4>
                      <div className={`p-3 rounded-lg bg-white border-l-4 ${riskUI.bar}`}>
                        <p className="text-gray-700 whitespace-pre-line">{result.screening.details}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">คำแนะนำ:</h4>
                      <div className={`p-3 rounded-lg bg-white border-l-4 ${riskUI.bar}`}>
                        <p className="text-gray-700 whitespace-pre-line">{result.screening.advice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg">กรุณาเลือกผลการตรวจของทั้งสองคนเพื่อดูผลการวิเคราะห์</p>
              </div>
            )}
          </div>
          </div>
          </div>
          {/* Reset Button */}
          <div className="text-center mt-8 mb-12">
            <button
              onClick={handleReset}
              className="w-[300px] bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              เริ่มใหม่
            </button>
          </div>
                    <div className='text-center mb-12 px-4'>
          <button
                onClick={handlePrint}
                disabled={!pregnantWomanHb || !husbandHb}
            className="w-full sm:w-[200px] bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
              >
                Export PDF
              </button>
          </div>
      </div>
        <Footer/>
    </div>
  );
};

export default Blood;
