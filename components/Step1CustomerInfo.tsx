
import React, { useState, useMemo } from 'react';
import { CustomerInfo } from '../types';
import { User, CalendarDays, Sparkles, ChevronDown, Check, X, CalendarCheck2 } from 'lucide-react';

interface Props {
  data: CustomerInfo;
  onChange: (data: CustomerInfo) => void;
}

const Step1CustomerInfo: React.FC<Props> = ({ data, onChange }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const calculateAge = (d: number, m: number, y: number) => {
    const today = new Date();
    const birthDate = new Date(y, m - 1, d);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  const updateDob = (updates: Partial<{ day: number; month: number; year: number }>) => {
    const newDob = { ...data.dob, ...updates };
    const maxDays = new Date(newDob.year, newDob.month, 0).getDate();
    if (newDob.day > maxDays) newDob.day = maxDays;
    
    const newAge = calculateAge(newDob.day, newDob.month, newDob.year);
    onChange({ ...data, dob: newDob, age: newAge });
  };

  const formattedDate = `${String(data.dob.day).padStart(2, '0')} / ${String(data.dob.month).padStart(2, '0')} / ${data.dob.year}`;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">客户基本资料</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Customer Profile Setup</p>
        </div>
        <div className="p-3 bg-blue-600/5 rounded-2xl border border-blue-100/50">
          <Sparkles className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      <div className="space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <User className="w-4 h-4 text-blue-500" /> 顾客姓名 (Customer Name)
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="请输入姓名"
            className="w-full px-8 py-5 rounded-[2rem] bg-white border border-slate-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all outline-none text-xl font-black text-slate-800 placeholder:text-slate-200 shadow-sm"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-500" /> 出生日期 (Date of Birth)
            </label>
            <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              年龄: {data.age} 岁
            </div>
          </div>
          
          <button 
            onClick={() => setIsPickerOpen(true)}
            className="w-full group relative flex items-center justify-between px-8 py-6 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-400 transition-all shadow-sm hover:shadow-md text-left"
          >
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">选择日期 (Day / Month / Year)</span>
              <span className="text-3xl font-black text-slate-800 tracking-tighter group-hover:text-blue-600 transition-colors">
                {formattedDate}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
              <ChevronDown className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:rotate-180" />
            </div>
          </button>
        </div>
      </div>

      {isPickerOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setIsPickerOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300 mb-20 md:mb-0">
            <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl text-white">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-800">选择出生日期</h3>
              </div>
              <button 
                onClick={() => setIsPickerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] md:max-h-none no-scrollbar">
              <ModernGridDatePicker dob={data.dob} onChange={updateDob} />
            </div>

            <div className="p-6 md:p-8 bg-slate-50/80 border-t border-slate-100 flex justify-center md:justify-end">
              <button 
                onClick={() => setIsPickerOpen(false)}
                className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> 确认并保存 (Confirm)
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 bg-blue-600/5 rounded-[2rem] border border-blue-100/50 flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm">
          <CalendarCheck2 className="w-6 h-6 text-blue-500" />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-bold">
          <span className="text-blue-600 font-black">智能计算：</span>系统已预设马来西亚保险精算逻辑，将根据您的选择自动匹配费率年龄。
        </p>
      </div>
    </div>
  );
};

const ModernGridDatePicker: React.FC<{
  dob: { day: number; month: number; year: number };
  onChange: (updates: Partial<{ day: number; month: number; year: number }>) => void;
}> = ({ dob, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => Array.from({ length: 85 }, (_, i) => currentYear - i), [currentYear]);
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  
  const dayCount = useMemo(() => {
    return new Date(dob.year, dob.month, 0).getDate();
  }, [dob.year, dob.month]);

  const days = useMemo(() => {
    return Array.from({ length: dayCount }, (_, i) => i + 1);
  }, [dayCount]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {/* Year Column */}
      <div className="space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">年份 (Year)</span>
        <div className="h-48 md:h-64 overflow-y-auto no-scrollbar rounded-3xl bg-slate-50 p-2 space-y-1 border border-slate-100 shadow-inner">
          {years.map(y => (
            <button
              key={y}
              onClick={() => onChange({ year: y })}
              className={`w-full py-3 rounded-xl text-sm font-black transition-all ${
                dob.year === y 
                ? 'bg-blue-600 text-white shadow-lg scale-[1.05]' 
                : 'text-slate-400 hover:bg-white hover:text-slate-800'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Month Column */}
      <div className="space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">月份 (Month)</span>
        <div className="grid grid-cols-3 gap-2 h-48 md:h-64 p-2 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
          {months.map((m, idx) => (
            <button
              key={m}
              onClick={() => onChange({ month: idx + 1 })}
              className={`rounded-2xl text-xs font-black transition-all ${
                dob.month === idx + 1 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-white hover:text-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Day Column */}
      <div className="space-y-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">日期 (Day)</span>
        <div className="grid grid-cols-6 gap-2 h-48 md:h-64 overflow-y-auto no-scrollbar p-3 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
          {days.map(d => (
            <button
              key={d}
              onClick={() => onChange({ day: d })}
              className={`aspect-square rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                dob.day === d 
                ? 'bg-blue-500 text-white shadow-md scale-110' 
                : 'text-slate-400 hover:bg-white hover:text-slate-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default Step1CustomerInfo;
