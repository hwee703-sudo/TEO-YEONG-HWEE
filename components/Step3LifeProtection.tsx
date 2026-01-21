
import React from 'react';
import { LifeProtection } from '../types';
import { Heart, Info, Target } from 'lucide-react';

interface Props {
  data: LifeProtection;
  onChange: (data: LifeProtection) => void;
}

const Step3LifeProtection: React.FC<Props> = ({ data, onChange }) => {
  const handleSAChange = (sa: number) => {
    onChange({
      ...data,
      basicSumAssured: sa,
      loyaltyBonus: sa * 0.18
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">人寿保障</h2>
        <p className="text-slate-400 font-medium mt-1">负责家庭责任与长期资产底气。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" /> 基本保额 (Sum Assured)
              </label>
              <div className="text-2xl font-black text-blue-600">RM {data.basicSumAssured.toLocaleString()}</div>
            </div>
            <div className="relative group">
               <input
                type="range"
                min={50000}
                max={1000000}
                step={10000}
                value={data.basicSumAssured}
                onChange={(e) => handleSAChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200/50 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all hover:h-3"
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
              <span>RM 50k</span>
              <span>RM 500k</span>
              <span>RM 1,000k</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white/40 rounded-3xl border border-white/60">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">供款期</p>
              <p className="text-xl font-black text-slate-700">20 年 <span className="text-blue-500 font-medium text-xs">Fixed</span></p>
            </div>
            <div className="p-1 bg-slate-100/50 rounded-[2rem] flex">
                {[70, 80].map(age => (
                  <button
                    key={age}
                    onClick={() => onChange({ ...data, coverageTerm: age as any })}
                    className={`flex-1 py-3 px-4 rounded-[1.75rem] text-xs font-black transition-all ${
                      data.coverageTerm === age 
                      ? 'bg-white text-blue-600 shadow-sm border border-white/60' 
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    至 {age} 岁
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="relative group h-full">
           <div className="absolute -inset-1 bg-blue-400 rounded-3xl blur opacity-10 group-hover:opacity-20 transition"></div>
           <div className="relative h-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl rounded-3xl p-6 border border-white/60 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-white p-2 rounded-xl shadow-sm">
                   <Heart className="w-4 h-4 text-pink-500" />
                </div>
                <span className="font-black text-[10px] text-slate-500 uppercase tracking-widest">Loyalty Bonus</span>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">RM {data.loyaltyBonus.toLocaleString()}</p>
                <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-tighter">第 30 年起特殊奖励</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/40 rounded-2xl border border-white/40 text-[10px] font-medium leading-relaxed italic text-slate-500">
              * 保额 × 18% <br/>
              * 为非保证奖励项目
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-500/5 rounded-[2rem] border border-blue-100/50 flex gap-4 items-start">
        <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          此计划重点在于<span className="text-blue-600 font-bold">高杠杆人寿保障</span>。现金价值主要作为后期缓缴保费或忠诚奖励。
        </p>
      </div>
    </div>
  );
};

export default Step3LifeProtection;
