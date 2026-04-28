export type EligibilityAnswer = "yes" | "no" | null;

export interface EligibilityStep {
  id: string;
  question: string;
  explanation: string;
  helpText?: string;
  yesLabel?: string;
  noLabel?: string;
  disqualifyOn: "yes" | "no";
  disqualifyMessage: string;
  disqualifyDetail: string;
  warningOnly?: boolean;
}

export interface EligibilityState {
  answers: Record<string, EligibilityAnswer>;
  currentStep: number;
  completed: boolean;
  eligible: boolean | null;
  disqualifiedAt: string | null;
}

export interface CalculationInput {
  averageAnnualConsumption: number;
  leakPeriodConsumption: number;
  billingPeriodMonths: number;
  pricePerCubicMeter: number;
}

export interface CalculationResult {
  maxBillableConsumption: number;
  excessConsumption: number;
  estimatedRelief: number;
  actualConsumption: number;
  averageForPeriod: number;
}

export interface DossierFormData {
  // Abonné
  subscriberLastName: string;
  subscriberFirstName: string;
  subscriberAddress: string;
  subscriberPostalCode: string;
  subscriberCity: string;
  subscriberPhone: string;
  subscriberEmail: string;
  contractNumber: string;

  // Service des eaux
  waterCompanyName: string;
  waterCompanyAddress: string;
  waterCompanyCity: string;

  // Fuite
  leakDiscoveryDate: string;
  leakLocation: string;
  repairDate: string;
  certificateDate: string;

  // Plombier
  plumberName: string;
  plumberCompany: string;
  plumberSiret: string;

  // Consommation
  normalConsumption: string;
  abnormalConsumption: string;
  billingPeriod: string;

  // Date de la lettre
  letterDate: string;
  letterCity: string;
}
