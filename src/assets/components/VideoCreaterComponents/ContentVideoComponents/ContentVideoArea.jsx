import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdCheckCircle, 
  MdRadioButtonUnchecked, MdClose, MdLayers, MdViewQuilt, MdGraphicEq 
} from "react-icons/md";
import { motion } from "framer-motion";
import ContentVideoContext from "../../../contexts/VideoCreater/ContentVideo/ContentVideoContext";

export default function ContentVideoArea({ onBack }) {
  const { 
    contentConfigs, 
    createContentConfig, 
    updateContentConfig, 
    deleteContentConfig, 
    activateContentConfig 
  } = useContext(ContentVideoContext);
  
  const [editingId, setEditingId] = useState(null);

  // 1. Initial State with null for numbers and empty strings for text
  const initialForm = {
    name: "", 
    description: "", 
    active: false,
    // Background
    isBackgroundImage: false, 
    backgroundImage: "", 
    backgroundColor: "#000000", 
    backgroundOpacity: null,
    // Header
    isHeaderPresent: false, 
    headerType: "SIMPLE_RIGHT_TO_LEFT", 
    headerHeightInPercent: null, 
    headerStartingPosition: null,
    // Bar Race
    isBarRace: false, 
    barRaceType: "SIMPLE_HORIZONTAL", 
    barRaceHeightInPercent: null, 
    barRaceStartingPosition: null,
    // News Visuals
    isNewsImage: false, 
    newsImageType: "SIMPLE_RIGHT_TO_LEFT", 
    newsImageHeightInPercent: null, 
    newsImageStartingPosition: null,
    // News Ticker
    isNewsText: false, 
    newsTextType: "SIMPLE_RIGHT_TO_LEFT", 
    newsTexteHeightInPercent: null, 
    newsTextStartingPosition: null,
    // Audio
    isAudio: false, 
    audioMultiMediaKey: "", 
    audioVolumne: null
  };

  const [formData, setFormData] = useState(initialForm);

  // 2. Reset logic
  const reset = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
  };

  const handleEdit = (config) => {
    setEditingId(config.id);
    setFormData({ ...config });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!formData.name) {
        alert("Please enter a name for this layout.");
        return;
    }
    
    // 3. Type Conversion & Null safety for Java Backend
    const payload = {
      ...formData,
      headerHeightInPercent: parseFloat(formData.headerHeightInPercent ?? 0),
      headerStartingPosition: parseInt(formData.headerStartingPosition ?? 0),
      barRaceHeightInPercent: parseFloat(formData.barRaceHeightInPercent ?? 0),
      barRaceStartingPosition: parseInt(formData.barRaceStartingPosition ?? 0),
      newsImageHeightInPercent: parseFloat(formData.newsImageHeightInPercent ?? 0),
      newsImageStartingPosition: parseInt(formData.newsImageStartingPosition ?? 0),
      newsTexteHeightInPercent: parseFloat(formData.newsTexteHeightInPercent ?? 0),
      newsTextStartingPosition: parseInt(formData.newsTextStartingPosition ?? 0),
      audioVolumne: parseInt(formData.audioVolumne ?? 100),
      backgroundOpacity: parseFloat(formData.backgroundOpacity ?? 1.0)
    };

    const success = editingId 
        ? await updateContentConfig(editingId, payload) 
        : await createContentConfig(payload);
        
    if (success) reset();
  };

  const LayoutModule = ({ label, isEnabled, onToggle, typeKey, heightKey, posKey, options, colorClass }) => (
    <div className={`p-4 rounded-xl border-2 transition-all ${isEnabled ? `bg-white border-${colorClass}-200 shadow-sm` : 'bg-gray-50/50 border-transparent opacity-50'}`}>
      <div className="flex justify-between items-center mb-3">
        <span className={`text-[10px] font-black uppercase ${isEnabled ? `text-${colorClass}-600` : 'text-gray-400'}`}>{label}</span>
        <input type="checkbox" className="w-5 h-5 cursor-pointer" checked={isEnabled} onChange={e => onToggle(e.target.checked)} />
      </div>
      {isEnabled && (
        <div className="space-y-3">
          <select className="w-full text-[10px] border rounded-lg p-2 font-bold bg-slate-50 outline-none" value={formData[typeKey] || ""} onChange={e => setFormData({...formData, [typeKey]: e.target.value})}>
            {options.map(opt => <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] text-gray-400 font-black block mb-1">HEIGHT %</label>
              <input type="number" step="0.1" className="w-full border rounded p-2 text-xs font-bold" value={formData[heightKey] ?? ""} onChange={e => setFormData({...formData, [heightKey]: e.target.value})} />
            </div>
            <div>
              <label className="text-[8px] text-gray-400 font-black block mb-1">START POS %</label>
              <input type="number" className="w-full border rounded p-2 text-xs font-bold" value={formData[posKey] ?? ""} onChange={e => setFormData({...formData, [posKey]: e.target.value})} />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-3 md:p-6 shadow-md mt-6 border border-gray-100">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button onClick={onBack} className="bg-gray-100 px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 hover:bg-gray-200 transition">
          <MdArrowBack/> BACK
        </button>
        <div className="text-right">
          <h2 className="text-xs md:text-sm font-black text-gray-700 uppercase tracking-tight">Content Layout Designer</h2>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Dynamic Module Orchestrator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FORM PANEL */}
        <div className={`lg:col-span-8 p-4 md:p-6 rounded-2xl border-2 transition-all ${editingId ? 'border-orange-200 bg-orange-50/10' : 'bg-slate-50/50 border-slate-100'}`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
               <h3 className="text-[10px] font-black text-gray-400 uppercase">Configuration Identity</h3>
               <input type="text" placeholder="Layout Name" className="w-full border rounded-xl px-4 py-3 text-xs font-bold shadow-sm" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
               <textarea placeholder="Description..." className="w-full border rounded-xl px-4 py-3 text-xs h-20 shadow-sm" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-3">
               <h3 className="text-[10px] font-black text-gray-400 uppercase">Canvas Background</h3>
               <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-gray-500 uppercase">Background Image Mode</span>
                    <input type="checkbox" className="w-5 h-5" checked={formData.isBackgroundImage} onChange={e => setFormData({...formData, isBackgroundImage: e.target.checked})} />
                  </div>
                  {formData.isBackgroundImage ? 
                    <input type="text" placeholder="Image UUID" className="w-full border rounded-lg p-2 text-[10px] font-mono bg-orange-50/30" value={formData.backgroundImage || ""} onChange={e => setFormData({...formData, backgroundImage: e.target.value})} /> :
                    <div className="flex items-center gap-4">
                      <input type="color" className="w-12 h-10 cursor-pointer rounded-lg" value={formData.backgroundColor || "#000000"} onChange={e => setFormData({...formData, backgroundColor: e.target.value})} />
                      <div className="flex-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase block">Opacity (0-1)</label>
                        <input type="number" step="0.1" className="w-full border rounded p-1 text-xs font-bold" value={formData.backgroundOpacity ?? ""} onChange={e => setFormData({...formData, backgroundOpacity: e.target.value})} />
                      </div>
                    </div>
                  }
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayoutModule label="Header Overlay" colorClass="blue" isEnabled={formData.isHeaderPresent} onToggle={val => setFormData({...formData, isHeaderPresent: val})} 
              typeKey="headerType" heightKey="headerHeightInPercent" posKey="headerStartingPosition" options={["SIMPLE_RIGHT_TO_LEFT"]} />
            
            <LayoutModule label="Bar Race Stats" colorClass="purple" isEnabled={formData.isBarRace} onToggle={val => setFormData({...formData, isBarRace: val})} 
              typeKey="barRaceType" heightKey="barRaceHeightInPercent" posKey="barRaceStartingPosition" options={["SIMPLE_HORIZONTAL"]} />
            
            <LayoutModule label="News Visuals" colorClass="green" isEnabled={formData.isNewsImage} onToggle={val => setFormData({...formData, isNewsImage: val})} 
              typeKey="newsImageType" heightKey="newsImageHeightInPercent" posKey="newsImageStartingPosition" options={["SIMPLE_RIGHT_TO_LEFT"]} />
            
            <LayoutModule label="News Ticker" colorClass="rose" isEnabled={formData.isNewsText} onToggle={val => setFormData({...formData, isNewsText: val})} 
              typeKey="newsTextType" heightKey="newsTexteHeightInPercent" posKey="newsTextStartingPosition" options={["SIMPLE_RIGHT_TO_LEFT"]} />
          </div>

          {/* AUDIO CONFIGURATION */}
          <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
             <div className={`p-4 rounded-xl border-2 transition-all ${formData.isAudio ? 'bg-white border-amber-200 shadow-sm' : 'bg-gray-50/50 border-transparent opacity-50'}`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                   <div className="flex items-center gap-3 min-w-[140px]">
                      <div className={`p-2 rounded-lg ${formData.isAudio ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-400'}`}>
                         <MdGraphicEq size={20}/>
                      </div>
                      <span className="text-[10px] font-black text-gray-600 uppercase">Audio</span>
                      <input type="checkbox" className="w-5 h-5 cursor-pointer" checked={!!formData.isAudio} onChange={e => setFormData({...formData, isAudio: e.target.checked})} />
                   </div>
                   {formData.isAudio && (
                      <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full">
                         <div className="flex-1">
                            <label className="text-[8px] text-gray-400 font-black block mb-1">AUDIO MULTIMEDIA UUID</label>
                            <input type="text" placeholder="UUID..." className="w-full border rounded-lg p-2 text-[10px] font-mono bg-slate-50" value={formData.audioMultiMediaKey || ""} onChange={e => setFormData({...formData, audioMultiMediaKey: e.target.value})} />
                         </div>
                         <div className="w-full sm:w-32">
                            <label className="text-[8px] text-gray-400 font-black block mb-1">VOLUME ({formData.audioVolumne ?? 100}%)</label>
                            <input type="range" min="0" max="100" className="w-full accent-amber-500" value={formData.audioVolumne ?? 100} onChange={e => setFormData({...formData, audioVolumne: e.target.value})} />
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={handleSubmit} className="flex-1 bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[2px] hover:bg-gray-800 transition">
              {editingId ? "Update Configuration" : "Initialize Layout"}
            </button>
            {(editingId || formData.name) && (
              <button onClick={reset} className="px-8 bg-red-50 text-red-500 rounded-2xl border border-red-100 flex items-center justify-center">
                <MdClose size={24}/>
              </button>
            )}
          </div>
        </div>

        {/* PREVIEW SIDEBAR */}
        <div className="lg:col-span-4">
            <div className="bg-slate-900 rounded-2xl p-4 aspect-[9/16] relative overflow-hidden border-4 border-slate-800 shadow-2xl">
                {/* Visual Representation using current state */}
                {formData.isHeaderPresent && <div className="absolute w-full bg-blue-500/40 border-y border-blue-400 flex items-center justify-center text-[8px] font-black text-white" style={{ top: `${formData.headerStartingPosition ?? 0}%`, height: `${formData.headerHeightInPercent ?? 10}%` }}>HEADER</div>}
                {formData.isBarRace && <div className="absolute w-full bg-purple-500/40 border-y border-purple-400 flex items-center justify-center text-[8px] font-black text-white" style={{ top: `${formData.barRaceStartingPosition ?? 10}%`, height: `${formData.barRaceHeightInPercent ?? 40}%` }}>BAR RACE</div>}
                {formData.isNewsImage && <div className="absolute w-full bg-green-500/40 border-y border-green-400 flex items-center justify-center text-[8px] font-black text-white" style={{ top: `${formData.newsImageStartingPosition ?? 50}%`, height: `${formData.newsImageHeightInPercent ?? 30}%` }}>IMAGE</div>}
                {formData.isNewsText && <div className="absolute w-full bg-rose-500/40 border-y border-rose-400 flex items-center justify-center text-[8px] font-black text-white" style={{ top: `${formData.newsTextStartingPosition ?? 90}%`, height: `${formData.newsTexteHeightInPercent ?? 10}%` }}>NEWS TICKER</div>}
                <div className="absolute bottom-2 left-2 text-[8px] text-slate-500 font-bold uppercase">9:16 Preview</div>
            </div>
        </div>
      </div>

      {/* LIST TABLE */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 uppercase border-b bg-gray-50/50">
              <th className="p-4 text-left w-12">Active</th>
              <th className="p-4 text-left">Layout Profile</th>
              <th className="p-4 text-center">Modules</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentConfigs.map(cfg => (
              <tr key={cfg.id} className={`border-b border-slate-50 hover:bg-slate-50 ${cfg.active ? 'bg-orange-50/20' : ''}`}>
                <td className="p-4">
                  <button onClick={() => activateContentConfig(cfg.id)}>
                    {cfg.active ? <MdCheckCircle className="text-orange-500" size={24}/> : <MdRadioButtonUnchecked className="text-gray-200" size={24}/>}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800 uppercase tracking-tight">{cfg.name}</span>
                    <span className="text-[9px] text-gray-400 font-bold truncate max-w-[200px]">{cfg.description || "—"}</span>
                  </div>
                </td>
                <td className="p-4">
                   <div className="flex gap-1.5 justify-center">
                      {cfg.isHeaderPresent && <span className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-[9px] font-black">H</span>}
                      {cfg.isBarRace && <span className="w-6 h-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center text-[9px] font-black">B</span>}
                      {cfg.isNewsImage && <span className="w-6 h-6 rounded bg-green-50 text-green-600 flex items-center justify-center text-[9px] font-black">I</span>}
                      {cfg.isNewsText && <span className="w-6 h-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center text-[9px] font-black">T</span>}
                   </div>
                </td>
                <td className="p-4 text-right">
                   <div className="flex justify-end gap-1">
                     <button onClick={() => handleEdit(cfg)} className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg transition-colors"><MdEdit size={18}/></button>
                     <button onClick={() => deleteContentConfig(cfg.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors"><MdDelete size={18}/></button>
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