
import React, { useState, useEffect } from 'react';
import { AppState, AdvisorInfo } from '../types';
import { ShieldCheck, Heart, Activity, ShieldPlus, ShieldAlert, Zap, Award, Printer, Info, Search } from 'lucide-react';
import { CI_RULES } from '../constants';

interface Props {
  state: AppState;
  onAdvisorChange: (info: AdvisorInfo) => void;
}

type Lang = 'CN' | 'EN';

const StepFinalA4Export: React.FC<Props> = ({ state, onAdvisorChange }) => {
  const [lang, setLang] = useState<Lang>('CN');
  const [zoom, setZoom] = useState(1); 
  const slots = state.selectedSlots;
  
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || val === 0) return '-';
    return `RM ${val.toLocaleString()}`;
  };

  const getCIDetails = (slot: any) => {
    let tier = slot.ciTier || '36';
    if (slot.riders.includes('PrimeCare+')) tier = '157';
    else if (slot.riders.includes('HealthCover Plus')) tier = '77';
    else if (slot.riders.includes('HealthCover')) tier = '36';
    
    const rule = CI_RULES[tier];
    const riderSAs = slot.riderSAs || {};
    const base = riderSAs['HealthCover'] || riderSAs['HealthCover Plus'] || riderSAs['PrimeCare+'] || slot.ciSA || 0;
    
    return {
      tier,
      severe: base * (rule?.severe ?? 1),
      intermediate: base * (rule?.intermediate ?? 0),
      early: base * (rule?.early ?? 0),
    };
  };

  const t = {
    title: lang === 'CN' ? '综合保障对比分析建议书' : 'PROTECTION ANALYSIS REPORT',
    subtitle: lang === 'CN' ? 'A4 国际标准单页格式' : 'A4 STANDARDIZED SUMMARY',
    customer: lang === 'CN' ? '受保人' : 'INSURED',
    age: lang === 'CN' ? '岁' : 'YRS',
    category: lang === 'CN' ? '保障项目明细' : 'BENEFITS',
    option: lang === 'CN' ? '方案' : 'OPT',
    premium: lang === 'CN' ? '月供对比' : 'PREMIUM',
    sec1: { title: lang === 'CN' ? '1. 人寿/全残保障' : '1. LIFE PROTECTION', item: lang === 'CN' ? '基本身故保额' : 'Life/TPD SA' },
    sec2: { title: lang === 'CN' ? '2. 医疗支出保障' : '2. MEDICAL PROTECTION', limit: lang === 'CN' ? '年度总限额' : 'Annual Limit', room: lang === 'CN' ? '病房等级' : 'Room & Board', copay: lang === 'CN' ? '自付额 (最高 2.5K)' : 'Copay (Max 2.5K)' },
    sec3: { title: lang === 'CN' ? '3. 严重疾病保障' : '3. CRITICAL ILLNESS', severe: lang === 'CN' ? '严重重疾(100%)' : 'Severe CI', inter: lang === 'CN' ? '中期重疾(100%)' : 'Interm. CI', early: lang === 'CN' ? '初期重疾(50%)' : 'Early CI' },
    sec4: { title: lang === 'CN' ? '4. 个人意外保障' : '4. ACCIDENT PROTECTION', death: lang === 'CN' ? '意外身故/伤残' : 'Acc. Death', weekly: lang === 'CN' ? '每周入息津贴' : 'Weekly Benefit', minor: lang === 'CN' ? '小意外门诊' : 'Minor Accid.' },
    sec5: { title: lang === 'CN' ? '5. 免付保费利益' : '5. PREMIUM WAIVER', item: lang === 'CN' ? '严重疾病时豁免保费' : 'Waiver on CI' },
    sec6: { title: lang === 'CN' ? '6. 忠诚奖励' : '6. LOYALTY BONUS', item: lang === 'CN' ? '18% 奖励金预估' : 'Loyalty Bonus' },
    insured: lang === 'CN' ? '受保人' : 'Insured',
    father: lang === 'CN' ? '父亲' : 'Father',
    mother: lang === 'CN' ? '母亲' : 'Mother',
    footer: lang === 'CN' ? '本建议书仅供参考，详细条款以正式保单合约为准。' : 'FOR ILLUSTRATION ONLY. SEE POLICY CONTRACT.',
    advisor: lang === 'CN' ? '理财规划顾问' : 'ADVISOR'
  };

  const labelColWidth = "w-[22%]";
  const planColWidth = slots.length >= 4 ? "w-[19.5%]" : "w-[26%]";

  useEffect(() => {
    if (window.innerWidth < 800) setZoom(0.45);
    else setZoom(0.8);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-32">
      {/* 5th Page Control Bar */}
      <div className="no-print bg-slate-900 text-white p-5 rounded-[2.5rem] shadow-2xl flex flex-wrap items-center justify-between gap-6 sticky top-4 z-[100] border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
             <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-widest uppercase">最终打印导出预览</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">A4 Standard PDF Ready</p>
          </div>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button onClick={() => setLang('CN')} className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all ${lang === 'CN' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-300'}`}>中文版</button>
          <button onClick={() => setLang('EN')} className={`px-5 py-2 rounded-lg text-[10px] font-black transition-all ${lang === 'EN' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-300'}`}>English</button>
        </div>

        <div className="flex items-center gap-4 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="range" min="0.3" max="1.3" step="0.05" value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-32 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-[10px] font-black text-slate-300 w-10">{Math.round(zoom * 100)}%</span>
        </div>

        <button 
          onClick={handlePrint} 
          className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-[11px] shadow-xl hover:bg-blue-500 active:scale-95 transition-all group"
        >
          <Printer className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 一键打印 / 导出 PDF
        </button>
      </div>

      {/* Realistic A4 Paper Rendering Container */}
      <div className="relative flex justify-center bg-slate-200/50 p-4 md:p-12 rounded-[4rem] border border-slate-300/20 overflow-visible no-print">
        <div 
          className="report-container bg-white w-[210mm] h-[297mm] text-slate-800 shadow-[0_50px_100px_rgba(0,0,0,0.12)] p-[12mm] border border-white flex flex-col justify-between origin-top transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, marginBottom: `calc((297mm * ${zoom}) - 297mm)` }}
        >
          <div className="w-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4 mb-5">
              <div className="flex flex-col">
                <h1 className="text-[16px] font-black text-slate-900 tracking-tight uppercase leading-none">{t.title}</h1>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">{t.subtitle}</span>
              </div>
              <div className="text-right flex items-end gap-4 leading-none">
                <div className="flex flex-col items-end">
                   <span className="text-[10px] text-slate-300 font-black uppercase tracking-tighter mb-1">{t.customer}</span>
                   <span className="text-[12px] font-black text-slate-900 uppercase">{state.customer.name || '---'} ({state.customer.age}{t.age})</span>
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
              </div>
            </div>

            {/* Table */}
            <div className="border-[2px] border-slate-900 rounded-sm overflow-hidden">
              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className={`${labelColWidth} px-3 py-3 text-left font-black uppercase text-[11px] border-r border-slate-800`}>{t.category}</th>
                    {slots.map((slot, i) => (
                      <th key={i} className={`${planColWidth} px-2 py-3 text-center border-r border-slate-800 last:border-r-0`}>
                        <div className="text-blue-400 text-[9px] font-bold leading-none mb-1 uppercase tracking-tighter">{t.option} {String.fromCharCode(65 + i)}</div>
                        <div className="text-[11px] font-black leading-tight truncate">{slot.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-800 text-white h-6">
                    <td className="px-3 py-0.5 font-black uppercase text-[9px] flex items-center gap-2.5"><Heart className="w-3.5 h-3.5" /> {t.sec1.title}</td>
                    <td colSpan={slots.length} className="px-2 py-0.5 text-[8px] text-center font-bold opacity-30 uppercase tracking-widest leading-none">身故及完全与永久残废基本保额</td>
                  </tr>
                  <tr className="h-8">
                    <td className="px-3 py-0.5 bg-slate-50 border-r border-slate-200 font-bold text-slate-400 text-[11px] leading-tight">{t.sec1.item}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-slate-900 text-[13px]">
                        {formatCurrency(s.lifeSA)}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-emerald-700 text-white h-6">
                    <td className="px-3 py-0.5 font-black uppercase text-[9px] flex items-center gap-2.5"><ShieldPlus className="w-3.5 h-3.5" /> {t.sec2.title}</td>
                    <td colSpan={slots.length} className="px-2 py-0.5 text-[8px] text-center font-bold opacity-30 uppercase tracking-widest leading-none">医疗账单 100% 全额理赔保障</td>
                  </tr>
                  <tr className="h-7.5">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-400 text-[10.5px] leading-tight">{t.sec2.limit}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-emerald-700 text-[12px]">
                        {s.riders.some((r: any) => r.includes('Health') || r.includes('Insured')) ? '5,000,000' : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="h-6.5">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-300 text-[9.5px] leading-tight">{t.sec2.room}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-slate-600 text-[11px]">
                        {s.riders.some((r: any) => r.includes('Health') || r.includes('Insured')) ? 'RM 200' : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="h-6.5">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-300 text-[9.5px] leading-tight">{t.sec2.copay}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-slate-400 text-[9.5px]">
                        {s.riders.some((r: any) => r.includes('Health') || r.includes('Insured')) ? '15% (MAX 2.5K)' : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-blue-700 text-white h-6">
                    <td className="px-3 py-0.5 font-black uppercase text-[9px] flex items-center gap-2.5"><Activity className="w-3.5 h-3.5" /> {t.sec3.title}</td>
                    <td colSpan={slots.length} className="px-2 py-0.5 text-[8px] text-center font-bold opacity-30 uppercase tracking-widest leading-none">重大疾病即赔生活费 (Cash Payout)</td>
                  </tr>
                  <tr className="h-7.5">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-400 text-[10.5px] leading-tight">{t.sec3.severe}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-blue-700 text-[12px]">
                        {formatCurrency(getCIDetails(s).severe)}
                      </td>
                    ))}
                  </tr>
                  <tr className="h-6.5">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-300 text-[9.5px] leading-tight">{t.sec3.inter}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-slate-500 text-[11px]">
                        {formatCurrency(getCIDetails(s).intermediate)}
                      </td>
                    ))}
                  </tr>
                  <tr className="h-6.5">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-300 text-[9.5px] leading-tight">{t.sec3.early}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-slate-500 text-[11px]">
                        {formatCurrency(getCIDetails(s).early)}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-red-700 text-white h-6">
                    <td className="px-3 py-0.5 font-black uppercase text-[9px] flex items-center gap-2.5"><ShieldAlert className="w-3.5 h-3.5" /> {t.sec4.title}</td>
                    <td colSpan={slots.length} className="px-2 py-0.5 text-[8px] text-center font-bold opacity-30 uppercase tracking-widest leading-none">意外风险管理与门诊津贴保障</td>
                  </tr>
                  <tr className="h-7.5">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-400 text-[10.5px] leading-tight">{t.sec4.death}</td>
                    {slots.map((s, i) => {
                      const val = s.paSA || s.riderSAs?.['Personal Accident'] || s.riderSAs?.['PA Plus'] || 0;
                      return (
                        <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-slate-900 text-[11px]">
                          {formatCurrency(val)}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="h-6.5">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-300 text-[9.5px] leading-tight">{t.sec4.weekly}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-slate-500 text-[10px]">
                        {s.paWeeklyIndemnity ? `RM ${s.paWeeklyIndemnity}/WK` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="h-6.5">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-300 text-[9.5px] leading-tight">{t.sec4.minor}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-slate-500 text-[10px]">
                        {s.paMinorAccident ? '✅ RM 2K 包含' : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-amber-700 text-white h-6">
                    <td className="px-3 py-0.5 font-black uppercase text-[9px] flex items-center gap-2.5"><Zap className="w-3.5 h-3.5" /> {t.sec5.title}</td>
                    <td colSpan={slots.length} className="px-2 py-0.5 text-[8px] text-center font-bold opacity-30 uppercase tracking-widest leading-none">豁免后续保费条款 (Waiver Benefit)</td>
                  </tr>
                  <tr className="h-10">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-400 text-[10.5px] leading-tight">{t.sec5.item}</td>
                    {slots.map((s, i) => {
                      const hasP = s.riders.includes('Payor Cover');
                      const hasS = s.riders.includes('Secure Cover');
                      return (
                        <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 text-[11px] font-black leading-tight">
                           {hasP && <div className="text-amber-700">✅ {t.insured}豁免</div>}
                           {hasS && <div className="text-amber-800">✅ {s.secureCoverParent === 'Father' ? t.father : t.mother}豁免</div>}
                           {!hasP && !hasS && '-'}
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="bg-indigo-700 text-white h-6">
                    <td className="px-3 py-0.5 font-black uppercase text-[9px] flex items-center gap-2.5"><Award className="w-3.5 h-3.5" /> {t.sec6.title}</td>
                    <td colSpan={slots.length} className="px-2 py-0.5 text-[8px] text-center font-bold opacity-30 uppercase tracking-widest leading-none">保单长期忠诚奖励预估</td>
                  </tr>
                  <tr className="h-8">
                    <td className="px-3 py-0.5 border-r border-slate-200 font-bold text-slate-400 text-[11px] leading-tight">{t.sec6.item}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-0.5 text-center border-r border-slate-100 last:border-r-0 font-black text-indigo-900 text-[12px]">
                        {s.product === 'Everlink Signature' ? formatCurrency(s.lifeSA * 0.18) : '-'}
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-yellow-400 text-slate-900 border-t-2 border-slate-900">
                    <td className="px-3 py-2 font-black text-[14px] uppercase text-center border-r border-yellow-600 leading-none">{t.premium}</td>
                    {slots.map((s, i) => (
                      <td key={i} className="px-2 py-2.5 text-center border-r border-yellow-600 last:border-r-0">
                        <div className="flex flex-col gap-2">
                           <div className="flex flex-col leading-none">
                              <span className="text-[9.5px] font-black text-yellow-900/50 uppercase tracking-tighter">至 {s.age1 || 70}岁 (A)</span>
                              <span className="text-[14px] font-black">{formatCurrency(s.premium70)}</span>
                           </div>
                           <div className="h-[1.5px] bg-yellow-600/20 w-[60%] mx-auto" />
                           <div className="flex flex-col leading-none">
                              <span className="text-[9.5px] font-black text-yellow-900/50 uppercase tracking-tighter">至 {s.age2 || 80}岁 (B)</span>
                              <span className="text-[14px] font-black">{formatCurrency(s.premium80)}</span>
                           </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full flex justify-between items-center border-t-2 border-slate-900 pt-5 mt-4">
            <div className="flex items-center gap-4">
               <ShieldCheck className="w-10 h-10 text-slate-900" />
               <div className="flex flex-col">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">INSUREPRO ADVISORY ECOSYSTEM</p>
                  <p className="text-[12px] font-black text-slate-900 uppercase leading-none mt-1.5">{t.footer}</p>
               </div>
            </div>
            <div className="text-right flex flex-col leading-none">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.advisor}</span>
               <span className="text-[14px] font-black text-slate-900 uppercase mt-1.5">{state.advisor.name || '---'}</span>
               <span className="text-blue-600 font-bold text-[11px] mt-1">{state.advisor.contact || '---'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Helper Info */}
      <div className="no-print max-w-2xl mx-auto p-6 bg-blue-50 border border-blue-100 rounded-[2.5rem] flex items-start gap-4">
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg">
          <Info className="w-5 h-5 text-white" />
        </div>
        <div className="space-y-2">
           <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight">打印导出重要说明</p>
           <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
             本页面已针对 A4 标准尺寸进行了物理级适配。点击打印后，请确保：<br/>
             1. 目标选择 <span className="text-blue-600 font-black italic">“另存为 PDF” (Save as PDF)</span>。<br/>
             2. 布局必须选择 <span className="text-blue-600 font-black italic">“纵向” (Portrait)</span>。<br/>
             3. 缩放选择 <span className="text-blue-600 font-black italic">“100%”</span> 并勾选 <span className="text-blue-600 font-black italic">“背景图形”</span>。
           </p>
        </div>
      </div>

      <style>{`
        /* Print Style Overrides */
        @media print {
          .no-print { display: none !important; }
          body { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Ensure report is the ONLY content and takes up full A4 */
          .report-container { 
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            padding: 10mm 15mm !important;
            margin: 0 !important;
            transform: none !important; /* IMPORTANT: Reset scale for printing */
            border: none !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            page-break-after: avoid !important;
            overflow: hidden !important;
          }
          @page { 
            size: A4 portrait; 
            margin: 0; 
          }
        }
      `}</style>
    </div>
  );
};

export default StepFinalA4Export;
