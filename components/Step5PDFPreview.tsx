
import React, { useRef } from 'react';
import { AppState, AdvisorInfo, ProductSlot } from '../types';
import { Download, ShieldCheck, Phone, User, ExternalLink } from 'lucide-react';

interface Props {
  state: AppState;
  onAdvisorChange: (info: AdvisorInfo) => void;
}

const Step5PDFPreview: React.FC<Props> = ({ state, onAdvisorChange }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const slots = state.selectedSlots;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="no-print space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">保障整理对比表</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Review and Export professional proposal</p>
      </div>

      <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/60 p-10 rounded-[3rem] border border-white shadow-xl">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> 理财顾问姓名
          </label>
          <input
            type="text"
            value={state.advisor.name}
            onChange={(e) => onAdvisorChange({ ...state.advisor, name: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 outline-none font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/5 transition-all"
            placeholder="您的名字"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-500" /> 联络方式
          </label>
          <input
            type="text"
            value={state.advisor.contact}
            onChange={(e) => onAdvisorChange({ ...state.advisor, contact: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 outline-none font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/5 transition-all"
            placeholder="WhatsApp / 电话"
          />
        </div>
      </div>

      <div 
        ref={reportRef} 
        id="pdf-report"
        className="bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] p-12 md:p-16 rounded-[1rem] max-w-[1000px] mx-auto text-slate-800 border border-slate-100 text-[11px] print:p-8 print:shadow-none"
      >
        <div className="flex justify-between items-end border-b-4 border-slate-900 pb-6 mb-8">
          <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">保障整理表</h1>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Comprehensive Insurance Summary</p>
          </div>
          <div className="text-right">
             <p className="font-black text-slate-900 text-lg uppercase">Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 border border-slate-900 mb-10">
          <div className="border-r border-slate-900 p-4">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">受保人 INSURED</p>
            <p className="font-black text-slate-900 text-sm uppercase truncate">{state.customer.name || '---'}</p>
          </div>
          <div className="border-r border-slate-900 p-4">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">出生日期 D.O.B</p>
            <p className="font-black text-slate-900 text-sm">{state.customer.dob.day}-{state.customer.dob.month}-{state.customer.dob.year}</p>
          </div>
          <div className="border-r border-slate-900 p-4">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">保险代理 AGENT</p>
            <p className="font-black text-slate-900 text-sm uppercase truncate">{state.advisor.name || '---'}</p>
          </div>
          <div className="p-4">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">联络号码 CONTACT</p>
            <p className="font-black text-slate-900 text-sm truncate">{state.advisor.contact || '---'}</p>
          </div>
        </div>

        <div className="border-2 border-slate-900 overflow-hidden rounded-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="border-r border-slate-800 px-6 py-4 text-left w-[25%] font-black uppercase tracking-widest text-[10px]">类别 SECTION</th>
                {slots.map((slot, i) => (
                  <th key={i} className={`border-r border-slate-800 px-6 py-4 text-center font-black uppercase tracking-widest text-[10px] ${i === slots.length - 1 ? 'border-r-0' : ''}`}>
                    {slot.name}<br/>
                    <span className="text-[8px] text-blue-400 opacity-80 font-medium">({slot.product})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-center font-black">
              <tr className="bg-blue-600 text-white"><td colSpan={slots.length + 1} className="px-6 py-1.5 font-black text-[11px] text-center uppercase tracking-[0.2em]">主险保障 Base Plan</td></tr>
              <tr>
                <td className="px-6 py-3 font-bold bg-slate-50 border-r border-slate-200 text-left">死亡/全残保障数额</td>
                {slots.map((s, i) => <td key={i} className="px-6 py-3 border-r border-slate-200 text-slate-900 font-black">
                  {s.lifeSA > 0 ? `RM ${s.lifeSA.toLocaleString()}` : '-'}
                </td>)}
              </tr>

              <tr className="bg-slate-800 text-white"><td colSpan={slots.length + 1} className="px-6 py-1.5 font-black text-[11px] text-center uppercase tracking-[0.2em]">已选附加险详细 Rider Details</td></tr>
              {(Array.from(new Set(slots.flatMap(s => s.riders))) as string[]).map((riderName: string) => (
                <tr key={riderName}>
                  <td className="px-6 py-3 font-bold bg-slate-50 border-r border-slate-200 text-left truncate">{riderName}</td>
                  {slots.map((s, i) => {
                    const hasRider = s.riders.includes(riderName);
                    if (!hasRider) return <td key={i} className="px-6 py-3 border-r border-slate-200">-</td>;
                    
                    // Special display for Health Assured
                    if (riderName === 'Health Assured') {
                      return <td key={i} className="px-6 py-3 border-r border-slate-200 text-blue-600 font-black text-[9px]">✅ Medical Card (Fixed)</td>;
                    }

                    // Special display for Waiver Riders
                    if (riderName === 'Payor Cover' || riderName === 'Secure Cover') {
                      return <td key={i} className="px-6 py-3 border-r border-slate-200 text-amber-600 font-black text-[9px]">✅ Premium Waiver</td>;
                    }

                    return (
                      <td key={i} className="px-6 py-3 border-r border-slate-200">
                        {s.riderSAs[riderName] > 0 ? `RM ${s.riderSAs[riderName].toLocaleString()}` : '✅ Included'}
                      </td>
                    );
                  })}
                </tr>
              ))}

              <tr className="bg-yellow-600 text-white"><td colSpan={slots.length + 1} className="px-6 py-1.5 font-black text-[11px] text-center uppercase tracking-[0.2em]">预估月保费 Estim. Premium</td></tr>
              <tr>
                <td className="px-6 py-3 font-bold bg-slate-50 border-r border-slate-200 text-left">保费 (至 {slots[0]?.age1 || 70} 岁)</td>
                {slots.map((slot, i) => <td key={i} className="px-6 py-3 border-r border-slate-200 text-slate-900 font-black">
                  {slot.premium70 > 0 ? `RM ${slot.premium70.toLocaleString()}` : '-'}
                </td>)}
              </tr>
              <tr>
                <td className="px-6 py-3 font-bold bg-slate-50 border-r border-slate-200 text-left">保费 (至 {slots[0]?.age2 || 80} 岁)</td>
                {slots.map((slot, i) => <td key={i} className="px-6 py-3 border-r border-slate-200 text-slate-900 font-black">
                  {slot.premium80 > 0 ? `RM ${slot.premium80.toLocaleString()}` : '-'}
                </td>)}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-8">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <ShieldCheck className="w-8 h-8" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">InsurePro Intelligence</p>
                <p className="text-sm font-black text-slate-900">专业的保障，源于精心的规划。</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-bold text-slate-400 mb-1 leading-none italic">* 此文件仅供说明用途，不构成保险合同，最终条款以保单为准。</p>
             <p className="text-[10px] font-black text-slate-900 flex items-center justify-end gap-1">
               <ExternalLink className="w-3 h-3 text-blue-500" /> GENERATED BY INSUREPRO BUILDER
             </p>
          </div>
        </div>
      </div>

      <div className="no-print flex justify-center pb-12">
        <button
          onClick={handlePrint}
          className="flex items-center gap-4 px-16 py-6 bg-slate-900 hover:bg-blue-600 text-white rounded-[2.5rem] font-black shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 group"
        >
          <Download className="w-6 h-6 group-hover:animate-bounce" /> 保存 PDF 建议对比书
        </button>
      </div>
    </div>
  );
};

export default Step5PDFPreview;
