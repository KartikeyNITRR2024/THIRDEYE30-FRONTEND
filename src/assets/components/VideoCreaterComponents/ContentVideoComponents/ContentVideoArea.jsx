import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdCheckCircle, 
  MdRadioButtonUnchecked, MdClose, MdLayers, MdViewQuilt, 
  MdGraphicEq, MdAdd, MdPalette, MdSettings, MdImage
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import ContentVideoContext from "../../../contexts/VideoCreater/ContentVideo/ContentVideoContext";

export default function ContentVideoArea({ onBack }) {
  const { 
    contentConfigs, 
    createContentConfig, 
    updateContentConfig, 
    deleteContentConfig, 
    activateContentConfig,
    fetchContentConfigs
  } = useContext(ContentVideoContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 1. Initial State - Strictly null for Java DTO compatibility
  const emptyForm = {
    name: null, 
    description: null, 
    active: false,
    isBackgroundImage: false, 
    backgroundImage: null, 
    backgroundColor: null, 
    backgroundOpacity: null,
    isHeaderPresent: false, 
    headerType: "SIMPLE_RIGHT_TO_LEFT", 
    headerHeightInPercent: null, 
    headerStartingPosition: null,
    isBarRace: false, 
    barRaceType: "SIMPLE_HORIZONTAL", 
    barRaceHeightInPercent: null, 
    barRaceStartingPosition: null,
    isNewsImage: false, 
    newsImageType: "SIMPLE_RIGHT_TO_LEFT", 
    newsImageHeightInPercent: null, 
    newsImageStartingPosition: null,
    isNewsText: false, 
    newsTextType: "SIMPLE_RIGHT_TO_LEFT", 
    newsTexteHeightInPercent: null, 
    newsTextStartingPosition: null,
    isAudio: false, 
    audioMultiMediaKey: null, 
    audioVolumne: null
  };

  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => { 
    setEditingId(null); 
    setFormData(emptyForm); 
    setIsModalOpen(false);
  };

  const startEdit = (config) => {
    setEditingId(config.id);
    setFormData({ ...emptyForm, ...config });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    
    const payload = {
      ...formData,
      headerHeightInPercent: formData.headerHeightInPercent ? parseFloat(formData.headerHeightInPercent) : 0,
      headerStartingPosition: formData.headerStartingPosition ? parseInt(formData.headerStartingPosition) : 0,
      barRaceHeightInPercent: formData.barRaceHeightInPercent ? parseFloat(formData.barRaceHeightInPercent) : 0,
      barRaceStartingPosition: formData.barRaceStartingPosition ? parseInt(formData.barRaceStartingPosition) : 0,
      newsImageHeightInPercent: formData.newsImageHeightInPercent ? parseFloat(formData.newsImageHeightInPercent) : 0,
      newsImageStartingPosition: formData.newsImageStartingPosition ? parseInt(formData.newsImageStartingPosition) : 0,
      newsTexteHeightInPercent: formData.newsTexteHeightInPercent ? parseFloat(formData.newsTexteHeightInPercent) : 0,
      newsTextStartingPosition: formData.newsTextStartingPosition ? parseInt(formData.newsTextStartingPosition) : 0,
      audioVolumne: formData.audioVolumne ? parseInt(formData.audioVolumne) : 100,
      backgroundOpacity: formData.backgroundOpacity ? parseFloat(formData.backgroundOpacity) : 1.0
    };

    const success = editingId 
        ? await updateContentConfig(editingId, payload) 
        : await createContentConfig(payload);
        
    if (success) resetForm();
  };

  const LayoutModule = ({ label, isEnabled, onToggle, typeKey, heightKey, posKey, options, colorClass }) => (
    <div className={`p-4 rounded-2xl border-2 transition-all ${isEnabled ? `bg-white border-${colorClass}-200 shadow-sm` : 'bg-slate-50 border-slate-100 opacity-60'}`}>
      <div className="flex justify-between items-center mb-3">
        <span className={`text-[10px] font-black uppercase tracking-wider ${isEnabled ? `text-${colorClass}-600` : 'text-slate-400'}`}>{label}</span>
        <input type="checkbox" className={`w-5 h-5 cursor-pointer accent-${colorClass}-500`} checked={isEnabled} onChange={e => onToggle(e.target.checked)} />
      </div>
      <div className={`space-y-3 transition-opacity ${!isEnabled && 'pointer-events-none'}`}>
        <select className="w-full text-[10px] border rounded-lg p-2 font-bold bg-slate-50 outline-none focus:border-indigo-400" 
          value={formData[typeKey] || ""} onChange={e => setFormData({...formData, [typeKey]: e.target.value})}>
          {options.map(opt => <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[8px] text-slate-400 font-black block mb-1">HEIGHT %</label>
            <input type="number" step="0.1" className="w-full border rounded-lg p-2 text-xs font-black outline-none" 
              value={formData[heightKey] ?? ""} onChange={e => setFormData({...formData, [heightKey]: e.target.value})} />
          </div>
          <div>
            <label className="text-[8px] text-slate-400 font-black block mb-1">Y-POS %</label>
            <input type="number" className="w-full border rounded-lg p-2 text-xs font-black outline-none" 
              value={formData[posKey] ?? ""} onChange={e => setFormData({...formData, [posKey]: e.target.value})} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 font-sans text-slate-900">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            <MdArrowBack size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase leading-none mb-1">Content Layouts</h2>
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Module Orchestration</span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => fetchContentConfigs()} className="p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition">
            <MdRefresh size={20} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-[10px] font-black transition uppercase tracking-widest shadow-md"
          >
            <MdAdd size={18} /> New Layout
          </button>
        </div>
      </div>

      {/* REPOSITORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentConfigs.map((cfg) => (
          <motion.div layout key={cfg.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${cfg.active ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate leading-tight">{cfg.name || "Untitled Layout"}</h4>
                <p className="text-[10px] text-slate-400 font-bold line-clamp-1 uppercase">{cfg.description || "No description"}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(cfg)} className="p-2 text-slate-400 hover:text-indigo-600 transition"><MdEdit size={18} /></button>
                <button onClick={() => deleteContentConfig(cfg.id)} className="p-2 text-slate-400 hover:text-rose-600 transition"><MdDelete size={18} /></button>
              </div>
            </div>

            <div className="flex gap-1.5 mb-5">
               {cfg.isHeaderPresent && <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-[8px] font-black border border-blue-100">HEADER</span>}
               {cfg.isBarRace && <span className="px-2 py-1 rounded bg-purple-50 text-purple-600 text-[8px] font-black border border-purple-100">STATS</span>}
               {cfg.isNewsImage && <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-[8px] font-black border border-emerald-100">IMAGE</span>}
               {cfg.isNewsText && <span className="px-2 py-1 rounded bg-rose-50 text-rose-600 text-[8px] font-black border border-rose-100">TICKER</span>}
            </div>

            <button onClick={() => activateContentConfig(cfg.id)} className="flex items-center gap-2 w-full pt-3 border-t border-slate-50">
              {cfg.active ? <MdCheckCircle size={22} className="text-orange-500"/> : <MdRadioButtonUnchecked size={22} className="text-slate-200"/>}
              <span className={`text-[10px] font-black uppercase ${cfg.active ? 'text-orange-600' : 'text-slate-400'}`}>
                {cfg.active ? 'Active Profile' : 'Select Profile'}
              </span>
            </button>
          </motion.div>
        ))}
      </div>

      {/* DESIGNER MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} 
              className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden my-auto">
              
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-200"><MdViewQuilt size={20} /></div>
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
                    {editingId ? "Update Content Layout" : "Design New Layout"}
                  </h3>
                </div>
                <button onClick={resetForm} className="p-2 text-slate-400 hover:text-rose-500 transition"><MdClose size={28} /></button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[75vh] overflow-y-auto">
                
                {/* FORM COLUMN */}
                <div className="lg:col-span-8 space-y-8">
                    {/* BASE IDENTITY */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MdSettings size={14}/> Profile</label>
                        <input type="text" placeholder="Layout Name" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500" 
                          value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <textarea placeholder="Description..." className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[11px] h-24 resize-none outline-none focus:border-indigo-500" 
                          value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>

                      <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MdPalette size={14}/> Background</label>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-500">IMAGE MODE</span>
                          <input type="checkbox" className="w-4 h-4 accent-indigo-600" checked={formData.isBackgroundImage} onChange={e => setFormData({...formData, isBackgroundImage: e.target.checked})} />
                        </div>
                        {formData.isBackgroundImage ? (
                          <input type="text" placeholder="Background UUID" className="w-full border rounded-lg p-2.5 text-[10px] font-mono bg-white" 
                            value={formData.backgroundImage || ""} onChange={e => setFormData({...formData, backgroundImage: e.target.value})} />
                        ) : (
                          <div className="flex items-center gap-4">
                             <input type="color" className="w-12 h-12 rounded-xl shadow-inner border-0" value={formData.backgroundColor || "#000000"} onChange={e => setFormData({...formData, backgroundColor: e.target.value})} />
                             <div className="flex-1">
                                <div className="flex justify-between text-[8px] font-black mb-1"><span>OPACITY</span><span>{Math.round((formData.backgroundOpacity || 0) * 100)}%</span></div>
                                <input type="range" min="0" max="1" step="0.1" className="w-full accent-indigo-600" value={formData.backgroundOpacity || 0} onChange={e => setFormData({...formData, backgroundOpacity: e.target.value})} />
                             </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* MODULE GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <LayoutModule label="Header" colorClass="blue" isEnabled={formData.isHeaderPresent} onToggle={val => setFormData({...formData, isHeaderPresent: val})} 
                        typeKey="headerType" heightKey="headerHeightInPercent" posKey="headerStartingPosition" options={["SIMPLE_RIGHT_TO_LEFT"]} />
                      
                      <LayoutModule label="Stats / Bar Race" colorClass="purple" isEnabled={formData.isBarRace} onToggle={val => setFormData({...formData, isBarRace: val})} 
                        typeKey="barRaceType" heightKey="barRaceHeightInPercent" posKey="barRaceStartingPosition" options={["SIMPLE_HORIZONTAL"]} />
                      
                      <LayoutModule label="News Visuals" colorClass="emerald" isEnabled={formData.isNewsImage} onToggle={val => setFormData({...formData, isNewsImage: val})} 
                        typeKey="newsImageType" heightKey="newsImageHeightInPercent" posKey="newsImageStartingPosition" options={["SIMPLE_RIGHT_TO_LEFT"]} />
                      
                      <LayoutModule label="News Ticker" colorClass="rose" isEnabled={formData.isNewsText} onToggle={val => setFormData({...formData, isNewsText: val})} 
                        typeKey="newsTextType" heightKey="newsTexteHeightInPercent" posKey="newsTextStartingPosition" options={["SIMPLE_RIGHT_TO_LEFT"]} />
                    </div>

                    {/* AUDIO SECTION */}
                    <div className={`p-5 rounded-2xl border-2 transition-all ${formData.isAudio ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex items-center gap-3 min-w-[120px]">
                                <MdGraphicEq size={24} className={formData.isAudio ? 'text-indigo-600' : 'text-slate-300'}/>
                                <span className="text-[10px] font-black text-slate-600 uppercase">Audio Sync</span>
                                <input type="checkbox" className="w-5 h-5 accent-indigo-600" checked={formData.isAudio} onChange={e => setFormData({...formData, isAudio: e.target.checked})} />
                            </div>
                            {formData.isAudio && (
                                <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full">
                                    <input type="text" placeholder="Audio Multimedia UUID" className="flex-1 border-2 border-white rounded-xl px-4 py-2 text-[10px] font-mono shadow-sm" 
                                      value={formData.audioMultiMediaKey || ""} onChange={e => setFormData({...formData, audioMultiMediaKey: e.target.value})} />
                                    <div className="w-full sm:w-32">
                                        <div className="flex justify-between text-[8px] font-black text-indigo-400 mb-1"><span>VOLUME</span><span>{formData.audioVolumne || 100}%</span></div>
                                        <input type="range" min="0" max="100" className="w-full accent-indigo-600" value={formData.audioVolumne || 100} onChange={e => setFormData({...formData, audioVolumne: e.target.value})} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* PREVIEW COLUMN */}
                <div className="lg:col-span-4 space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">9:16 Wireframe</label>
                    <div className="bg-slate-900 aspect-[9/16] rounded-[2rem] relative overflow-hidden border-[12px] border-slate-800 shadow-2xl mx-auto max-w-[280px]">
                        {/* THEME BG */}
                        <div className="absolute inset-0 transition-opacity duration-500" style={{ backgroundColor: formData.backgroundColor || '#000', opacity: formData.backgroundOpacity || 1 }}></div>
                        
                        {/* MODULES PREVIEW */}
                        {formData.isHeaderPresent && <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="absolute w-full bg-blue-500/40 border-y border-blue-400/50 flex items-center justify-center text-[8px] font-black text-white" style={{ top: `${formData.headerStartingPosition ?? 0}%`, height: `${formData.headerHeightInPercent ?? 10}%` }}>HEADER</motion.div>}
                        {formData.isBarRace && <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="absolute w-full bg-purple-500/40 border-y border-purple-400/50 flex items-center justify-center text-[8px] font-black text-white" style={{ top: `${formData.barRaceStartingPosition ?? 15}%`, height: `${formData.barRaceHeightInPercent ?? 40}%` }}>CHART AREA</motion.div>}
                        {formData.isNewsImage && <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="absolute w-full bg-emerald-500/40 border-y border-emerald-400/50 flex items-center justify-center text-[8px] font-black text-white" style={{ top: `${formData.newsImageStartingPosition ?? 60}%`, height: `${formData.newsImageHeightInPercent ?? 25}%` }}>VISUAL MEDIA</motion.div>}
                        {formData.isNewsText && <motion.div className="absolute w-full bg-rose-500/40 border-y border-rose-400/50 flex items-center justify-center text-[8px] font-black text-white" style={{ top: `${formData.newsTextStartingPosition ?? 90}%`, height: `${formData.newsTexteHeightInPercent ?? 10}%` }}>TICKER</motion.div>}
                        
                        <div className="absolute top-4 left-0 w-full flex justify-center"><div className="w-16 h-4 rounded-full bg-slate-800"></div></div>
                    </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-6 bg-slate-50 border-t flex gap-4">
                <button onClick={resetForm} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:bg-white transition-all">Discard</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={!formData.name}
                  className="flex-[2] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[3px] bg-slate-900 text-white shadow-xl hover:bg-black transition-all disabled:opacity-30"
                >
                   {editingId ? "Commit Changes" : "Initialize Design"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}