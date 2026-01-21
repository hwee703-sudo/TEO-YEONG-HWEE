
export interface DateOfBirth {
  day: number;
  month: number;
  year: number;
}

export interface CustomerInfo {
  name: string;
  dob: DateOfBirth;
  age: number;
}

export interface MedicalCard {
  name: string;
  plan: string;
  copayment: string;
  annual_limit: number;
  lifetime_limit: string;
  icu: string;
  remarks: string;
  benefits: string[];
  conditions: string[];
  compliance_note: string;
}

export interface AdvisorInfo {
  name: string;
  contact: string;
  photo?: string;
}

export interface AdvisorProfile extends AdvisorInfo {
  id: string;
}

// Added missing LifeProtection interface for Step3
export interface LifeProtection {
  basicSumAssured: number;
  coverageTerm: 70 | 80;
  loyaltyBonus: number;
}

// Added missing CIProtection interface for Step4
export interface CIProtection {
  tiers: ('36' | '77' | '157')[];
  totalSA: number;
  payouts: {
    severe: number;
    intermediate: number;
    early: number;
    diabetes_recovery: number;
    cancer_recovery: number;
  };
}

export interface ProductSlot {
  name: string;
  product: string;
  riders: string[];
  riderSAs: Record<string, number>;
  lifeSA: number;
  ciSA: number;
  ciTier: '36' | '77' | '157';
  paSA: number;
  premium70: number;
  premium80: number;
  age1: number;
  age2: number;
  assuredLoveOption?: '5years' | '10years';
  paMinorAccident?: boolean;
  jaundiceAmount?: number;
  paWeeklyIndemnity?: number;
  secureCoverParent?: 'Father' | 'Mother';
}

export interface AppState {
  customer: CustomerInfo;
  selectedSlots: ProductSlot[];
  medical: MedicalCard;
  advisor: AdvisorInfo;
}
