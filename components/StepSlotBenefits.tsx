
import React from 'react';
import { ProductSlot } from '../types';
import { ShieldAlert, Heart, Activity, Coins, PlusCircle, CheckCircle, ShieldCheck, HeartHandshake, Zap, Stethoscope, LayoutPanelLeft, Clock, Sparkles, Users } from 'lucide-react';

interface Props {
  slots: ProductSlot[];
  onChange: (slots: ProductSlot[]) => void;
}

const StepSlotBenefits: React.FC<Props> = ({ slots, onChange }) => {
  const updateSlot = (index: number, updates: Partial<ProductSlot>) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], ...updates };
    onChange(newSlots);
  };

  const updateRiderSA = (slotIdx: number, riderName: string, sa: number) => {
    const newSlots = [...slots];
    const newRiderSAs = { ...newSlots[slotIdx].riderSAs, [riderName]: sa };
    newSlots[slotIdx] = { ...newSlots[slotIdx], riderSAs: newRiderSAs };
    onChange(newSlots);
  };

  const getRiderIcon = (rider: string) => {
    if (rider === 'AssuredLove') return <HeartHandshake className="w-5 h-5 text-pink-500" />;
    if (rider.includes('PA') || rider.includes('Accident')) return <ShieldAlert className="w-5 h-5 text-red-500" />;
    if (rider.includes('Health') || rider.includes('Cover')) return <Activity className="w-5 h-5 text-emerald-500" />;
    if (rider.includes('Payor') || rider.includes('Waiver') || rider.includes('Secure')) return <Coins className="w-5 h-5 text-amber-500" />;
    return <PlusCircle className="w-5 h-5 text-blue-500" />;
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const validSlots = slots.filter(s => s.product);
  const AGE_OPTIONS = [60, 70, 80, 90, 100];
  const JAUNDICE_OPTIONS = [500, 1000, 2000];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        .custom-input-container:focus-within {
          border-color: #2563eb;
          background-color: white;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.05);
        }
      `}</style>

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">保障保额明细</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Detailed Coverage Configuration</p>
        </div>
        <div className="bg-blue-600/5 px-4 py-2 rounded-2xl border border-blue-100 flex items-center gap-2">
          <LayoutPanelLeft className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">共 {validSlots.length} 个方案</span>
        </div>
      </div>

      <div className="space-y-12">
        {validSlots.map((slot, idx) => (
          <div 
            key={idx} 
            className="relative bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl p-1 transition-all"
          >
            {/* Slot Ribbon */}
            <div className="absolute top-0 left-8 transform -translate-y-1/2 flex items-center bg-slate-900 text-white px-5 py-2 rounded-xl shadow-lg z-10">
              <span className="w-5 h-5 bg-blue-500 rounded-md flex items-center justify-center text-[10px] font-bold mr-3">{String.fromCharCode(65 + idx)}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{slot.name}</span>
            </div>

            <div className="p-6 md:p-8 pt-10 space-y-4">
              {/* Product Info Bar */}
              <div className="bg-slate-900/5 px-6 py-3 rounded-2xl flex items-center justify-between border border-slate-900/5 mb-6">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">已选主险产品</span>
                <span className="text-xs font-black text-slate-800">{slot.product}</span>
              </div>

              {/* Benefits List */}
              <div className="space-y-3">
                {/* 1. Life Protection (Always present as primary) */}
                <div className="bg-white/80 rounded-2xl border border-slate-100 p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 border-l-4 border-l-blue-600">
                  <div className="flex items-center gap-3 w-full md:w-[280px] flex-shrink-0">
                    <div className="p-2.5 bg-blue-50 rounded-xl">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm">人寿/全残保障</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Life/TPD Sum Assured</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="custom-input-container flex items-center bg-slate-50/50 border border-slate-100 rounded-xl px-5 transition-all">
                      <span className="font-black text-slate-300 text-lg mr-2 italic">RM</span>
                      <input
                        type="number"
                        value={slot.lifeSA === 0 ? '' : slot.lifeSA}
                        onFocus={handleFocus}
                        onChange={(e) => updateSlot(idx, { lifeSA: Number(e.target.value) })}
                        className="w-full py-3.5 bg-transparent outline-none font-black text-slate-800 text-xl tracking-tight"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Riders Grid */}
                {slot.riders.map((rider) => {
                  const isFixed = ['Health Assured', 'Health Insured', 'Payor Cover', 'Secure Cover'].includes(rider);
                  const isAssuredLove = rider === 'AssuredLove';
                  const isPAPlus = rider === 'PA Plus' || rider === 'PA PLUS';
                  const isPA = rider === 'Personal Accident';
                  const isPrecious = rider === 'PreciousCover';
                  const isSecureCover = rider === 'Secure Cover';
                  const currentSA = slot.riderSAs[rider] || 0;

                  return (
                    <div 
                      key={rider} 
                      className={`bg-white/80 rounded-2xl border border-slate-100 p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 border-l-4 transition-all ${
                        isAssuredLove ? 'border-l-pink-400 bg-pink-50/10' : 
                        (isPAPlus || isPA) ? 'border-l-red-500' : 
                        isPrecious ? 'border-l-pink-500' : 
                        isSecureCover ? 'border-l-amber-500 bg-amber-50/10' : 'border-l-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full md:w-[280px] flex-shrink-0">
                        <div className="p-2.5 bg-slate-50 rounded-xl">
                          {getRiderIcon(rider)}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">{rider}</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Additional Protection</p>
                        </div>
                      </div>

                      <div className="flex-1">
                        {isAssuredLove ? (
                          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/50 rounded-xl border border-slate-100">
                            {['5years', '10years'].map(opt => (
                              <button
                                key={opt}
                                onClick={() => updateSlot(idx, { assuredLoveOption: opt as any })}
                                className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all ${
                                  slot.assuredLoveOption === opt 
                                  ? 'bg-white text-pink-600 shadow-sm border border-pink-100' 
                                  : 'text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                {opt === '5years' ? '5 Years Mode' : '10 Years Mode'}
                              </button>
                            ))}
                          </div>
                        ) : isSecureCover ? (
                          <div className="flex flex-col md:flex-row gap-3">
                             <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-[10px] font-black">
                                <ShieldCheck className="w-4 h-4" /> 免付利益 Included
                             </div>
                             <div className="flex-1 grid grid-cols-2 gap-2 p-1 bg-amber-50 rounded-xl border border-amber-100">
                                {['Father', 'Mother'].map(target => (
                                  <button
                                    key={target}
                                    onClick={() => updateSlot(idx, { secureCoverParent: target as any })}
                                    className={`py-2 rounded-lg text-[10px] font-black transition-all ${
                                      slot.secureCoverParent === target 
                                      ? 'bg-white text-amber-700 shadow-sm' 
                                      : 'text-amber-900/30'
                                    }`}
                                  >
                                    {target === 'Father' ? '父亲' : '母亲'}
                                  </button>
                                ))}
                             </div>
                          </div>
                        ) : isFixed ? (
                          <div className="flex items-center gap-2 px-5 py-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" /> 自动包含在内 (Fixed Rider)
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="custom-input-container flex items-center bg-slate-50 border border-slate-100 rounded-xl px-5 transition-all">
                              <span className="font-black text-slate-300 text-lg mr-2 italic">RM</span>
                              <input
                                type="number"
                                value={currentSA === 0 ? '' : currentSA}
                                onFocus={handleFocus}
                                onChange={(e) => updateRiderSA(idx, rider, Number(e.target.value))}
                                className="w-full py-3 bg-transparent outline-none font-black text-slate-700 text-xl tracking-tight"
                                placeholder="0"
                              />
                            </div>
                            
                            {isPrecious && (
                              <div className="flex flex-col gap-2 p-3 bg-pink-50/30 rounded-xl border border-pink-100">
                                <label className="text-[8px] font-black text-pink-400 uppercase tracking-widest">选择黄疸津贴 (Jaundice)</label>
                                <div className="grid grid-cols-3 gap-2">
                                  {JAUNDICE_OPTIONS.map(amt => (
                                    <button
                                      key={amt}
                                      onClick={() => updateSlot(idx, { jaundiceAmount: amt })}
                                      className={`py-1.5 rounded-lg text-[9px] font-black transition-all ${
                                        slot.jaundiceAmount === amt 
                                        ? 'bg-white text-pink-600 shadow-sm' 
                                        : 'text-pink-300 hover:text-pink-400'
                                      }`}
                                    >
                                      RM {amt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {isPA && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                <div className="space-y-2">
                                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-red-400" /> 每周津贴
                                  </label>
                                  <div className="custom-input-container flex items-center bg-white border border-slate-200 rounded-lg px-3">
                                    <span className="font-black text-slate-200 text-xs mr-1">RM</span>
                                    <input
                                      type="number"
                                      value={slot.paWeeklyIndemnity === 0 ? '' : (slot.paWeeklyIndemnity || '')}
                                      onFocus={handleFocus}
                                      onChange={(e) => updateSlot(idx, { paWeeklyIndemnity: Number(e.target.value) })}
                                      className="w-full py-2 bg-transparent outline-none font-bold text-slate-700 text-sm"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-end">
                                  <button
                                    onClick={() => updateSlot(idx, { paMinorAccident: !slot.paMinorAccident })}
                                    className={`w-full py-2.5 rounded-lg border text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all ${
                                      slot.paMinorAccident ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-300'
                                    }`}
                                  >
                                    <Stethoscope className="w-3 h-3" /> 小意外门诊 (RM 2k)
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Premium Footer Section */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((num) => {
                  const ageKey = `age${num}` as 'age1' | 'age2';
                  const premiumKey = `premium${num === 1 ? '70' : '80'}` as 'premium70' | 'premium80';
                  const isA = num === 1;

                  return (
                    <div key={num} className={`p-6 rounded-[2rem] shadow-lg border relative overflow-hidden flex flex-col justify-between ${isA ? 'bg-slate-900 border-slate-800' : 'bg-indigo-950 border-indigo-900'}`}>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {AGE_OPTIONS.map(age => (
                          <button
                            key={age}
                            onClick={() => updateSlot(idx, { [ageKey]: age })}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                              slot[ageKey] === age 
                              ? (isA ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white') 
                              : 'bg-white/5 text-white/20 hover:text-white/40'
                            }`}
                          >
                            至 {age} 岁
                          </button>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">{isA ? '保费预估选项 A' : '保费预估选项 B'}</label>
                        <div className="flex items-center">
                          <span className={`text-xl font-black italic mr-3 ${isA ? 'text-blue-500/50' : 'text-indigo-400/50'}`}>RM</span>
                          <input
                            type="number"
                            value={slot[premiumKey] === 0 ? '' : slot[premiumKey]}
                            onFocus={handleFocus}
                            onChange={(e) => updateSlot(idx, { [premiumKey]: Number(e.target.value) })}
                            className="w-full bg-transparent outline-none font-black text-white text-3xl tracking-tight placeholder:text-white/5"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-10 flex flex-col items-center gap-3 text-slate-300">
         <div className="w-10 h-1 bg-slate-200 rounded-full" />
         <p className="text-[9px] font-black uppercase tracking-[0.3em]">End of Benefits Detail</p>
      </div>
    </div>
  );
};

export default StepSlotBenefits;
