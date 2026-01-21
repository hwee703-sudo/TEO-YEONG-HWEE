
import { MedicalCard } from './types';

export const FIXED_MEDICAL_CARD: MedicalCard = {
  name: "Health Assured",
  plan: "Basic (15% Co-Pay)",
  copayment: "15% / 每年封顶最高 RM 2,500",
  annual_limit: 5000000,
  lifetime_limit: "无限 (Unlimited)",
  icu: "无限天数 (Unlimited)",
  remarks: "每年自付15%，其余由保险公司承担。理赔需符合医疗必要性。",
  benefits: [
    "住院与手术费用",
    "住院前后指定医疗费用",
    "日间手术",
    "重症监护 (ICU)",
    "指定癌症治疗",
    "指定洗肾治疗",
    "紧急意外治疗"
  ],
  conditions: [
    "一般需使用保险公司指定 Panel Hospital",
    "非紧急情况需事先获得保险公司批准",
    "理赔需符合医疗必要性原则"
  ],
  compliance_note: "本资料仅为保障结构整理摘要，并非保险合同。所有保障、定义、限制与赔付条件，以保险公司正式 Policy Wording 为最终依据。"
};

export const AVAILABLE_PRODUCTS = [
  "Everlink Signature",
  "Everlink Plus",
  "Ultimate Link",
  "Assured Link"
];

export const PRODUCT_RIDERS: Record<string, string[]> = {
  "Everlink Signature": [
    "Payor Cover",
    "Secure Cover",
    "HealthCover",
    "PA Plus",
    "AssuredLove"
  ],
  "Everlink Plus": [
    "Payor Cover",
    "Secure Cover",
    "HealthCover",
    "PA Plus",
    "AssuredLove"
  ],
  "Ultimate Link": [
    "Health Insured",
    "HealthCover",
    "HealthCover Plus",
    "PrimeCare+",
    "Personal Accident",
    "Payor Cover",
    "Secure Cover"
  ],
  "Assured Link": [
    "Health Assured",
    "HealthCover Plus",
    "PreciousCover",
    "BabyCover",
    "Personal Accident",
    "Payor Cover",
    "Secure Cover"
  ]
};

export const STEPS = [
  "客户资料",
  "方案配置",
  "保额详情",
  "保障对比"
];

/**
 * CI Rules updated per user instruction:
 * HealthCover: Severe 100%, Interm 0, Early 0
 * HealthCover Plus: Severe 100%, Interm 100%, Early 0
 * PrimeCare+: Severe 100%, Interm 100%, Early 50%
 */
export const CI_RULES: Record<string, { severe: number, intermediate: number, early: number, diabetes_recovery: number, cancer_recovery: number }> = {
  '36': { // HealthCover
    severe: 1.0,
    intermediate: 0,
    early: 0,
    diabetes_recovery: 0,
    cancer_recovery: 0
  },
  '77': { // HealthCover Plus
    severe: 1.0,
    intermediate: 1.0,
    early: 0,
    diabetes_recovery: 20000,
    cancer_recovery: 10000
  },
  '157': { // PrimeCare+
    severe: 1.0,
    intermediate: 1.0,
    early: 0.5,
    diabetes_recovery: 30000,
    cancer_recovery: 20000
  }
};
