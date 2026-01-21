
import React, { useRef } from 'react';
import { AVAILABLE_PRODUCTS, PRODUCT_RIDERS } from '../constants';
import { ProductSlot } from '../types';
import { Package, Plus, Trash2, CheckCircle2, ShieldPlus, Edit3, Layers } from 'lucide-react';

interface Props {
  slots: ProductSlot[];
  onChange: (slots: ProductSlot[]) => void;
}

const StepProductSelection: React.FC<Props> = ({ slots, onChange }) => {
  const updateNameAt = (index: number, name: string) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], name };
    onChange(newSlots);
  };

  const updateProductAt = (index: number, productName: string) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], product: productName, riders: [], riderSAs: {} };
    onChange(newSlots);
  };

  const toggleRiderAt = (slotIdx: number, riderName: string) => {
    const newSlots = [...slots];
    const currentRiders = newSlots[slotIdx].riders;
    const currentRiderSAs = { ...newSlots[slotIdx].riderSAs };

    if (currentRiders.includes(riderName)) {
      newSlots[slotIdx].riders = currentRiders.filter(r => r !== riderName);
      delete currentRiderSAs[riderName];
    } else {
      newSlots[slotIdx].riders = [...currentRiders, riderName];
      currentRiderSAs[riderName] = 0; // Initialize with 0
    }
    newSlots[slotIdx].riderSAs = currentRiderSAs;
    onChange(newSlots);
  };

  const addSlot = () => {
    if (slots.length >= 4) return;
    const nextLetter = String.fromCharCode(65 + slots.length);
    const newIdx = slots.length;
    // Fix: Added missing ciTier to ProductSlot initialization to resolve TS error on line 45
    onChange([...slots, { 
      name: `方案 ${nextLetter}`, 
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
    }]);

    // Smooth scroll to the new slot after render
    setTimeout(() => {
      const newSlotElement = document.getElementById(`slot-card-${newIdx}`);
      if (newSlotElement) {
        newSlotElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const removeSlot = (index: number) => {
    if (slots.length <= 1) {
      // Fix: Added missing ciTier to ProductSlot initialization to resolve TS error on line 70
      onChange([{ 
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
      }]);
      return;
    }
    onChange(slots.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">方案配置与对比</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Configure multiple quotations for comparison</p>
        </div>
        <div className="bg-blue-600/5 px-4 py-2 rounded-2xl border border-blue-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-black text-blue-600">共 {slots.length}/4 个并行方案</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {slots.map((slot, slotIdx) => (
          <div 
            key={slotIdx} 
            id={`slot-card-${slotIdx}`}
            className="group relative bg-white/60 rounded-[3.5rem] p-1 border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)] transition-all duration-500 scroll-mt-32"
          >
            {/* Slot Banner */}
            <div className="absolute top-0 left-12 transform -translate-y-1/2">
               <div className="bg-slate-900 text-white px-6 py-2 rounded-2xl flex items-center gap-3 shadow-xl">
                 <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] font-black">
                   {String.fromCharCode(65 + slotIdx)}
                 </div>
                 <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={slot.name}
                      onChange={(e) => updateNameAt(slotIdx, e.target.value)}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none border-b border-transparent focus:border-blue-400 w-24 transition-all"
                    />
                    <Edit3 className="w-3 h-3 text-slate-500 opacity-50" />
                 </div>
               </div>
            </div>

            <div className="p-10 pt-12 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 ml-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">选择主险产品 (Select Base Product)</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {AVAILABLE_PRODUCTS.map((pName) => {
                    const isSelected = slot.product === pName;
                    return (
                      <button
                        key={pName}
                        onClick={() => updateProductAt(slotIdx, pName)}
                        className={`relative p-5 rounded-3xl border-2 transition-all duration-500 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-600 text-white shadow-[0_15px_30px_-5px_rgba(37,99,235,0.3)] z-10'
                            : 'border-slate-100 bg-white/50 text-slate-500 hover:border-blue-200 hover:bg-white'
                        }`}
                      >
                        <div className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {pName}
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {slot.product ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 ml-2">
                    <ShieldPlus className="w-4 h-4 text-blue-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">附加保障配置 (Rider Options)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                    {PRODUCT_RIDERS[slot.product].map(rider => {
                      const isSelected = slot.riders.includes(rider);
                      return (
                        <button
                          key={rider}
                          onClick={() => toggleRiderAt(slotIdx, rider)}
                          className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            isSelected
                            ? 'bg-slate-900 text-white shadow-lg'
                            : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-400 hover:text-blue-500'
                          }`}
                        >
                          {rider}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3">
                  <Package className="w-8 h-8 text-slate-200" />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">请选择一个主险产品以开始配置</p>
                </div>
              )}
            </div>

            {slots.length > 1 && (
              <button 
                onClick={() => removeSlot(slotIdx)}
                className="absolute top-8 right-8 p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        {slots.length < 4 && (
          <button
            onClick={addSlot}
            className="group w-full py-10 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-3"
          >
            <div className="p-4 bg-white rounded-3xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-110">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">添加新对比方案 (New Quote)</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StepProductSelection;
