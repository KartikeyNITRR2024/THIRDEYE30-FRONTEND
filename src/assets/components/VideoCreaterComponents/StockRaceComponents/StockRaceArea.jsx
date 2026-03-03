import { useContext, useState } from "react";
import { 
  MdArrowBack, MdEdit, MdDelete, MdCheckCircle, 
  MdRadioButtonUnchecked, MdClose, MdPalette, MdTextFields, 
  MdBarChart, MdFormatPaint, MdSettingsInputComponent 
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import StockRaceContext from "../../../contexts/VideoCreater/StockRace/StockRaceContext";

export default function StockRaceArea({ onBack }) {
  const { stockRaces, createStockRace, updateStockRace, deleteStockRace, activateStockRace } = useContext(StockRaceContext);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    name: "",
    description: "",
    active: false,
    accentColor: "#FFD700",
    textColor: "#FFFFFF",
    bgBadgeColor: "#000000",
    barAlpha: 0.8,
    glowSize: 10,
    barColors: ["#FF5733", "#33FF57", "#3357FF"],
    baseFontSize: 16,
    labelFontSize: 14,
    valueFontSize: 18,
    clockFontSize: 32,
    barHeight: 25.0,
    topN: 10,
    xLimitMultiplier: 1.2
  };

  const [formData, setFormData] = useState(initialForm);

  const reset = () => { setEditingId(null); setFormData(initialForm); };

  const handleEdit = (race) => {
    setEditingId(race.id);
    setFormData({ ...initialForm, ...race });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBarColorChange = (index, value) => {
    const newColors = [...formData.barColors];
    newColors[index] = value;
    setFormData({ ...formData, barColors: newColors });
  };

  const addColor = () => setFormData({ ...formData, barColors: [...formData.barColors, "#6366f1"] });
  const removeColor = (index) => setFormData({ ...formData, barColors: formData.barColors.filter((_, i) => i !== index) });

  const handleSubmit = async () => {
    if (!formData.name) return;
    
    const payload = {
        ...formData,
        barAlpha: parseFloat(formData.barAlpha),
        barHeight: parseFloat(formData.barHeight),
        xLimitMultiplier: parseFloat(formData.xLimitMultiplier),
        glowSize: parseInt(formData.glowSize),
        baseFontSize: parseInt(formData.baseFontSize),
        labelFontSize: parseInt(formData.labelFontSize),
        valueFontSize: parseInt(formData.valueFontSize),
        clockFontSize: parseInt(formData.clockFontSize),
        topN: parseInt(formData.topN)
    };

    const success = editingId ? await updateStockRace(editingId, payload) : await createStockRace(payload);
    if (success) reset();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button onClick={onBack} className="bg-slate-100 px-4 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 hover:bg-slate-800 hover:text-white transition-all uppercase tracking-widest shadow-sm">
          <MdArrowBack size={16}/> BACK
        </button>
        <div className="text-right">
          <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Stock Race Visualizer</h2>
          <span className="text-[10px] text-purple-500 font-bold uppercase tracking-[2px]">Dynamic Bar Chart Engine</span>
        </div>
      </div>

      {/* EDITOR PANEL */}
      <div className={`mb-8 p-6 rounded-2xl border-2 transition-all shadow-sm ${editingId ? 'border-purple-400 bg-purple-50/20' : 'bg-slate-50/50 border-slate-100 border-dashed'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MdFormatPaint className={editingId ? "text-purple-500" : ""} size={18}/>
                {editingId ? "Modify Rendering Profile" : "Create New Visual Profile"}
            </h3>
            {editingId && (
                <button onClick={reset} className="text-rose-500 bg-white border px-3 py-1 rounded-full text-[9px] font-black hover:bg-rose-50 transition shadow-sm uppercase flex items-center gap-1">
                    <MdClose /> Cancel Session
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GROUP 1: IDENTITY & THEME */}
          <div className="space-y-5">
            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Profile Name</label>
                    <input type="text" placeholder="e.g. Bullish High Contrast" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-purple-500 transition-all shadow-sm bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Visual Concept</label>
                    <textarea placeholder="Describe the intended look..." className="w-full border-2 rounded-xl px-4 py-2 text-xs h-20 shadow-sm outline-none focus:border-purple-500 bg-white resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
            </div>
            
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm space-y-3">
                <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Core UI Colors</span>
                <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="text-[10px] font-bold text-slate-600 tracking-tight">ACCENT COLOR</span>
                    <input type="color" className="w-8 h-8 rounded-lg cursor-pointer border-2 border-white shadow-sm" value={formData.accentColor} onChange={e => setFormData({...formData, accentColor: e.target.value})} />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="text-[10px] font-bold text-slate-600 tracking-tight">TEXT OVERLAY</span>
                    <input type="color" className="w-8 h-8 rounded-lg cursor-pointer border-2 border-white shadow-sm" value={formData.textColor} onChange={e => setFormData({...formData, textColor: e.target.value})} />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="text-[10px] font-bold text-slate-600 tracking-tight">BADGE BACKDROP</span>
                    <input type="color" className="w-8 h-8 rounded-lg cursor-pointer border-2 border-white shadow-sm" value={formData.bgBadgeColor} onChange={e => setFormData({...formData, bgBadgeColor: e.target.value})} />
                </div>
            </div>
          </div>

          {/* GROUP 2: TYPOGRAPHY & BAR COLORS */}
          <div className="space-y-5">
            <div className="space-y-1">
                <h3 className="text-[10px] font-black text-purple-600 flex items-center gap-2 uppercase mb-3"><MdTextFields/> Typography Engine (px)</h3>
                <div className="grid grid-cols-2 gap-4 p-5 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
                    <div><label className="text-[8px] font-black text-slate-400 block mb-1 uppercase tracking-wider">Base Size</label><input type="number" className="w-full border-b-2 py-2 text-xs font-bold outline-none focus:border-purple-400" value={formData.baseFontSize} onChange={e => setFormData({...formData, baseFontSize: e.target.value})} /></div>
                    <div><label className="text-[8px] font-black text-slate-400 block mb-1 uppercase tracking-wider">Label Size</label><input type="number" className="w-full border-b-2 py-2 text-xs font-bold outline-none focus:border-purple-400" value={formData.labelFontSize} onChange={e => setFormData({...formData, labelFontSize: e.target.value})} /></div>
                    <div><label className="text-[8px] font-black text-slate-400 block mb-1 uppercase tracking-wider">Value Size</label><input type="number" className="w-full border-b-2 py-2 text-xs font-bold outline-none focus:border-purple-400" value={formData.valueFontSize} onChange={e => setFormData({...formData, valueFontSize: e.target.value})} /></div>
                    <div><label className="text-[8px] font-black text-slate-400 block mb-1 uppercase tracking-wider">Clock Size</label><input type="number" className="w-full border-b-2 py-2 text-xs font-bold outline-none focus:border-purple-400" value={formData.clockFontSize} onChange={e => setFormData({...formData, clockFontSize: e.target.value})} /></div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-[10px] font-black text-purple-600 uppercase">Race Bar Palette</h3>
                <div className="flex flex-wrap gap-2.5 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-inner min-h-[60px]">
                    <AnimatePresence>
                        {formData.barColors.map((color, idx) => (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key={idx} className="relative group">
                                <input type="color" value={color} onChange={e => handleBarColorChange(idx, e.target.value)} className="w-8 h-8 rounded-xl cursor-pointer shadow-sm border-2 border-slate-50" />
                                <button onClick={() => removeColor(idx)} className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><MdClose size={10}/></button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <button onClick={addColor} className="w-8 h-8 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 flex items-center justify-center font-bold text-lg hover:border-purple-400 hover:text-purple-500 transition-all">+</button>
                </div>
            </div>
          </div>

          {/* GROUP 3: GEOMETRY */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-black text-purple-600 flex items-center gap-2 uppercase"><MdSettingsInputComponent/> Physics & Geometry</h3>
            <div className="p-5 bg-white rounded-2xl border-2 border-slate-100 shadow-sm space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 block mb-1 uppercase tracking-widest">Bar Height</label>
                        <input type="number" step="0.1" className="w-full border rounded-lg p-2 text-xs font-bold bg-slate-50 focus:bg-white transition-colors" value={formData.barHeight} onChange={e => setFormData({...formData, barHeight: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 block mb-1 uppercase tracking-widest">Active Top N</label>
                        <input type="number" className="w-full border rounded-lg p-2 text-xs font-bold bg-slate-50 focus:bg-white transition-colors" value={formData.topN} onChange={e => setFormData({...formData, topN: e.target.value})} />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 block mb-1 uppercase tracking-widest">X-Limit Expansion (Multiplier)</label>
                    <input type="number" step="0.1" className="w-full border rounded-lg p-2 text-xs font-bold bg-slate-50 focus:bg-white transition-colors" value={formData.xLimitMultiplier} onChange={e => setFormData({...formData, xLimitMultiplier: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 block mb-1 uppercase tracking-widest">Bar Alpha</label>
                        <input type="range" step="0.1" max="1" min="0" className="w-full accent-purple-500" value={formData.barAlpha} onChange={e => setFormData({...formData, barAlpha: e.target.value})} />
                        <div className="text-[8px] font-bold text-center text-slate-400">{formData.barAlpha}</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 block mb-1 uppercase tracking-widest">Glow Radius</label>
                        <input type="number" className="w-full border rounded-lg p-2 text-xs font-bold bg-slate-50 focus:bg-white transition-colors" value={formData.glowSize} onChange={e => setFormData({...formData, glowSize: e.target.value})} />
                    </div>
                </div>
            </div>
            
            <button onClick={handleSubmit} className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[3px] hover:bg-purple-700 transition-all shadow-lg active:scale-[0.97] flex items-center justify-center gap-2 mt-4">
               {editingId ? "Commit Rendering Updates" : "Deploy Visual Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* REPOSITORY TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase border-b bg-slate-50/50 tracking-wider">
              <th className="p-4 text-center w-20">Live</th>
              <th className="p-4 text-left">Configuration Profile</th>
              <th className="p-4 text-center">Color Signature</th>
              <th className="p-4 text-right">Utility</th>
            </tr>
          </thead>
          <tbody>
            {stockRaces.map(race => (
              <tr key={race.id} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${race.active ? 'bg-purple-50/20' : ''}`}>
                <td className="p-4 text-center">
                  <button onClick={() => activateStockRace(race.id)} className="transition-transform active:scale-90">
                    {race.active ? <MdCheckCircle className="text-purple-500" size={26}/> : <MdRadioButtonUnchecked className="text-slate-200 hover:text-purple-300" size={26}/>}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight mb-0.5">{race.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter truncate max-w-[200px]">{race.description || "System Standard Layout"}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center -space-x-2">
                    {race.barColors?.slice(0, 5).map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100" style={{backgroundColor: c}} title={c} />
                    ))}
                    {race.barColors?.length > 5 && (
                        <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-[7px] font-black text-white shadow-sm ring-1 ring-slate-100">
                            +{race.barColors.length - 5}
                        </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                   <div className="flex justify-end gap-1">
                     <button onClick={() => handleEdit(race)} className="text-sky-500 hover:bg-white hover:border-sky-100 border border-transparent p-2 rounded-xl transition-all shadow-sm"><MdEdit size={18}/></button>
                     <button onClick={() => deleteStockRace(race.id)} className="text-slate-300 hover:text-rose-500 p-2 rounded-xl transition-colors"><MdDelete size={18}/></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}