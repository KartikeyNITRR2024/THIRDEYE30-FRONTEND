import { useContext, useState } from "react";
import { 
  MdArrowBack, MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked, 
  MdClose, MdPalette, MdGraphicEq, MdStraighten, MdAdd, MdTextFields,
  MdAudioFile, MdLayers, MdSpeed, MdTransform, MdOpacity
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import NewsTextSoundContext from "../../../contexts/VideoCreater/NewsTextSound/NewsTextSoundContext";

export default function NewsTextSoundArea({ onBack }) {
  const { 
    newsTextSounds, 
    createNewsTextSound, 
    updateNewsTextSound, 
    deleteNewsTextSound, 
    activateNewsTextSound 
  } = useContext(NewsTextSoundContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Requirement: All starting variables must be null (Standardizing with Java DTO)
  const initialForm = {
    name: "", 
    description: "", 
    active: false,
    bgTheme: "#000000", 
    accentColor: "#FF0000", 
    textColor: "#FFFFFF",
    boxAlpha: null, 
    boxPad: null, 
    dpi: null,
    transitionT: null, 
    enterFrom: "BOTTOM", 
    exitTo: "BOTTOM",
    focusY: null, 
    gapMain: null, 
    gapSub: null, 
    sideScale: null,
    headerWrap: null, 
    contentWrap: null, 
    otherWrap: null,
    baseFontSize: null,
    isAudio: true, 
    endSilenceTimeInSeconds: null, 
    audioVolumne: null
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

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
        alert("Please enter a style name.");
        return;
    }

    // Payload Mapping with strict type conversion for Java DTO
    const payload = {
      ...formData,
      boxAlpha: parseFloat(formData.boxAlpha ?? 0.8),
      boxPad: parseFloat(formData.boxPad ?? 20),
      dpi: parseInt(formData.dpi ?? 300),
      transitionT: parseFloat(formData.transitionT ?? 0.5),
      focusY: parseFloat(formData.focusY ?? 0.8),
      gapMain: parseFloat(formData.gapMain ?? 10),
      gapSub: parseFloat(formData.gapSub ?? 5),
      sideScale: parseFloat(formData.sideScale ?? 1.0),
      headerWrap: parseInt(formData.headerWrap ?? 40),
      contentWrap: parseInt(formData.contentWrap ?? 60),
      otherWrap: parseInt(formData.otherWrap ?? 50),
      baseFontSize: parseInt(formData.baseFontSize ?? 24),
      endSilenceTimeInSeconds: parseFloat(formData.endSilenceTimeInSeconds ?? 1.0),
      audioVolumne: parseInt(formData.audioVolumne ?? 100)
    };

    const success = editingId 
      ? await updateNewsTextSound(editingId, payload) 
      : await createNewsTextSound(payload);

    if (success) resetForm();
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6">
      
      {/* ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div>
                <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Typography & Audio</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{newsTextSounds.length} Active Presets</span>
                </div>
            </div>
        </div>
        <button onClick={openCreateModal} className="flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-2.5 rounded-lg hover:bg-rose-700 text-[10px] font-black transition uppercase tracking-widest shadow-lg shadow-rose-100 active:scale-95">
            <MdAdd size={18} /> New Typography Style
        </button>
      </div>

      {/* MODAL CONFIGURATION ENGINE */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              
              {/* MODAL HEADER */}
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-600 rounded-lg text-white shadow-md">
                        <MdTextFields size={20} />
                    </div>
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
                        {editingId ? "Edit Typography Profile" : "Initialize New Style Engine"}
                    </h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition"><MdClose size={24} /></button>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 max-h-[75vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMN 1: VISUAL IDENTITY & THEME */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-rose-600 flex items-center gap-2 uppercase tracking-tighter"><MdPalette/> Identity & Theme</h4>
                  
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Profile Name" 
                      className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-rose-500 transition" 
                      value={formData.name || ""} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                    <textarea 
                      placeholder="Description & Usage Notes" 
                      className="w-full border-2 rounded-xl px-4 py-2 text-[10px] h-20 resize-none outline-none focus:border-rose-500 transition font-medium" 
                      value={formData.description || ""} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {['bgTheme', 'accentColor', 'textColor'].map((key) => (
                      <div key={key} className="flex flex-col items-center gap-1">
                        <label className="text-[7px] font-black text-slate-400 uppercase">{key.replace('Color', '').replace('bg', 'BG ')}</label>
                        <input type="color" className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-sm" value={formData[key] || "#000000"} onChange={e => setFormData({...formData, [key]: e.target.value})} />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase flex items-center gap-1"><MdOpacity/> Box Alpha</label>
                        <span className="text-[10px] font-bold text-rose-600">{formData.boxAlpha ?? 0.8}</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.1" className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" value={formData.boxAlpha ?? 0.8} onChange={e => setFormData({...formData, boxAlpha: e.target.value})} />
                  </div>

                  {/* PREVIEW BOX */}
                  <div className="p-3 rounded-lg border flex items-center gap-3 shadow-inner" style={{ backgroundColor: formData.bgTheme, opacity: formData.boxAlpha ?? 1 }}>
                     <div className="w-1.5 h-8 rounded" style={{ backgroundColor: formData.accentColor }}></div>
                     <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: formData.textColor }}>Visual Preview</span>
                  </div>
                </div>

                {/* COLUMN 2: GEOMETRY & LAYOUT */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-rose-600 flex items-center gap-2 uppercase tracking-tighter"><MdLayers/> Layout & Geometry</h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        {['headerWrap', 'contentWrap', 'otherWrap'].map(field => (
                           <div key={field} className="space-y-1">
                              <label className="text-[7px] font-black text-slate-400 uppercase">{field.replace('Wrap', '')} Wrap</label>
                              <input type="number" className="w-full border-2 rounded-lg p-1.5 text-[10px] font-bold" value={formData[field] ?? ""} onChange={e => setFormData({...formData, [field]: e.target.value})} />
                           </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                        <div className="space-y-1">
                            <label className="text-[7px] font-black text-slate-400 uppercase">Focus Y</label>
                            <input type="number" step="0.1" className="w-full border-2 rounded-lg p-1.5 text-[10px] font-bold" value={formData.focusY ?? ""} onChange={e => setFormData({...formData, focusY: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[7px] font-black text-slate-400 uppercase">Side Scale</label>
                            <input type="number" step="0.1" className="w-full border-2 rounded-lg p-1.5 text-[10px] font-bold" value={formData.sideScale ?? ""} onChange={e => setFormData({...formData, sideScale: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[7px] font-black text-slate-400 uppercase">DPI</label>
                            <input type="number" className="w-full border-2 rounded-lg p-1.5 text-[10px] font-bold" value={formData.dpi ?? ""} onChange={e => setFormData({...formData, dpi: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Box Padding</label>
                            <input type="number" className="w-full border-2 rounded-lg p-2 text-xs font-bold" value={formData.boxPad ?? ""} onChange={e => setFormData({...formData, boxPad: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Base Font Size</label>
                            <input type="number" className="w-full border-2 rounded-lg p-2 text-xs font-bold" value={formData.baseFontSize ?? ""} onChange={e => setFormData({...formData, baseFontSize: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Gap Main</label>
                            <input type="number" step="0.1" className="w-full border-2 rounded-lg p-2 text-xs font-bold" value={formData.gapMain ?? ""} onChange={e => setFormData({...formData, gapMain: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Gap Sub</label>
                            <input type="number" step="0.1" className="w-full border-2 rounded-lg p-2 text-xs font-bold" value={formData.gapSub ?? ""} onChange={e => setFormData({...formData, gapSub: e.target.value})} />
                        </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: AUDIO & MOTION */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-rose-600 flex items-center gap-2 uppercase tracking-tighter"><MdGraphicEq/> Audio & Motion</h4>
                  <div className={`p-4 rounded-xl border-2 transition-colors ${formData.isAudio ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-600 uppercase leading-none">Enable TTS Audio</span>
                            <span className="text-[7px] text-slate-400 font-bold uppercase mt-1">Sync with narration</span>
                        </div>
                        <input type="checkbox" className="w-5 h-5 accent-rose-600 cursor-pointer" checked={formData.isAudio} onChange={e => setFormData({...formData, isAudio: e.target.checked})} />
                    </div>
                    {formData.isAudio && (
                        <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2">
                            <div className="space-y-1">
                                <label className="text-[7px] font-black text-rose-400 uppercase">Volume %</label>
                                <input type="number" className="w-full border-2 rounded-lg p-1.5 text-xs font-bold" value={formData.audioVolumne ?? ""} onChange={e => setFormData({...formData, audioVolumne: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[7px] font-black text-rose-400 uppercase">End Silence (s)</label>
                                <input type="number" step="0.1" className="w-full border-2 rounded-lg p-1.5 text-xs font-bold" value={formData.endSilenceTimeInSeconds ?? ""} onChange={e => setFormData({...formData, endSilenceTimeInSeconds: e.target.value})} />
                            </div>
                        </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Enter From</label>
                            <select className="w-full border-2 rounded-lg p-2 text-[10px] font-bold outline-none focus:border-rose-500" value={formData.enterFrom || ""} onChange={e => setFormData({...formData, enterFrom: e.target.value})}>
                                <option value="LEFT">LEFT</option><option value="RIGHT">RIGHT</option><option value="TOP">TOP</option><option value="BOTTOM">BOTTOM</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Exit To</label>
                            <select className="w-full border-2 rounded-lg p-2 text-[10px] font-bold outline-none focus:border-rose-500" value={formData.exitTo || ""} onChange={e => setFormData({...formData, exitTo: e.target.value})}>
                                <option value="LEFT">LEFT</option><option value="RIGHT">RIGHT</option><option value="TOP">TOP</option><option value="BOTTOM">BOTTOM</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase">Transition Duration (s)</label>
                        <div className="relative">
                            <input type="number" step="0.1" className="w-full border-2 rounded-lg p-2 text-xs font-bold" value={formData.transitionT ?? ""} onChange={e => setFormData({...formData, transitionT: e.target.value})} />
                            <MdSpeed className="absolute right-2 top-2.5 text-slate-300" />
                        </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* MODAL FOOTER */}
              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleSubmit} className="flex-[2] py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[2px] hover:bg-rose-600 transition-all shadow-lg active:scale-95">
                    {editingId ? "Update Presets" : "Initialize Style Engine"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REPOSITORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {newsTextSounds.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[180px]">{item.name}</h4>
                        <span className="text-[9px] text-slate-400 font-bold uppercase mt-1 truncate max-w-[150px]">{item.description || "No Description"}</span>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => activateNewsTextSound(item.id)} className={`p-1.5 rounded-lg transition ${item.active ? 'text-rose-500 bg-rose-50' : 'text-slate-200 hover:text-slate-400'}`}>
                            {item.active ? <MdCheckCircle size={20}/> : <MdRadioButtonUnchecked size={20}/>}
                        </button>
                        <button onClick={() => startEdit(item)} className="p-1.5 text-slate-400 hover:text-slate-900 transition"><MdEdit size={18}/></button>
                        <button onClick={() => deleteNewsTextSound(item.id)} className="p-1.5 text-slate-200 hover:text-rose-500 transition"><MdDelete size={18}/></button>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4 mt-2">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                            <div className="w-3.5 h-3.5 rounded-full border border-white" style={{backgroundColor: item.bgTheme}} title="BG Theme" />
                            <div className="w-3.5 h-3.5 rounded-full border border-white" style={{backgroundColor: item.accentColor}} title="Accent Color" />
                        </div>
                        <div className="h-3 w-[1px] bg-slate-200 mx-1"></div>
                        {item.isAudio ? <MdAudioFile className="text-rose-500" size={14}/> : <MdAudioFile className="text-slate-200" size={14}/>}
                        <span className="text-[8px] font-black text-slate-500 uppercase">{item.isAudio ? 'TTS ON' : 'SILENT'}</span>
                    </div>
                    <span className="text-[8px] font-mono font-bold text-slate-400">{item.baseFontSize}PX FONT</span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}