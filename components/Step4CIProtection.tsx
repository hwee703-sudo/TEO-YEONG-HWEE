
import React, { useMemo, useEffect } from 'react';
import { CIProtection } from '../types';
import { CI_RULES } from '../constants';
import { Activity, Thermometer, FlaskConical, Plus, ShieldCheck } from 'lucide-react';

interface Props {
  data: CIProtection;
  onChange: (data: CIProtection) => void;
}

const Step4CIProtection: React.FC<Props> = ({ data, onChange }) => {
  const calculatePayouts = useMemo(() => {
    const tiersSorted = [...data.tiers].sort((a, b) => parseInt(b) - parseInt(a));
    const highestTier = tiersSorted[0] || '36';
    const rule = CI_RULES[highestTier];
    
    return {
      severe: data.totalSA * rule.severe,
      intermediate: data.totalSA * rule.intermediate,
      early: data.totalSA * rule.early,
      diabetes_recovery: rule.diabetes_recovery,
      cancer_recovery: rule.cancer_recovery
    };
  }, [data.tiers, data.totalSA]);

  useEffect(() => {
    if (JSON.stringify(calculatePayouts) !== JSON.stringify(data.payouts)) {
      onChange({ ...data, payouts: calculatePayouts });
    }
  }, [calculatePayouts]);

  const toggleTier = (tier: '36' | '77' | '157') => {
    const newTiers = data.tiers.includes(tier)
      ? data.tiers.filter(t => t !== tier)
      : [...data.tiers, tier];
    if (newTiers.length === 0) return;
    onChange({ ...data, tiers: newTiers });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">疾病保障</h2>
        <p className="text-slate-400 font-medium mt-1">负责康复期间的经济支柱与生活品质。</p>
      </div>

      <div className="space-y-5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
          <ShieldCheck className="w-4 h-4 text-blue-500" /> 1. 疾病覆盖深度
        </p>
        <div className="grid grid-cols-3 gap-3">
          {(['36', '77', '157'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => toggleTier(tier)}
              className={`group relative p-6 rounded-[2rem] border-2 flex flex-col items-center gap-2 transition-all ${
                data.tiers.includes(tier)
                ? 'border-blue-500 bg-blue-500/5 shadow-inner'
                : 'border-white/60 bg-white/20 text-slate-400 hover:bg-white/40'
              }`}
            >
              <span className={`text-4xl font-black ${data.tiers.includes(tier) ? 'text-blue-600' : 'text-slate-300'}`}>{tier}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">种疾病</span>
              {data.tiers.includes(tier) && <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-ping" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
          <Activity className="w-4 h-4 text-blue-500" /> 2. 总疾病保额
        </label>
        <div className="relative">
           <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-blue-300">RM</span>
           <input
            type="number"
            value={data.totalSA}
            onChange={(e) => onChange({ ...data, totalSA: parseInt(e.target.value) || 0 })}
            className="w-full pl-20 pr-6 py-6 text-4xl font-black text-blue-600 rounded-[2rem] bg-white/50 border border-white/60 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            step={5000}
          />
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">赔付明细预计</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-red-500/5 rounded-[2rem] border border-red-200/40 text-center">
            <p className="text-[10px] text-red-500 font-black uppercase mb-2">严重 Severe</p>
            <p className="text-2xl font-black text-slate-800">RM {calculatePayouts.severe.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-orange-500/5 rounded-[2rem] border border-orange-200/40 text-center">
            <p className="text-[10px] text-orange-500 font-black uppercase mb-2">中期 Intermediate</p>
            <p className="text-2xl font-black text-slate-800">RM {calculatePayouts.intermediate.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-green-500/5 rounded-[2rem] border border-green-200/40 text-center">
            <p className="text-[10px] text-green-500 font-black uppercase mb-2">初期 Early</p>
            <p className="text-2xl font-black text-slate-800">RM {calculatePayouts.early.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {calculatePayouts.diabetes_recovery && (
        <div className="flex flex-wrap gap-3">
          <div className="px-5 py-2 bg-white/60 backdrop-blur-md text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/60 shadow-sm">
            <Plus className="w-3 h-3 text-blue-500" /> 糖尿病康复金: RM {calculatePayouts.diabetes_recovery.toLocaleString()}
          </div>
          <div className="px-5 py-2 bg-white/60 backdrop-blur-md text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/60 shadow-sm">
            <Plus className="w-3 h-3 text-blue-500" /> 癌症特殊奖励: RM {calculatePayouts.cancer_recovery?.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4CIProtection;
