import { useContext, useState } from "react";
import { MdArrowBack, MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked, MdClose, MdColorLens, MdAnimation, MdBadge } from "react-icons/md";
import { motion } from "framer-motion";
import HeaderContext from "../../../contexts/VideoCreater/Header/HeaderContext";

export default function HeaderArea({ onBack }) {
  const { headers, createHeader, updateHeader, deleteHeader, activateHeader } = useContext(HeaderContext);
  const [editingId, setEditingId] = useState(null);

  // 1. Initial State with null for numbers and empty strings for text
  const initialForm = {
    name: "", 
    description: "", 
    active: false,
    backgroundColor: "#000000", 
    accentColor: "#FF0000", 
    badgeColor: "#FFFFFF", 
    textColor: "#FFFFFF",
    isBadgePresent: false, 
    badgeWidthPct: null, 
    badgePosition: "LEFT",
    accentHeightPct: null, 
    textSize: null, 
    logoSize: null,
    animCycle: null, 
    animEase: null, 
    animBuffer: null
  };

  const [formData, setFormData] = useState(initialForm);

  // 2. Reset logic
  const reset = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
  };

  const handleEdit = (header) => {
    setEditingId(header.id);
    setFormData({ ...header });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!formData.name) {
        alert("Header name is required");
        return;
    }

    // 3. Strict Type Conversion for Java Backend
    const payload = {
        ...formData,
        badgeWidthPct: parseFloat(formData.badgeWidthPct ?? 20.0),
        accentHeightPct: parseFloat(formData.accentHeightPct ?? 5.0),
        textSize: parseInt(formData.textSize ?? 24),
        logoSize: parseInt(formData.logoSize ?? 50),
        animCycle: parseFloat(formData.animCycle ?? 2.5),
        animEase: parseInt(formData.animEase ?? 1),
        animBuffer: parseInt(formData.animBuffer ?? 10)
    };

    const success = editingId ? await updateHeader(editingId, payload) : await createHeader(payload);
    if (success) reset();
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
        <span className="text-[9px] font-mono uppercase font-bold text-gray-600">{value}</span>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
      
      {/* HEADER TOP BAR */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button onClick={onBack} className="bg-gray-100 px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 hover:bg-gray-200 transition">
          <MdArrowBack/> BACK
        </button>
        <div className="text-right">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-tight">Header Style Manager</h2>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Visual Identity & Animation</span>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className={`mb-8 p-6 rounded-2xl border-2 transition-all ${editingId ? 'border-blue-200 bg-blue-50/10' : 'bg-slate-50/50 border-slate-100'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUMN 1: IDENTITY & COLORS */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-blue-600 flex items-center gap-2 uppercase"><MdColorLens size={16}/> Colors & Identity</h3>
            <input type="text" placeholder="Header Name" className="w-full border rounded-lg px-4 py-2.5 text-xs font-bold shadow-sm" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
            <textarea placeholder="Description" className="w-full border rounded-lg px-4 py-2 text-[10px] h-12 shadow-sm" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border shadow-inner">
              <ColorInput label="Background" value={formData.backgroundColor} onChange={val => setFormData({...formData, backgroundColor: val})} />
              <ColorInput label="Accent Bar" value={formData.accentColor} onChange={val => setFormData({...formData, accentColor: val})} />
              <ColorInput label="Badge Color" value={formData.badgeColor} onChange={val => setFormData({...formData, badgeColor: val})} />
              <ColorInput label="Text Color" value={formData.textColor} onChange={val => setFormData({...formData, textColor: val})} />
            </div>
          </div>

          {/* COLUMN 2: GEOMETRY & BADGE */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-blue-600 flex items-center gap-2 uppercase"><MdBadge size={16}/> Layout & Badge</h3>
            <div className="p-4 bg-white rounded-xl border shadow-sm space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] font-black text-gray-500 uppercase">Enable Badge</span>
                    <input type="checkbox" className="w-4 h-4" checked={formData.isBadgePresent} onChange={e => setFormData({...formData, isBadgePresent: e.target.checked})} />
                </div>
                
                {formData.isBadgePresent && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid grid-cols-2 gap-2 overflow-hidden">
                        <div>
                            <label className="text-[7px] font-black text-gray-400 block mb-1 uppercase">POSITION</label>
                            <select className="w-full text-[10px] border p-2 rounded font-bold bg-slate-50" value={formData.badgePosition || "LEFT"} onChange={e => setFormData({...formData, badgePosition: e.target.value})}>
                                <option value="LEFT">LEFT</option>
                                <option value="RIGHT">RIGHT</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[7px] font-black text-gray-400 block mb-1 uppercase">WIDTH %</label>
                            <input type="number" step="0.1" className="w-full border p-2 rounded text-[10px] font-bold" value={formData.badgeWidthPct ?? ""} onChange={e => setFormData({...formData, badgeWidthPct: e.target.value})} />
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-3 gap-2 border-t pt-4">
                    <div>
                        <label className="text-[7px] font-black text-gray-400 block mb-1 uppercase">ACCENT H%</label>
                        <input type="number" step="0.1" className="w-full border rounded p-2 text-[10px] font-bold" value={formData.accentHeightPct ?? ""} onChange={e => setFormData({...formData, accentHeightPct: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[7px] font-black text-gray-400 block mb-1 uppercase">TEXT PX</label>
                        <input type="number" className="w-full border rounded p-2 text-[10px] font-bold" value={formData.textSize ?? ""} onChange={e => setFormData({...formData, textSize: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[7px] font-black text-gray-400 block mb-1 uppercase">LOGO PX</label>
                        <input type="number" className="w-full border rounded p-2 text-[10px] font-bold" value={formData.logoSize ?? ""} onChange={e => setFormData({...formData, logoSize: e.target.value})} />
                    </div>
                </div>
            </div>
          </div>

          {/* COLUMN 3: ANIMATION SETTINGS */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-blue-600 flex items-center gap-2 uppercase"><MdAnimation size={16}/> Animation Logic</h3>
            <div className="p-4 bg-white rounded-xl border shadow-sm space-y-5">
                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase">Cycle Duration</label>
                        <span className="text-[10px] font-mono text-blue-600 font-bold">{formData.animCycle ?? 2.5}s</span>
                    </div>
                    <input type="range" min="0.5" max="10" step="0.1" className="w-full accent-blue-600" value={formData.animCycle ?? 2.5} onChange={e => setFormData({...formData, animCycle: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[8px] font-black text-gray-400 block mb-1 uppercase">Ease Type</label>
                        <input type="number" className="w-full border rounded p-2 text-xs font-bold bg-slate-50" value={formData.animEase ?? ""} onChange={e => setFormData({...formData, animEase: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[8px] font-black text-gray-400 block mb-1 uppercase">Buffer PX</label>
                        <input type="number" className="w-full border rounded p-2 text-xs font-bold bg-slate-50" value={formData.animBuffer ?? ""} onChange={e => setFormData({...formData, animBuffer: e.target.value})} />
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={handleSubmit} className="flex-1 bg-black text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-lg active:scale-[0.98]">
            {editingId ? "Update Header Config" : "Create Header Style"}
          </button>
          {(editingId || formData.name) && (
            <button onClick={reset} className="px-6 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-100 transition">
              <MdClose size={24}/>
            </button>
          )}
        </div>
      </div>

      {/* LIST TABLE */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 uppercase border-b bg-gray-50">
              <th className="p-4 text-left w-12">Active</th>
              <th className="p-4 text-left">Header Profile</th>
              <th className="p-4 text-center">Visual Breakdown</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {headers.map(h => (
              <tr key={h.id} className={`border-b last:border-0 hover:bg-slate-50/80 transition-colors ${h.active ? 'bg-blue-50/20' : ''}`}>
                <td className="p-4 text-center">
                  <button onClick={() => activateHeader(h.id)} className="transition active:scale-90">
                    {h.active ? <MdCheckCircle className="text-blue-500" size={24}/> : <MdRadioButtonUnchecked className="text-gray-200" size={24}/>}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800 uppercase tracking-tight">{h.name}</span>
                    <span className="text-[9px] text-gray-400 font-bold truncate max-w-[200px]">{h.description || "No description provided"}</span>
                  </div>
                </td>
                <td className="p-4">
                   <div className="flex flex-col items-center gap-1.5">
                      <div className="w-16 h-4 rounded border flex overflow-hidden shadow-sm">
                         <div style={{backgroundColor: h.backgroundColor, flex: 3}} title="Background" />
                         <div style={{backgroundColor: h.accentColor, flex: 1}} title="Accent" />
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 rounded uppercase">{h.textSize}PX</span>
                        <span className="text-[8px] font-black text-purple-600 bg-purple-50 px-1.5 rounded uppercase">{h.animCycle}S</span>
                      </div>
                   </div>
                </td>
                <td className="p-4 text-right">
                   <div className="flex justify-end gap-1">
                     <button onClick={() => handleEdit(h)} className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg transition-colors"><MdEdit size={18}/></button>
                     <button onClick={() => deleteHeader(h.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors"><MdDelete size={18}/></button>
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