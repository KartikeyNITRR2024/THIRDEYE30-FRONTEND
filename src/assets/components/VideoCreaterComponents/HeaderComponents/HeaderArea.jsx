import { useContext, useState } from "react";
import { 
  MdArrowBack, MdEdit, MdDelete, MdCheckCircle, 
  MdRadioButtonUnchecked, MdClose, MdColorLens, 
  MdAnimation, MdBadge, MdAdd, MdStyle, MdPhotoSizeSelectActual
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import HeaderContext from "../../../contexts/VideoCreater/Header/HeaderContext";

export default function HeaderArea({ onBack }) {
  const { headers, createHeader, updateHeader, deleteHeader, activateHeader } = useContext(HeaderContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    name: "", 
    description: "", 
    active: false,
    backgroundColor: "", 
    accentColor: "", 
    badgeColor: "", 
    textColor: "",
    isBadgePresent: false, 
    badgeWidthPct: null, 
    badgePosition: "LEFT",
    accentHeightPct: null, 
    textSize: null, 
    logoSize: null, // Added
    animCycle: null, 
    animEase: null, 
    animBuffer: null
  };

  const [formData, setFormData] = useState(initialForm);

  const resetForm = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const startEdit = (header) => {
    setEditingId(header.id);
    setFormData({ ...header });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
        alert("Header name is required");
        return;
    }

    const payload = {
        ...formData,
        backgroundColor: formData.backgroundColor || "#000000",
        accentColor: formData.accentColor || "#FF0000",
        badgeColor: formData.badgeColor || "#FFFFFF",
        textColor: formData.textColor || "#FFFFFF",
        badgeWidthPct: parseFloat(formData.badgeWidthPct ?? 20.0),
        accentHeightPct: parseFloat(formData.accentHeightPct ?? 5.0),
        textSize: parseInt(formData.textSize ?? 24),
        logoSize: parseInt(formData.logoSize ?? 50), // Standardized
        animCycle: parseFloat(formData.animCycle ?? 2.5),
        animEase: parseInt(formData.animEase ?? 1),
        animBuffer: parseInt(formData.animBuffer ?? 10)
    };

    const success = editingId ? await updateHeader(editingId, payload) : await createHeader(payload);
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
      
      {/* TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div>
                <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Style Console</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{headers.length} CONFIGURED STYLES</span>
                </div>
            </div>
        </div>
        
        <button 
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
        >
            <MdAdd size={18} /> New Style Profile
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
                    <div className={`p-2 rounded-lg ${editingId ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>
                        {editingId ? <MdStyle size={20} /> : <MdAdd size={20} />}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
                          {editingId ? "Modify Style Profile" : "Create New Profile"}
                      </h3>
                    </div>
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
                    <h3 className="text-[10px] font-black text-blue-600 flex items-center gap-2 uppercase"><MdColorLens size={16}/> Identity</h3>
                    <input type="text" placeholder="Style Name" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <textarea placeholder="Description..." className="w-full border-2 rounded-xl px-4 py-2 text-[10px] h-20 resize-none outline-none focus:border-slate-800" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border">
                      <ColorInput label="Background" value={formData.backgroundColor} onChange={val => setFormData({...formData, backgroundColor: val})} />
                      <ColorInput label="Accent" value={formData.accentColor} onChange={val => setFormData({...formData, accentColor: val})} />
                      <ColorInput label="Badge" value={formData.badgeColor} onChange={val => setFormData({...formData, badgeColor: val})} />
                      <ColorInput label="Text" value={formData.textColor} onChange={val => setFormData({...formData, textColor: val})} />
                    </div>
                  </div>

                  {/* COL 2: GEOMETRY & SIZING */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-blue-600 flex items-center gap-2 uppercase"><MdBadge size={16}/> Geometry</h3>
                    <div className="p-4 bg-slate-50 rounded-xl border space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Enable Badge</span>
                        <input type="checkbox" className="w-5 h-5 accent-slate-800" checked={formData.isBadgePresent} onChange={e => setFormData({...formData, isBadgePresent: e.target.checked})} />
                      </div>
                      {formData.isBadgePresent && (
                        <div className="grid grid-cols-2 gap-2">
                           <select className="w-full text-[10px] border-2 p-2 rounded-lg font-bold bg-white" value={formData.badgePosition} onChange={e => setFormData({...formData, badgePosition: e.target.value})}>
                              <option value="LEFT">LEFT</option>
                              <option value="RIGHT">RIGHT</option>
                           </select>
                           <input type="number" placeholder="Width %" className="w-full border-2 p-2 rounded-lg text-[10px] font-bold" value={formData.badgeWidthPct ?? ""} onChange={e => setFormData({...formData, badgeWidthPct: e.target.value})} />
                        </div>
                      )}
                      <div className="space-y-3 pt-2 border-t">
                        <div className="flex justify-between items-center">
                           <label className="text-[8px] font-black text-slate-400 uppercase">Accent H%</label>
                           <input type="number" step="0.1" className="w-20 border-2 rounded-lg p-1.5 text-center text-[10px] font-bold" value={formData.accentHeightPct ?? ""} onChange={e => setFormData({...formData, accentHeightPct: e.target.value})} />
                        </div>
                        
                        {/* SIZE CONTROLS: TEXT & LOGO */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase">Text Px</label>
                                <input type="number" className="w-full border-2 rounded-lg p-1.5 text-center text-[10px] font-bold" value={formData.textSize ?? ""} onChange={e => setFormData({...formData, textSize: e.target.value})} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase">Logo Px</label>
                                <input type="number" className="w-full border-2 rounded-lg p-1.5 text-center text-[10px] font-bold" value={formData.logoSize ?? ""} onChange={e => setFormData({...formData, logoSize: e.target.value})} />
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COL 3: MOTION */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-blue-600 flex items-center gap-2 uppercase"><MdAnimation size={16}/> Motion</h3>
                    <div className="p-4 bg-slate-50 rounded-xl border space-y-6">
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Cycle Duration</label>
                            <span className="text-[10px] font-mono text-blue-600 font-bold">{formData.animCycle ?? 2.5}s</span>
                          </div>
                          <input type="range" min="0.5" max="10" step="0.1" className="w-full accent-slate-800" value={formData.animCycle ?? 2.5} onChange={e => setFormData({...formData, animCycle: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input type="number" placeholder="Ease" className="w-full border-2 rounded-lg p-2 text-xs font-bold" value={formData.animEase ?? ""} onChange={e => setFormData({...formData, animEase: e.target.value})} />
                          <input type="number" placeholder="Buffer" className="w-full border-2 rounded-lg p-2 text-xs font-bold" value={formData.animBuffer ?? ""} onChange={e => setFormData({...formData, animBuffer: e.target.value})} />
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
                    className="flex-[2] py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[2px] hover:bg-black transition-all shadow-lg active:scale-95">
                    {editingId ? "Update Style Profile" : "Save Style Profile"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {headers.map((h) => (
          <motion.div layout key={h.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${h.active ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[150px]">
                  <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate">{h.name}</h4>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full border shadow-inner" style={{backgroundColor: h.backgroundColor}} />
                    <div className="w-4 h-4 rounded-full border shadow-inner" style={{backgroundColor: h.accentColor}} />
                  </div>
              </div>
              <div className="flex gap-1">
                  <button onClick={() => activateHeader(h.id)} className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-500">
                    {h.active ? <MdCheckCircle size={20}/> : <MdRadioButtonUnchecked className="text-slate-200" size={20}/>}
                  </button>
                  <button onClick={() => startEdit(h)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"><MdEdit size={18}/></button>
                  <button onClick={() => deleteHeader(h.id)} className="p-2 text-slate-300 hover:text-rose-500 transition"><MdDelete size={18}/></button>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 mt-4 pt-4 border-t border-slate-50">
               <div className="flex flex-col">
                  <span>Txt: {h.textSize}px</span>
                  <span>Lgo: {h.logoSize}px</span>
               </div>
               <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{h.animCycle}s Cycle</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}