import React, { useState } from 'react';
import { CheckCircle, AlertCircle, FileText, Activity } from 'lucide-react';
import Lru from './Img/colormag-logolru-11.png';
import Hp from './Img/loeih-logo_.png';
import Dr from './Img/image 1.png';
import { useNavigate } from 'react-router-dom';
// ชนิดข้อมูลที่ใช้ภายในไฟล์นี้ (ไม่จำเป็นต้องเป็น TypeScript ก็ได้ แต่ช่วยอธิบายในโค้ด)
/**
 * screeningRules: รายการผล HPLC/ผลคัดกรองที่เป็นไปได้
 * combinations: กฎจับคู่ผล หญิงตั้งครรภ์_สามี -> ระดับความเสี่ยง/คำแนะนำ
 */

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
    label: 'EF (Hb E 40-80%, F 20-60%)',
    description: 'β⁰-thalassemia/Hb E or HPFH/HbE',
  },
  EF_homozygous: {
    label: 'EF/EF (Hb E ≥ 75%, F ≥ 5%)',
    description: 'Suspected Homozygous β-thalassemia/Hb E',
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
      'ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)\nไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  EA_low_EA_high: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice:
      'ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)\nไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  EA_high_EA_low: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice:
      'ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)\nไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  EE_EA_high: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice:
      'ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)\nไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },
  EA_high_EE: {
    risk: 'no_risk',
    details:
      'ทารกในครรภ์ไม่มีความเสี่ยงในการเกิดโรคเลือดจางธาลัสซีเมียชนิดรุนแรง',
    advice:
      'ส่งพบแพทย์เพื่อให้คำแนะนำทางพันธุศาสตร์ (genetic counseling)\nไม่มีความจำเป็นต้องตรวจเพิ่มเติม',
  },

  // ความเสี่ยงสูง
  A2A_low_A2A_low: {
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
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β0 -thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β0 -thalassemia or α -thalassemia 1',
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
      'ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด β0 -thalassemia/Hb E',
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β0 -thalassemia',
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
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β0 -thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α -thalassemia 1 β0 -thalassemia',
  },
  EF_homozygous_EF_homozygous: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β0 -thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α -thalassemia 1 β0 -thalassemia',
  },
  EF_EF_homozygous: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β0 -thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา α -thalassemia 1 β0 -thalassemia',
  },
  EA_low_A2A_low: {
    risk: 'high_risk',
    details:
      'ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด β⁰-thalassemia/Hb E',
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา β⁰-thalassemia',
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
        "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด -Hb Bart's hydrops fetalis - β0 -thalassemia/Hb E",
        "- β0 -thalassemia/Hb E"
      ],
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติม ระดับ ดีเอ็นเอ (DNA analysis)เพื่อค้นหา β0 -thalassemia orα -thalassemia 1',
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
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰-thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1, β⁰-thalassemia',
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
      'ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด - Hb Barts hydrops fetalis- β0 -thalassemia/Hb E- Homozygous β -thalassemia',
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1, β⁰-thalassemia',
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

  // A2A_high + EE → Hb Bart’s และ/หรือ β0-thal/HbE
  A2A_high_EE: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰-thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา β⁰-thalassemia หรือ α-thalassemia 1',
  },

  // EF + EE → Hb Bart’s และ β0-thal/HbE
  EF_EE: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰-thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1, β⁰-thalassemia',
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
  HbH_EA_high: {
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
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1, β⁰-thalassemia',
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
  HbH_Cs_EA_high: {
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
  HbH_Cs_EF: {
    risk: 'high_risk',
    details:
      "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด\n- Hb Bart's hydrops fetalis\n- β⁰-thalassemia/Hb E",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1, β⁰-thalassemia',
  },
  HbH_Cs_HbH_Cs: {
    risk: 'high_risk',
    details: "ทารกในครรภ์อาจมีความเสี่ยงที่จะเกิด Hb Bart's hydrops fetalis",
    advice:
      'ส่งตรวจวิเคราะห์เพิ่มเติมระดับ ดีเอ็นเอ (DNA analysis) เพื่อค้นหา α-thalassemia 1',
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


const Blood = () => {
  const navigate = useNavigate();
  const [pregnantWomanHb, setPregnantWomanHb] = useState('');
  const [husbandHb, setHusbandHb] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = () => {
    if (!pregnantWomanHb || !husbandHb) {
      alert('กรุณาเลือกผลการตรวจของทั้งสองคน');
      return;
    }
    const screening = getScreeningResult(pregnantWomanHb, husbandHb);
    setResult({
      woman: screeningRules[pregnantWomanHb],
      husband: screeningRules[husbandHb],
      screening,
    });
  };

  const handleReset = () => {
    setPregnantWomanHb('');
    setHusbandHb('');
    setResult(null);
  };

  const riskUI = result ? getRiskUI(result.screening.risk) : null;

  return (
    <div className="font-kanit mx-auto bg-white px-4 sm:px-6 lg:px-10 py-4 sm:py-6 max-w-[1600px]">
      {/* Header */}
      <div>
        {/* Mobile */}
        <div className="flex flex-col sm:hidden mb-6 border-b border-gray-300 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <img src={Hp} className="w-32 h-auto" alt="HP Logo" />
            <img src={Lru} className="w-[120px] h-auto rounded" alt="LRU Mark" />
          </div>
          <h1 className="text-lg font-bold text-gray-800 text-center">
            การตรวจคัดกรองธาลัสซีเมียในหญิงตั้งครรภ์
          </h1>
        </div>
        {/* Desktop/Tablet */}
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
            <h3 className="font-semibold text-lg sm:text-xl lg:text-[25px] mb-2">ระดับที่ 2 </h3>
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
        </div>
      </div>

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
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
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

          {/* Reset Button */}
          <div className="text-center mt-8 mb-12">
            <button
              onClick={handleReset}
              className="w-[300px] bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              เริ่มใหม่
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blood;
