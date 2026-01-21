
import React, { useState, useEffect, useRef } from 'react';
import { AppState, AdvisorInfo, ProductSlot, AdvisorProfile } from '../types';
import { ShieldCheck, UserCircle, Search, Plus, Trash2, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  state: AppState;
  onAdvisorChange: (info: AdvisorInfo) => void;
}

type Lang = 'CN' | 'EN';

const StepComparisonReport: React.FC<Props> = ({ state, onAdvisorChange }) => {
  const [lang, setLang] = useState<Lang>('CN');
  const [zoom, setZoom] = useState(0.85);
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profiles, setProfiles] = useState<AdvisorProfile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('insurepro_profiles');
    if (saved) setProfiles(JSON.parse(saved));
    
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 600) setZoom(0.32);
      else if (w < 1024) setZoom(0.6);
      else setZoom(0.85);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveToLibrary = () => {
    if (!state.advisor.name) return;
    const newP: AdvisorProfile = { id: Date.now().toString(), ...state.advisor };
    const updated = [newP, ...profiles];
    setProfiles(updated);
    localStorage.setItem('insurepro_profiles', JSON.stringify(updated));
  };

  const deleteProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    localStorage.setItem('insurepro_profiles', JSON.stringify(updated));
  };

  const selectProfile = (p: AdvisorProfile) => {
    onAdvisorChange({ name: p.name, contact: p.contact, photo: p.photo });
    setIsModalOpen(false);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onAdvisorChange({ ...state.advisor, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleExport = async () => {
    const node = document.getElementById('report-sheet');
    if (!node || isExporting) return;
    try {
      setIsExporting(true);
      
      // Give the browser a moment to settle after UI change (spinner appearing)
      await new Promise(resolve => setTimeout(resolve, 150));

      const dataUrl = await toPng(node, { 
        pixelRatio: 2.5, // 2.5 is more stable for mobile memory limits than 3
        backgroundColor: '#ffffff',
        cacheBust: true,
        width: 794, 
        height: 1123,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          margin: '0',
          padding: '12mm',
          left: '0',
          top: '0',
          position: 'static'
        }
      });
      
      const link = document.createElement('a');
      link.download = `Report_${state.customer.name}_${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  const formatRM = (v: number | undefined) => (v === undefined || v === 0) ? '-' : `RM ${v.toLocaleString()}`;

  const displaySlots = [state.selectedSlots[0], state.selectedSlots[1], state.selectedSlots[2], state.selectedSlots[3]];
  
  // Get the selected age from the first valid slot to use as row labels
  const firstSlot = displaySlots.find(s => s !== undefined);
  const ageLabel1 = firstSlot?.age1 || 70;
  const ageLabel2 = firstSlot?.age2 || 80;

  const t = {
    title: lang === 'CN' ? '保障整理表' : 'PROTECTION SUMMARY',
    subtitle: lang === 'CN' ? 'Protection Summary' : 'Comprehensive Analysis',
    cname: lang === 'CN' ? '顾客姓名' : 'Client Name',
    cage: lang === 'CN' ? '年龄' : 'Age',
    cdate: lang === 'CN' ? '规划日期' : 'Date',
    life: lang === 'CN' ? '人寿保障' : 'LIFE PROTECTION',
    med: lang === 'CN' ? '医药卡' : 'MEDICAL CARD',
    ci: lang === 'CN' ? '疾病保障' : 'CRITICAL ILLNESS',
    pa: lang === 'CN' ? '意外保障' : 'ACCIDENT',
    waiver: lang === 'CN' ? '免付保费利益' : 'PREMIUM WAIVER',
    value: lang === 'CN' ? '户口价值' : 'ACCOUNT VALUE',
    footer: lang === 'CN' ? '此建议书仅供参考，最终以保单合约为准。' : 'FOR ILLUSTRATION ONLY. SUBJECT TO POLICY TERMS.',
    adv: lang === 'CN' ? '理财顾问' : 'ADVISOR'
  };

  const rowHClass = "h-[13px]"; 
  const contentTextClass = "text-[11px] leading-none px-4 font-bold border-r border-slate-100 uppercase tracking-tighter align-middle whitespace-nowrap overflow-hidden";
  const labelTextClass = `${contentTextClass} bg-slate-50 border-slate-200 font-black text-slate-500`;
  const valueTextClass = `${contentTextClass} text-center last:border-r-0 text-slate-900`;

  const slotBgClasses = [
    "bg-blue-500/20",
    "bg-indigo-500/20",
    "bg-violet-500/20",
    "bg-slate-500/20"
  ];

  const RowHeader = ({ title, colorClass = "bg-slate-900/80" }: { title: string, colorClass?: string }) => (
    <tr className={`${colorClass} text-white h-[15px]`}>
      <td colSpan={5} className="px-4 font-black uppercase text-[10px] tracking-widest leading-none">{title}</td>
    </tr>
  );

  const getCISuffix = (s: ProductSlot | undefined) => {
    if (!s) return '';
    if (s.riders.includes('PrimeCare+')) return ' (包括初期疾病)';
    if (s.riders.includes('HealthCover Plus')) return ' (包括中期疾病)';
    if (s.riders.includes('HealthCover')) return ' (36种严重疾病)';
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-24">
      {/* Control Bar */}
      <div className="no-print w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 bg-slate-100 pr-5 pl-1.5 py-1.5 rounded-full border border-slate-200 hover:border-blue-400 transition-all">
          {state.advisor.photo ? <img src={state.advisor.photo} className="w-8 h-8 rounded-full object-cover border-2 border-white" /> : <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 border border-slate-100"><UserCircle className="w-5 h-5" /></div>}
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-800 leading-none">{state.advisor.name || '管理顾问'}</p>
            <p className="text-[7px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest leading-none">Library</p>
          </div>
        </button>

        <div className="bg-slate-100 p-1 rounded-full flex relative w-28 h-9 items-center cursor-pointer" onClick={() => setLang(lang === 'CN' ? 'EN' : 'CN')}>
          <div className={`absolute w-[calc(50%-4px)] h-[calc(100%-8px)] bg-white rounded-full shadow-md transition-all duration-300 transform ${lang === 'EN' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-1'}`} />
          <span className={`flex-1 text-center text-[9px] font-black z-10 ${lang === 'CN' ? 'text-blue-600' : 'text-slate-400'}`}>中文</span>
          <span className={`flex-1 text-center text-[9px] font-black z-10 ${lang === 'EN' ? 'text-blue-600' : 'text-slate-400'}`}>EN</span>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 px-4 py-1.5 rounded-full">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input type="range" min="0.3" max="1.5" step="0.05" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-20 h-1 accent-blue-600 appearance-none bg-slate-300 rounded-full" />
            <span className="text-[9px] font-black text-slate-500 w-6 text-right">{Math.round(zoom * 100)}%</span>
        </div>

        <button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-full font-black text-[11px] shadow-xl hover:bg-blue-600 transition-all">
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          {isExporting ? '生成中...' : '保存为高清图片'}
        </button>
      </div>

      {/* Profile Library Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-black text-slate-800 text-sm">理财顾问库</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="relative cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                    {state.advisor.photo ? <img src={state.advisor.photo} className="w-14 h-14 rounded-2xl object-cover shadow-sm" /> : <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-200"><Upload className="w-5 h-5" /></div>}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhoto} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input type="text" placeholder="姓名" value={state.advisor.name} onChange={(e) => onAdvisorChange({...state.advisor, name: e.target.value})} className="w-full px-4 py-2 rounded-xl text-xs font-bold border outline-none focus:border-blue-400" />
                    <input type="text" placeholder="电话" value={state.advisor.contact} onChange={(e) => onAdvisorChange({...state.advisor, contact: e.target.value})} className="w-full px-4 py-2 rounded-xl text-xs font-bold border outline-none focus:border-blue-400" />
                  </div>
                </div>
                <button onClick={saveToLibrary} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-black text-[9px] shadow-lg flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> 保存当前资料
                </button>
              </div>
              <div className="max-h-52 overflow-y-auto space-y-2 no-scrollbar">
                {profiles.map(p => (
                  <div key={p.id} className="group flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 hover:border-blue-200">
                    <div className="flex-1 flex items-center gap-3 cursor-pointer" onClick={() => selectProfile(p)}>
                       {p.photo ? <img src={p.photo} className="w-10 h-10 rounded-xl object-cover" /> : <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-200"><UserCircle className="w-6 h-6" /></div>}
                       <div className="leading-tight">
                          <p className="text-[11px] font-black text-slate-800">{p.name}</p>
                          <p className="text-[9px] font-bold text-slate-400">{p.contact}</p>
                       </div>
                    </div>
                    <button onClick={() => deleteProfile(p.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* A4 Report Sheet */}
      <div className="flex-grow w-full flex justify-center p-8 overflow-visible">
        <div id="report-sheet" className="bg-white w-[210mm] h-[297mm] text-slate-800 shadow-[0_40px_100px_rgba(0,0,0,0.06)] p-[12mm] flex flex-col justify-between origin-top shrink-0 relative box-border" style={{ transform: `scale(${zoom})`, marginBottom: `calc((297mm * ${zoom}) - 297mm)` }}>
          
          {/* Header */}
          <div className="flex justify-between items-end border-b-[4px] border-slate-900 pb-4 mb-4">
            <div className="space-y-1">
              <h1 className="text-[26px] font-black text-slate-900 tracking-tighter uppercase leading-none">{t.title}</h1>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mt-1 leading-none">{t.subtitle}</p>
            </div>
            <div className="text-right grid grid-cols-2 gap-x-6 gap-y-1 shrink-0">
              <div className="flex flex-col items-end leading-none">
                <span className="text-[8px] font-black text-slate-300 uppercase">{t.cname}</span>
                <span className="text-[12px] font-black text-slate-900 uppercase mt-1">{state.customer.name || '---'}</span>
              </div>
              <div className="flex flex-col items-end leading-none">
                <span className="text-[8px] font-black text-slate-300 uppercase">{t.cage}</span>
                <span className="text-[12px] font-black text-slate-900 uppercase mt-1">{state.customer.age}</span>
              </div>
              <div className="flex flex-col items-end col-span-2 mt-1 leading-none">
                <span className="text-[8px] font-black text-slate-300 uppercase">{t.cdate}</span>
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mt-1">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Master Table */}
          <div className="flex-grow border-[2px] border-slate-900 overflow-hidden flex flex-col">
            <table className="w-full border-collapse table-fixed h-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-900 h-[26px]">
                  <th className="w-[24%] border-r border-slate-300 px-3 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">方案详情 OPTION DETAILS</th>
                  {displaySlots.map((s, i) => (
                    <th key={i} className={`w-[19%] border-r border-slate-300 last:border-r-0 px-1 text-center font-black uppercase ${slotBgClasses[i]}`}>
                      <div className="text-blue-600 text-[11px] tracking-tight truncate px-1 leading-none">{s?.name || `方案 ${String.fromCharCode(65+i)}`}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* 1. Life - Color: Slate-900/80 */}
                <RowHeader title={t.life} colorClass="bg-slate-900/80" />
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '死亡赔付' : 'Death Sum'}</td>
                  {displaySlots.map((s, i) => <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{formatRM(s?.lifeSA)}</td>)}
                </tr>
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '永久残废' : 'TPD Sum'}</td>
                  {displaySlots.map((s, i) => <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{formatRM(s?.lifeSA)}</td>)}
                </tr>

                {/* 2. Medical - Color: Emerald-900/80 */}
                <RowHeader title={t.med} colorClass="bg-emerald-900/80" />
                <tr className={rowHClass}>
                   <td className={labelTextClass}>{lang === 'CN' ? '年度总限额' : 'Annual Limit'}</td>
                   {displaySlots.map((s, i) => {
                     const isAssured = s?.riders.includes('Health Assured');
                     const isInsured = s?.riders.includes('Health Insured');
                     let val = '-';
                     if (isAssured) val = 'RM 5,000,000';
                     else if (isInsured) val = 'RM 2,000,000';
                     return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{val}</td>;
                   })}
                </tr>
                <tr className={rowHClass}>
                   <td className={labelTextClass}>{lang === 'CN' ? '终身总限额' : 'Lifetime Limit'}</td>
                   {displaySlots.map((s, i) => {
                     const hasMed = s?.riders.some(r => r.includes('Health Assured') || r.includes('Health Insured'));
                     return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{hasMed ? '无限 Unlimited' : '-'}</td>;
                   })}
                </tr>
                <tr className={rowHClass}>
                   <td className={labelTextClass}>{lang === 'CN' ? '病房价位' : 'Room & Board'}</td>
                   {displaySlots.map((s, i) => {
                     const hasMed = s?.riders.some(r => r.includes('Health Assured') || r.includes('Health Insured'));
                     return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{hasMed ? 'RM 200' : '-'}</td>;
                   })}
                </tr>
                <tr className={rowHClass}>
                   <td className={labelTextClass}>{lang === 'CN' ? '需承担的医疗费' : 'Medical Costs'}</td>
                   {displaySlots.map((s, i) => {
                     const isAssured = s?.riders.includes('Health Assured');
                     const isInsured = s?.riders.includes('Health Insured');
                     let val = '-';
                     if (isAssured) val = '15% / Max RM2,500';
                     else if (isInsured) val = 'RM 5,000';
                     return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{val}</td>;
                   })}
                </tr>
                <tr className={rowHClass}>
                   <td className={labelTextClass}>{lang === 'CN' ? '加护病房住宿' : 'ICU Stay'}</td>
                   {displaySlots.map((s, i) => {
                     const isAssured = s?.riders.includes('Health Assured');
                     const isInsured = s?.riders.includes('Health Insured');
                     let val = '-';
                     if (isAssured) val = '365天';
                     else if (isInsured) val = '150天';
                     return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{val}</td>;
                   })}
                </tr>
                <tr className={rowHClass}>
                   <td className={labelTextClass}>{lang === 'CN' ? '癌症 / 洗肾门诊' : 'Cancer/Dialysis'}</td>
                   {displaySlots.map((s, i) => {
                     const hasMed = s?.riders.some(r => r.includes('Health Assured') || r.includes('Health Insured'));
                     return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{hasMed ? '包含 Covered' : '-'}</td>;
                   })}
                </tr>
                <tr className={rowHClass}>
                   <td className={labelTextClass}>{lang === 'CN' ? '入院前/后会诊' : 'Pre/Post Consult'}</td>
                   {displaySlots.map((s, i) => {
                     const hasMed = s?.riders.some(r => r.includes('Health Assured') || r.includes('Health Insured'));
                     return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{hasMed ? '90 / 180 天' : '-'}</td>;
                   })}
                </tr>

                {/* 3. CI - Color: Blue-900/80 */}
                <RowHeader title={t.ci} colorClass="bg-blue-900/80" />
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '疾病保障数额' : 'Total CI SA'}</td>
                  {displaySlots.map((s, i) => {
                    const sa = s?.riderSAs?.['HealthCover'] || s?.riderSAs?.['HealthCover Plus'] || s?.riderSAs?.['PrimeCare+'] || s?.ciSA || 0;
                    const suffix = getCISuffix(s);
                    return <td key={i} className={`${valueTextClass} !text-[9.5px] ${slotBgClasses[i]}`}>{sa > 0 ? `RM ${sa.toLocaleString()}${suffix}` : '-'}</td>;
                  })}
                </tr>
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '糖尿病康复利益' : 'Diabetes Recovery'}</td>
                  {displaySlots.map((s, i) => {
                    const sa = s?.riderSAs?.['HealthCover'] || s?.riderSAs?.['HealthCover Plus'] || s?.riderSAs?.['PrimeCare+'] || s?.ciSA || 0;
                    const isPrime = s?.riders.includes('PrimeCare+');
                    return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{isPrime && sa > 0 ? formatRM(sa * 0.2) : '-'}</td>;
                  })}
                </tr>
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '癌症康复利益' : 'Cancer Recovery'}</td>
                  {displaySlots.map((s, i) => {
                    const sa = s?.riderSAs?.['HealthCover'] || s?.riderSAs?.['HealthCover Plus'] || s?.riderSAs?.['PrimeCare+'] || s?.ciSA || 0;
                    const isPrime = s?.riders.includes('PrimeCare+');
                    return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{isPrime && sa > 0 ? formatRM(sa * 0.35) : '-'}</td>;
                  })}
                </tr>
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '危机严重康复利益' : 'Crisis Recovery'}</td>
                  {displaySlots.map((s, i) => {
                    const sa = s?.riderSAs?.['HealthCover'] || s?.riderSAs?.['HealthCover Plus'] || s?.riderSAs?.['PrimeCare+'] || s?.ciSA || 0;
                    const isPrime = s?.riders.includes('PrimeCare+');
                    return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{isPrime && sa > 0 ? formatRM(sa * 0.2) : '-'}</td>;
                  })}
                </tr>
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '小孩先天性疾病保障' : 'Baby Congenital'}</td>
                  {displaySlots.map((s, i) => {
                    const sa = s?.riderSAs?.['HealthCover'] || s?.riderSAs?.['HealthCover Plus'] || s?.riderSAs?.['PrimeCare+'] || s?.ciSA || 0;
                    return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{s?.riders.includes('BabyCover') ? formatRM(sa) : '-'}</td>;
                  })}
                </tr>
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '母婴利益保障' : 'Maternity Benefit'}</td>
                  {displaySlots.map((s, i) => {
                    const sa = s?.riderSAs?.['HealthCover'] || s?.riderSAs?.['HealthCover Plus'] || s?.riderSAs?.['PrimeCare+'] || s?.ciSA || 0;
                    return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{s?.riders.includes('PreciousCover') ? formatRM(sa) : '-'}</td>;
                  })}
                </tr>
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '黄疸津贴' : 'Jaundice Benefit'}</td>
                  {displaySlots.map((s, i) => (
                    <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{s?.jaundiceAmount ? `RM ${s.jaundiceAmount}` : '-'}</td>
                  ))}
                </tr>

                {/* 4. Accident - Color: Red-900/80 */}
                <RowHeader title={t.pa} colorClass="bg-red-900/80" />
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '意外身故 / 伤残' : 'Acc. Death/TPD'}</td>
                  {displaySlots.map((s, i) => {
                    const val = s?.paSA || s?.riderSAs?.['Personal Accident'] || s?.riderSAs?.['PA Plus'] || 0;
                    return <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{formatRM(val)}</td>;
                  })}
                </tr>
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '意外门诊' : 'Outpatient'}</td>
                  {displaySlots.map((s, i) => (
                    <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{s?.paMinorAccident ? 'RM 2,000' : '-'}</td>
                  ))}
                </tr>
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '意外每周津贴' : 'Weekly Indemnity'}</td>
                  {displaySlots.map((s, i) => (
                    <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{s?.paWeeklyIndemnity ? `RM ${s.paWeeklyIndemnity}/周` : '-'}</td>
                  ))}
                </tr>

                {/* 5. Waiver - Color: Amber-900/80 */}
                <RowHeader title={t.waiver} colorClass="bg-amber-900/80" />
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '严重疾病时豁免保费' : 'Waiver of Premium on CI'}</td>
                  {displaySlots.map((s, i) => (
                    <td key={i} className={`text-center border-r border-slate-100 last:border-r-0 leading-tight ${slotBgClasses[i]}`}>
                      {s?.riders.includes('Payor Cover') && <div className="text-[9.5px] font-black text-amber-700">受保人 豁免</div>}
                      {s?.riders.includes('Secure Cover') && <div className="text-[9.5px] font-black text-amber-900">{s.secureCoverParent === 'Father' ? '父亲' : '母亲'} 豁免</div>}
                      {!s?.riders.includes('Payor Cover') && !s?.riders.includes('Secure Cover') && <div className={valueTextClass}>-</div>}
                    </td>
                  ))}
                </tr>

                {/* 6. Account Value - Color: Indigo-900/80 */}
                <RowHeader title={t.value} colorClass="bg-indigo-900/80" />
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '现金价值' : 'Cash Value'}</td>
                  {displaySlots.map((s, i) => <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>{s ? '有 Yes' : '-'}</td>)}
                </tr>
                <tr className={rowHClass}>
                  <td className={labelTextClass}>{lang === 'CN' ? '满期利益' : 'Maturity'}</td>
                  {displaySlots.map((s, i) => (
                    <td key={i} className={`${valueTextClass} ${slotBgClasses[i]}`}>
                      {s?.product === 'Everlink Signature' ? <span className="text-indigo-600 font-black">18% 保额奖励</span> : '-'}
                    </td>
                  ))}
                </tr>

                {/* Premium */}
                <RowHeader title={lang === 'CN' ? '预估保费 (月缴)' : 'ESTIMATED PREMIUM'} colorClass="bg-slate-900/90" />
                <tr className="bg-yellow-400 text-slate-900 h-[13px] border-b border-yellow-500/30">
                  <td className={`${labelTextClass} !bg-yellow-400 border-yellow-500/30 !text-yellow-900`}>{lang === 'CN' ? `保障至 ${ageLabel1} 岁` : `Option A: Age ${ageLabel1}`}</td>
                  {displaySlots.map((s, i) => <td key={i} className={`${valueTextClass} !border-yellow-500/30 font-black ${slotBgClasses[i]} !bg-opacity-40`}>{s ? formatRM(s.premium70) : '-'}</td>)}
                </tr>
                <tr className="bg-yellow-400 text-slate-900 h-[13px]">
                  <td className={`${labelTextClass} !bg-yellow-400 border-yellow-500/30 !text-yellow-900`}>{lang === 'CN' ? `保障至 ${ageLabel2} 岁` : `Option B: Age ${ageLabel2}`}</td>
                  {displaySlots.map((s, i) => <td key={i} className={`${valueTextClass} !border-yellow-500/30 font-black ${slotBgClasses[i]} !bg-opacity-40`}>{s ? formatRM(s.premium80) : '-'}</td>)}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="h-[70px] flex justify-between items-center border-t-[3px] border-slate-900 pt-2 mt-4 shrink-0">
            <div className="flex items-center gap-4 shrink-0">
               <ShieldCheck className="w-9 h-9 text-slate-900" />
               <div className="flex flex-col leading-tight">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">InsurePro Advisory Solution</p>
                  <p className="text-[11px] font-black text-slate-900 uppercase italic mt-1.5 opacity-80 leading-none">{t.footer}</p>
               </div>
            </div>
            
            <div className="flex items-center gap-5 text-right shrink-0">
              <div className="flex flex-col leading-none shrink-0">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.adv}</span>
                <span className="text-[18px] font-black text-slate-900 uppercase tracking-tight leading-none">{state.advisor.name || '---'}</span>
                <span className="text-blue-600 font-bold text-[11px] mt-1">{state.advisor.contact || '---'}</span>
              </div>
              {state.advisor.photo && (
                <img 
                  src={state.advisor.photo} 
                  className="w-16 h-16 rounded-2xl object-cover shrink-0" 
                  alt="Advisor" 
                  crossOrigin="anonymous"
                  decoding="sync"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default StepComparisonReport;
