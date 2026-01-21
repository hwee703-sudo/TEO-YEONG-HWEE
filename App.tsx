
import React, { useState } from 'react';
import { CustomerInfo, AdvisorInfo, AppState, ProductSlot } from './types';
import { FIXED_MEDICAL_CARD, STEPS } from './constants';
import Step1CustomerInfo from './components/Step1CustomerInfo';
import StepProductSelection from './components/StepProductSelection';
import StepSlotBenefits from './components/StepSlotBenefits';
import StepComparisonReport from './components/StepComparisonReport';
import { ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [customer, setCustomer] = useState<CustomerInfo>({ 
    name: '', 
    dob: { day: 1, month: 1, year: 1995 },
    age: 30 
  });

  const [selectedSlots, setSelectedSlots] = useState<ProductSlot[]>([
    { 
      name: '方案 A', 
      product: '', 
      riders: [], 
      riderSAs: {},
      lifeSA: 0, 
      ciSA: 0, 
      ciTier: '36',
      paSA: 0, 
      premium70: 0, 
      premium80: 0, 
      age1: 70, 
      age2: 80 
    }
  ]);
  
  const [advisor, setAdvisor] = useState<AdvisorInfo>({ name: '', contact: '' });

  const handleNext = () => {
    if (currentStep === 1) {
      const hasValidSlot = selectedSlots.some(s => s.product !== '');
      if (!hasValidSlot) {
        alert("请至少配置一个方案再继续。");
        return;
      }
    }
    setCurrentStep(prev => {
      const next = Math.min(prev + 1, STEPS.length - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return next;
    });
  };
  
  const handleBack = () => setCurrentStep(prev => {
    const back = Math.max(prev - 1, 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return back;
  });

  const appState: AppState = {
    customer,
    selectedSlots: selectedSlots.filter(s => s.product !== ''),
    medical: FIXED_MEDICAL_CARD,
    advisor
  };

  const isReportStep = currentStep === 3;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-blue-100 font-['Inter',sans-serif]">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none no-print">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[120px]" />
      </div>

      <header className="fixed top-[calc(1.5rem+env(safe-area-inset-top))] inset-x-4 max-w-5xl mx-auto z-50 no-print">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-3xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2.5 rounded-2xl shadow-lg">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-slate-900 leading-none">InsurePro</h1>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Report Builder</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-1.5">
              {STEPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    idx === currentStep ? 'bg-blue-600 w-8' : idx < currentStep ? 'bg-blue-200 w-3' : 'bg-slate-100 w-3'
                  }`} 
                />
              ))}
            </div>
            <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {currentStep + 1} / {STEPS.length}
            </div>
          </div>
        </div>
      </header>

      <main className={`mx-auto pt-32 relative transition-all duration-500 ${isReportStep ? 'max-w-full px-0' : 'max-w-4xl px-4'}`}>
        <div className={`${isReportStep ? 'bg-transparent' : 'bg-white/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-white/80 p-8 md:p-12'} min-h-[600px]`}>
          {currentStep === 0 && <Step1CustomerInfo data={customer} onChange={setCustomer} />}
          {currentStep === 1 && <StepProductSelection slots={selectedSlots} onChange={setSelectedSlots} />}
          {currentStep === 2 && <StepSlotBenefits slots={selectedSlots} onChange={setSelectedSlots} />}
          {currentStep === 3 && <StepComparisonReport state={appState} onAdvisorChange={setAdvisor} />}
        </div>

        <div className="fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] inset-x-4 flex justify-center no-print pointer-events-none z-[60]">
          <div className="max-w-4xl w-full flex justify-between items-center pointer-events-auto px-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${
                currentStep === 0 
                  ? 'opacity-0 cursor-default' 
                  : 'bg-white/80 backdrop-blur-xl text-slate-600 hover:bg-white shadow-xl hover:-translate-y-0.5 border border-white/50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" /> 上一步
            </button>
            
            {currentStep < STEPS.length - 1 && (
              <button
                onClick={handleNext}
                className="flex items-center gap-3 px-12 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all transform hover:-translate-y-1 active:scale-95 group"
              >
                生成报表 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
