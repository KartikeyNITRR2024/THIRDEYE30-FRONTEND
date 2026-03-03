import { useContext, useState } from "react";
import { 
  MdArrowBack, MdEdit, MdDelete, MdCheckCircle, 
  MdRadioButtonUnchecked, MdClose, MdPalette, MdTextFields, 
  MdBarChart, MdFormatPaint, MdSettingsInputComponent, MdAdd, MdStyle, MdColorLens
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import StockRaceContext from "../../../contexts/VideoCreater/StockRace/StockRaceContext";

export default function StockRaceArea({ onBack }) {
  const { stockRaces, createStockRace, updateStockRace, deleteStockRace, activateStockRace } = useContext(StockRaceContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Requirement: All starting variables must be null
  const initialForm = {
    name: "",
    description: "",
    active: false,
    accentColor: null,
    textColor: null,
    bgBadgeColor: null,
    barAlpha: null,
    glowSize: null,
    barColors: [], // Start with empty array
    baseFontSize: null,
    labelFontSize: null,
    valueFontSize: null,
    clockFontSize: null,
    barHeight: null,
    topN: null,
    xLimitMultiplier: null
  };

  const [formData, setFormData] = useState(initialForm);

  // Standardized Reset & Modal Logic
  const resetForm = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const startEdit = (race) => {
    setEditingId(race.id);
    setFormData({ ...race });
    setIsModalOpen(true);
  };

  const handleBarColorChange = (index, value) => {
    const newColors = [...formData.barColors];
    newColors[index] = value;
    setFormData({ ...formData, barColors: newColors });
  };

  const addColor = () => setFormData({ ...formData, barColors: [...(formData.barColors || []), "#6366f1"] });
  const removeColor = (index) => setFormData({ ...formData, barColors: formData.barColors.filter((_, i) => i !== index) });

  const handleSubmit = async () => {
    if (!formData.name) {
        alert("Profile name is required");
        return;
    }
    
    // Strict Type Conversion for Backend
    const payload = {
        ...formData,
        accentColor: formData.accentColor || "#FFD700",
        textColor: formData.textColor || "#FFFFFF",
        bgBadgeColor: formData.bgBadgeColor || "#000000",
        barAlpha: parseFloat(formData.barAlpha ?? 0.8),
        barHeight: parseFloat(formData.barHeight ?? 25.0),
        xLimitMultiplier: parseFloat(formData.xLimitMultiplier ?? 1.2),
        glowSize: parseInt(formData.glowSize ?? 10),
        baseFontSize: parseInt(formData.baseFontSize ?? 16),
        labelFontSize: parseInt(formData.labelFontSize ?? 14),
        valueFontSize: parseInt(formData.valueFontSize ?? 18),
        clockFontSize: parseInt(formData.clockFontSize ?? 32),
        topN: parseInt(formData.topN ?? 10),
        barColors: formData.barColors.length > 0 ? formData.barColors : ["#FF5733", "#33FF57", "#3357FF"]
    };

    const success = editingId ? await updateStockRace(editingId, payload) : await createStockRace(payload);
    if (success) resetForm();
  };

  const ColorInput = ({ label, value, onChange }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[8px] font-black text-gray-400 uppercase">{label}</label>
      <div className="flex items-center gap-2 bg-white p-1 rounded border shadow-sm">
        <input 
            type="color" 
            value={value || "#000000"} 
            onChange={e => onChange(e.target.value)} 
            className="w-6 h-6 border-0 cursor-pointer rounded overflow-hidden" 
        />
        <span className="text-[9px] font-mono uppercase font-bold text-gray-600">{value || "NONE"}</span>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6">
      
      {/* TOP HEADER BAR (VideoArea Style) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div>
                <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Stock Race Console</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stockRaces.length} RENDERING PROFILES</span>
                </div>
            </div>
        </div>
        
        <button 
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
        >
            <MdAdd size={18} /> New Visual Profile
        </button>
      </div>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
              {/* MODAL HEADER */}
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${editingId ? 'bg-purple-600 text-white' : 'bg-slate-800 text-white'}`}>
                        {editingId ? <MdStyle size={20} /> : <MdAdd size={20} />}
                    </div>
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
                        {editingId ? "Modify Rendering Profile" : "Create New Profile"}
                    </h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition">
                    <MdClose size={24} />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* COL 1: IDENTITY & COLORS */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-purple-600 flex items-center gap-2 uppercase"><MdColorLens size={16}/> Theme Identity</h3>
                    <input type="text" placeholder="Profile Name" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-purple-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <textarea placeholder="Description..." className="w-full border-2 rounded-xl px-4 py-2 text-[10px] h-20 resize-none outline-none focus:border-purple-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border">
                      <ColorInput label="Accent" value={formData.accentColor} onChange={val => setFormData({...formData, accentColor: val})} />
                      <ColorInput label="Text" value={formData.textColor} onChange={val => setFormData({...formData, textColor: val})} />
                      <ColorInput label="Badge" value={formData.bgBadgeColor} onChange={val => setFormData({...formData, bgBadgeColor: val})} />
                    </div>
                  </div>

                  {/* COL 2: TYPOGRAPHY & PALETTE */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-purple-600 flex items-center gap-2 uppercase"><MdTextFields size={16}/> Typography</h3>
                    <div className="p-4 bg-slate-50 rounded-xl border grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                           <label className="text-[8px] font-black text-slate-400 uppercase">Base Px</label>
                           <input type="number" className="w-full border-2 rounded-lg p-1.5 text-center text-[10px] font-bold" value={formData.baseFontSize ?? ""} onChange={e => setFormData({...formData, baseFontSize: e.target.value})} />
                        </div>
                        <div className="flex flex-col gap-1">
                           <label className="text-[8px] font-black text-slate-400 uppercase">Label Px</label>
                           <input type="number" className="w-full border-2 rounded-lg p-1.5 text-center text-[10px] font-bold" value={formData.labelFontSize ?? ""} onChange={e => setFormData({...formData, labelFontSize: e.target.value})} />
                        </div>
                        <div className="flex flex-col gap-1">
                           <label className="text-[8px] font-black text-slate-400 uppercase">Value Px</label>
                           <input type="number" className="w-full border-2 rounded-lg p-1.5 text-center text-[10px] font-bold" value={formData.valueFontSize ?? ""} onChange={e => setFormData({...formData, valueFontSize: e.target.value})} />
                        </div>
                        <div className="flex flex-col gap-1">
                           <label className="text-[8px] font-black text-slate-400 uppercase">Clock Px</label>
                           <input type="number" className="w-full border-2 rounded-lg p-1.5 text-center text-[10px] font-bold" value={formData.clockFontSize ?? ""} onChange={e => setFormData({...formData, clockFontSize: e.target.value})} />
                        </div>
                    </div>
                    <h3 className="text-[10px] font-black text-purple-600 uppercase">Race Bar Palette</h3>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border min-h-[50px]">
                        {formData.barColors?.map((color, idx) => (
                            <div key={idx} className="relative group">
                                <input type="color" value={color} onChange={e => handleBarColorChange(idx, e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer border shadow-sm" />
                                <button onClick={() => removeColor(idx)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><MdClose size={8}/></button>
                            </div>
                        ))}
                        <button onClick={addColor} className="w-7 h-7 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 flex items-center justify-center font-bold hover:border-purple-400 hover:text-purple-500">+</button>
                    </div>
                  </div>

                  {/* COL 3: GEOMETRY & PHYSICS */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-purple-600 flex items-center gap-2 uppercase"><MdSettingsInputComponent size={16}/> Geometry</h3>
                    <div className="p-4 bg-slate-50 rounded-xl border space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase">Bar Height</label>
                                <input type="number" step="0.1" className="border-2 rounded-lg p-1.5 text-center text-[10px] font-bold" value={formData.barHeight ?? ""} onChange={e => setFormData({...formData, barHeight: e.target.value})} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase">Top N</label>
                                <input type="number" className="border-2 rounded-lg p-1.5 text-center text-[10px] font-bold" value={formData.topN ?? ""} onChange={e => setFormData({...formData, topN: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase">X-Limit Multiplier</label>
                            <input type="number" step="0.1" className="w-full border-2 rounded-lg p-1.5 text-[10px] font-bold" value={formData.xLimitMultiplier ?? ""} onChange={e => setFormData({...formData, xLimitMultiplier: e.target.value})} />
                        </div>
                        <div className="pt-2 border-t space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[8px] font-black text-slate-400 uppercase">Bar Alpha</label>
                                <span className="text-[10px] font-mono text-purple-600 font-bold">{formData.barAlpha ?? 0.8}</span>
                            </div>
                            <input type="range" step="0.1" max="1" min="0" className="w-full accent-slate-800" value={formData.barAlpha ?? 0.8} onChange={e => setFormData({...formData, barAlpha: e.target.value})} />
                            <div className="flex justify-between items-center">
                                <label className="text-[8px] font-black text-slate-400 uppercase">Glow Radius</label>
                                <input type="number" className="w-20 border-2 rounded-lg p-1.5 text-center text-[10px] font-bold" value={formData.glowSize ?? ""} onChange={e => setFormData({...formData, glowSize: e.target.value})} />
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:bg-slate-50 transition">Cancel</button>
                <button 
                    onClick={handleSubmit} 
                    className="flex-[2] py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[2px] hover:bg-purple-700 transition-all shadow-lg active:scale-95">
                    {editingId ? "Update Visual Profile" : "Save Visual Profile"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GRID LIST (VideoArea Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {stockRaces.map((race) => (
          <motion.div layout key={race.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${race.active ? 'bg-purple-500' : 'bg-slate-200'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[150px]">
                  <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate">{race.name}</h4>
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {race.barColors?.slice(0, 4).map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-white shadow-inner" style={{backgroundColor: c}} />
                    ))}
                    {race.barColors?.length > 4 && (
                        <div className="w-4 h-4 rounded-full bg-slate-800 border border-white flex items-center justify-center text-[6px] text-white">+{race.barColors.length - 4}</div>
                    )}
                  </div>
              </div>
              <div className="flex gap-1">
                  <button onClick={() => activateStockRace(race.id)} className="p-2 hover:bg-purple-50 rounded-lg transition text-purple-500">
                    {race.active ? <MdCheckCircle size={20}/> : <MdRadioButtonUnchecked className="text-slate-200" size={20}/>}
                  </button>
                  <button onClick={() => startEdit(race)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"><MdEdit size={18}/></button>
                  <button onClick={() => deleteStockRace(race.id)} className="p-2 text-slate-300 hover:text-rose-500 transition"><MdDelete size={18}/></button>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 mt-4 pt-4 border-t border-slate-50">
               <span>Top {race.topN} Bars</span>
               <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">Height: {race.barHeight}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}