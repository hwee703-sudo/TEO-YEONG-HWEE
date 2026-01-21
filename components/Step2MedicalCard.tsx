
import React from 'react';
import { MedicalCard } from '../types';
import { Shield, CheckCircle2, Waves, AlertCircle, Info } from 'lucide-react';

interface Props {
  data: MedicalCard;
}

const Step2MedicalCard: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">医药卡保障详情</h2>
          <p className="text-slate-400 font-medium mt-1">Health Assured 高端防护层规格摘要</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
           <Shield className="w-4 h-4" />
           <span className="text-[10px] font-black uppercase tracking-widest">Panel Approved</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        
        <div className="relative bg-white/80 backdrop-blur-2xl rounded-[3rem] overflow-hidden border border-white shadow-2xl">
          {/* Header Row */}
          <div className="bg-slate-900 px-10 py-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-black text-white text-2xl tracking-tight uppercase leading-none">{data.name}</h3>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-2">Allianz Premium Medical</p>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-white/10 text-white px-5 py-2 rounded-full text-[10px] font-black tracking-widest border border-white/10">
                {data.plan}
              </span>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: Key Limits */}
            <div className="space-y-10">
              <div className="relative">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1">年度限额 Annual Limit</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-6xl font-black text-slate-900 tracking-tighter">RM 5,000,000</p>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500/5 rounded-full blur-xl" />
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">终身限额</p>
                  <p className="text-xl font-black text-slate-800">{data.lifetime_limit}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">ICU 费用</p>
                  <p className="text-xl font-black text-slate-800">{data.icu}</p>
                </div>
              </div>
            </div>

            {/* Right: Copayment & Conditions */}
            <div className="space-y-8">
              <div className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-200/50">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-blue-200" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">共付机制 (Copayment)</span>
                </div>
                <p className="text-xl font-black leading-tight mb-2">15% 自付额</p>
                <p className="text-sm font-medium opacity-80 italic">每年最高封顶 RM 2,500，其余全数由保险承担</p>
              </div>

              <div className="space-y-4 px-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <AlertCircle className="w-4 h-4 text-amber-500" /> 使用限制 Key Conditions
                </p>
                <ul className="space-y-3">
                  {data.conditions.map((condition, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs font-bold text-slate-600 leading-snug">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                       {condition}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits Icons Row */}
          <div className="bg-slate-50/80 px-10 py-10 border-t border-slate-100">
             <div className="flex items-center gap-2 mb-6">
                <Waves className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">保障摘要 Benefits Summary</span>
             </div>
             <div className="flex flex-wrap gap-3">
                {data.benefits.map((benefit, idx) => (
                  <div key={idx} className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{benefit}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="px-10 py-5 bg-slate-900/5 text-[9px] text-slate-400 font-bold leading-relaxed border-t border-slate-100 italic">
            <div className="flex items-start gap-2">
               <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
               <p>{data.compliance_note}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2MedicalCard;
