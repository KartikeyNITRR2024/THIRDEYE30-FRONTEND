import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdCheckCircle, 
  MdRadioButtonUnchecked, MdClose, MdFormatColorFill, 
  MdTextFields, MdImage, MdMusicNote, MdSettings, MdHorizontalRule 
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import IntroVideoContext from "../../../contexts/VideoCreater/IntroVideo/IntroVideoContext";

export default function IntroVideoArea({ onBack }) {
  const { intros, createIntro, updateIntro, deleteIntro, activateIntro, fetchIntros } = useContext(IntroVideoContext);
  const [editingId, setEditingId] = useState(null);

  // 1. Initial State with null for all numeric columns
  const initialForm = {
    name: "", 
    description: "", 
    active: false,
    isBackgroundImage: false, 
    backgroundImage: "", 
    backgroundColor: "#000000", 
    backgroundOpacity: null, // float
    isHeaderPresent: true, 
    headerFontType: "BOLD", 
    headerFontName: "Arial", 
    headerSize: null, // int
    headerColor: "#FFFFFF",
    isSubHeaderPresent: false, 
    subHeaderFontType: "NORMAL", 
    subHeaderFontName: "Arial", 
    subHeaderSize: null, // int
    subHeaderColor: "#CCCCCC",
    isLinePresent: false, 
    lineColor: "#FF0000", 
    lineWidth: null, // int
    adImageHeight: null, // int
    adImageWidth: null, // int
    isAudio: false, 
    audioMultiMediaKey: "", 
    audioVolumne: null // int
  };

  const [formData, setFormData] = useState(initialForm);

  const reset = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
  };

  const handleEdit = (intro) => {
    setEditingId(intro.id);
    setFormData({ ...initialForm, ...intro });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!formData.name) return;

    // 2. Strict Type Casting for Java/SQL Compatibility
    const payload = {
      ...formData,
      backgroundOpacity: parseFloat(formData.backgroundOpacity ?? 1.0),
      headerSize: parseInt(formData.headerSize ?? 60),
      subHeaderSize: parseInt(formData.subHeaderSize ?? 40),
      lineWidth: parseInt(formData.lineWidth ?? 5),
      adImageWidth: parseInt(formData.adImageWidth ?? 200),
      adImageHeight: parseInt(formData.adImageHeight ?? 200),
      audioVolumne: parseInt(formData.audioVolumne ?? 100)
    };

    const success = editingId ? await updateIntro(editingId, payload) : await createIntro(payload);
    if (success) reset();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-3 md:p-6 shadow-md mt-4 md:mt-6 border border-gray-100">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
        <button onClick={onBack} className="bg-gray-100 px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 hover:bg-gray-200 transition w-full sm:w-auto justify-center">
          <MdArrowBack/> BACK
        </button>
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <button onClick={() => fetchIntros()} className="text-gray-400 hover:text-black transition p-2 bg-slate-50 rounded-full active:rotate-180 duration-500"><MdRefresh size={20}/></button>
            <div className="text-right">
                <h2 className="text-xs md:text-sm font-black text-gray-700 uppercase tracking-tight leading-none">Intro Designer</h2>
                <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">Visual Template Manager</span>
            </div>
        </div>
      </div>

      {/* COMPREHENSIVE FORM PANEL */}
      <div className={`mb-8 p-4 md:p-6 rounded-2xl border-2 transition-all ${editingId ? 'border-blue-200 bg-blue-50/10' : 'bg-slate-50/50 border-slate-100'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* COLUMN 1: IDENTITY */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <h3 className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2 tracking-widest"><MdSettings size={16}/> Basic Identity</h3>
            <div className="space-y-2">
                <input type="text" placeholder="Template Name" className="w-full border-2 rounded-lg px-3 py-2.5 text-xs font-bold outline-none focus:border-blue-400 transition" 
                  value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
                <textarea placeholder="Template Description" className="w-full border-2 rounded-lg px-3 py-2 text-[11px] h-20 outline-none focus:border-blue-400 transition resize-none" 
                  value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          {/* COLUMN 2: CANVAS/BACKGROUND */}
          <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2 tracking-widest"><MdFormatColorFill size={16}/> Canvas</h3>
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[9px] font-black text-gray-500 uppercase">Image Background</span>
              <input type="checkbox" className="w-4 h-4 cursor-pointer accent-blue-600" checked={!!formData.isBackgroundImage} onChange={e => setFormData({...formData, isBackgroundImage: e.target.checked})} />
            </div>
            
            <AnimatePresence mode="wait">
                {formData.isBackgroundImage ? (
                  <motion.div key="img" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                    <label className="text-[8px] font-bold text-gray-400 uppercase ml-1">Multimedia UUID</label>
                    <input type="text" placeholder="Enter key..." className="w-full border rounded-lg px-2 py-2 text-[10px] font-mono bg-blue-50/30" 
                        value={formData.backgroundImage || ""} onChange={e => setFormData({...formData, backgroundImage: e.target.value})} />
                  </motion.div>
                ) : (
                  <motion.div key="color" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className="flex gap-3 items-center">
                        <input type="color" className="w-12 h-10 cursor-pointer rounded-lg border-0 p-0 overflow-hidden shadow-sm" 
                          value={formData.backgroundColor || "#000000"} onChange={e => setFormData({...formData, backgroundColor: e.target.value})} />
                        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{formData.backgroundColor}</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-black text-gray-400">
                            <span>OPACITY</span>
                            <span className="text-blue-600">{Math.round((formData.backgroundOpacity ?? 1) * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.1" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                          value={formData.backgroundOpacity ?? 1} onChange={e => setFormData({...formData, backgroundOpacity: parseFloat(e.target.value)})} />
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* COLUMN 3: TYPOGRAPHY (MAIN) */}
          <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2"><MdTextFields size={16}/> Header</h3>
                <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={!!formData.isHeaderPresent} onChange={e => setFormData({...formData, isHeaderPresent: e.target.checked})} />
            </div>
            <div className={`space-y-2.5 transition-opacity ${!formData.isHeaderPresent ? 'opacity-20 pointer-events-none' : ''}`}>
                <input type="text" placeholder="Font (e.g. Montserrat)" className="w-full border rounded px-2 py-2 text-[10px] font-bold" 
                  value={formData.headerFontName || ""} onChange={e => setFormData({...formData, headerFontName: e.target.value})} />
                <div className="flex gap-2">
                    <input type="color" className="w-10 h-9 rounded shadow-inner cursor-pointer" value={formData.headerColor || "#FFFFFF"} onChange={e => setFormData({...formData, headerColor: e.target.value})} />
                    <input type="number" placeholder="Size (px)" className="w-full border rounded px-2 text-xs font-bold" 
                      value={formData.headerSize ?? ""} onChange={e => setFormData({...formData, headerSize: e.target.value})} />
                </div>
                <select className="w-full border rounded text-[10px] p-2 font-black bg-slate-50 uppercase" value={formData.headerFontType || "NORMAL"} onChange={e => setFormData({...formData, headerFontType: e.target.value})}>
                    <option value="NORMAL">Normal Weight</option>
                    <option value="BOLD">Bold Weight</option>
                    <option value="ITALIC">Italicized</option>
                </select>
            </div>
          </div>

          {/* COLUMN 4: TYPOGRAPHY (SUB) */}
          <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-[10px] font-black text-purple-500 uppercase flex items-center gap-2"><MdTextFields size={16}/> Sub Header</h3>
                <input type="checkbox" className="w-4 h-4 accent-purple-500" checked={!!formData.isSubHeaderPresent} onChange={e => setFormData({...formData, isSubHeaderPresent: e.target.checked})} />
            </div>
            <div className={`space-y-2.5 transition-opacity ${!formData.isSubHeaderPresent ? 'opacity-20 pointer-events-none' : ''}`}>
                <input type="text" placeholder="Sub Font Name" className="w-full border rounded px-2 py-2 text-[10px]" 
                  value={formData.subHeaderFontName || ""} onChange={e => setFormData({...formData, subHeaderFontName: e.target.value})} />
                <div className="flex gap-2">
                    <input type="color" className="w-10 h-9 rounded shadow-inner" value={formData.subHeaderColor || "#CCCCCC"} onChange={e => setFormData({...formData, subHeaderColor: e.target.value})} />
                    <input type="number" placeholder="Size" className="w-full border rounded px-2 text-xs font-bold text-center" 
                      value={formData.subHeaderSize ?? ""} onChange={e => setFormData({...formData, subHeaderSize: e.target.value})} />
                </div>
                <select className="w-full border rounded text-[10px] p-2 font-bold bg-slate-50 uppercase" value={formData.subHeaderFontType || "NORMAL"} onChange={e => setFormData({...formData, subHeaderFontType: e.target.value})}>
                    <option value="NORMAL">Normal</option><option value="BOLD">Bold</option><option value="ITALIC">Italic</option>
                </select>
            </div>
          </div>
        </div>

        {/* UTILITIES: LINE, OVERLAY, AUDIO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-dashed border-gray-200">
            {/* LINE CONFIG */}
            <div className="bg-white p-3 border rounded-xl flex items-center justify-between gap-4 shadow-sm">
              <div className="flex flex-col items-center">
                  <span className="text-[8px] font-black text-gray-400 mb-1">DIVIDER</span>
                  <input type="checkbox" className="w-5 h-5 accent-red-500" checked={!!formData.isLinePresent} onChange={e => setFormData({...formData, isLinePresent: e.target.checked})} />
              </div>
              <div className={`flex gap-2 items-center flex-1 transition-opacity ${!formData.isLinePresent && 'opacity-20'}`}>
                <input type="color" className="w-10 h-10 rounded-lg cursor-pointer" value={formData.lineColor || "#FF0000"} onChange={e => setFormData({...formData, lineColor: e.target.value})} />
                <input type="number" placeholder="Width" className="w-full border rounded-lg p-2 text-xs text-center font-bold" 
                  value={formData.lineWidth ?? ""} onChange={e => setFormData({...formData, lineWidth: e.target.value})} />
              </div>
            </div>

            {/* OVERLAY GEOMETRY */}
            <div className="bg-white p-3 border rounded-xl flex flex-col justify-center shadow-sm">
              <span className="text-[9px] font-black text-gray-400 block mb-2 uppercase text-center tracking-widest">Overlay Dim (W × H)</span>
              <div className="flex gap-2">
                <input type="number" placeholder="Width" className="w-1/2 border-2 rounded-lg p-2 text-[11px] text-center font-bold focus:border-blue-400 outline-none" value={formData.adImageWidth ?? ""} onChange={e => setFormData({...formData, adImageWidth: e.target.value})} />
                <input type="number" placeholder="Height" className="w-1/2 border-2 rounded-lg p-2 text-[11px] text-center font-bold focus:border-blue-400 outline-none" value={formData.adImageHeight ?? ""} onChange={e => setFormData({...formData, adImageHeight: e.target.value})} />
              </div>
            </div>

            {/* AUDIO CONFIG */}
            <div className="bg-white p-3 border rounded-xl sm:col-span-2 flex items-center gap-4 shadow-sm">
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-gray-400 mb-1 uppercase">AUDIO</span>
                <input type="checkbox" className="w-5 h-5 accent-green-600" checked={!!formData.isAudio} onChange={e => setFormData({...formData, isAudio: e.target.checked})} />
              </div>
              <div className={`flex flex-1 gap-2 items-center transition-opacity ${!formData.isAudio && 'opacity-20'}`}>
                <div className="relative flex-1">
                    <MdMusicNote className="absolute left-2 top-2.5 text-gray-400" size={14}/>
                    <input type="text" placeholder="Audio Multimedia UUID" className="w-full border rounded-lg py-2 pl-7 pr-2 text-[10px] font-mono bg-slate-50" 
                      value={formData.audioMultiMediaKey || ""} onChange={e => setFormData({...formData, audioMultiMediaKey: e.target.value})} />
                </div>
                <div className="flex flex-col w-16">
                    <span className="text-[7px] text-center font-bold text-gray-400 uppercase">VOL %</span>
                    <input type="number" className="w-full border rounded-lg p-1.5 text-[10px] text-center font-black" 
                        value={formData.audioVolumne ?? ""} onChange={e => setFormData({...formData, audioVolumne: e.target.value})} />
                </div>
              </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button onClick={handleSubmit} className="flex-1 bg-black text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[2px] hover:bg-gray-800 transition shadow-lg active:scale-95">
            {editingId ? "Update Configuration" : "Initialize Template"}
          </button>
          {editingId && (
            <button onClick={reset} className="py-4 px-8 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition border border-rose-100 flex justify-center active:scale-95">
              <MdClose size={24}/>
            </button>
          )}
        </div>
      </div>

      {/* DATA VISUALIZATION SECTION */}
      <div className="mt-4 border rounded-2xl overflow-hidden shadow-sm">
        <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase border-b bg-gray-50/50 text-center">
                        <th className="py-4 px-4 text-left w-12">State</th>
                        <th className="py-4 text-left">Profile Identity</th>
                        <th className="py-4">Typography</th>
                        <th className="py-4">Visual Props</th>
                        <th className="py-4 px-4 text-right">Management</th>
                    </tr>
                </thead>
                <tbody>
                    {intros.map(intro => (
                        <tr key={intro.id} className={`hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${intro.active ? 'bg-blue-50/30' : ''}`}>
                            <td className="py-4 px-4">
                                <button onClick={() => activateIntro(intro.id)} className="active:scale-90 transition">
                                    {intro.active ? <MdCheckCircle className="text-blue-500" size={26}/> : <MdRadioButtonUnchecked className="text-gray-200" size={26}/>}
                                </button>
                            </td>
                            <td className="py-4">
                                <div className="flex flex-col text-left">
                                    <span className="font-black text-gray-800 uppercase text-xs tracking-tight leading-none mb-1">{intro.name}</span>
                                    <span className="text-[9px] text-gray-400 font-bold max-w-[180px] truncate">{intro.description || "System Default Template"}</span>
                                </div>
                            </td>
                            <td className="py-4 text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-bold text-gray-600 uppercase">{intro.headerFontName} · {intro.headerSize}px</span>
                                    {intro.isSubHeaderPresent && <span className="text-[8px] text-gray-400 italic">Sub: {intro.subHeaderSize}px</span>}
                                </div>
                            </td>
                            <td className="py-4">
                                <div className="flex gap-3 justify-center items-center">
                                    <div className="relative group">
                                        <div className="w-7 h-7 rounded-lg border-2 border-white shadow-md overflow-hidden" style={{ backgroundColor: intro.backgroundColor || '#000', opacity: intro.backgroundOpacity }}>
                                            {intro.isBackgroundImage && <div className="w-full h-full bg-blue-400 flex items-center justify-center text-white"><MdImage size={14}/></div>}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {intro.isAudio && <MdMusicNote size={14} className="text-green-500"/>}
                                        {intro.isLinePresent && <MdHorizontalRule size={14} className="text-red-500"/>}
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <div className="flex justify-end gap-1">
                                    <button onClick={() => handleEdit(intro)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"><MdEdit size={18}/></button>
                                    <button onClick={() => deleteIntro(intro.id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors"><MdDelete size={18}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* Mobile View - Preserved from your original */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50">
            {intros.map(intro => (
                <div key={intro.id} className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${intro.active ? 'border-blue-500 bg-white' : 'bg-white border-gray-100'}`}>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <button onClick={() => activateIntro(intro.id)}>
                                {intro.active ? <MdCheckCircle className="text-blue-500" size={26}/> : <MdRadioButtonUnchecked className="text-gray-200" size={26}/>}
                            </button>
                            <div>
                                <h4 className="font-black text-[11px] uppercase text-gray-800 leading-tight">{intro.name}</h4>
                                <span className="text-[9px] text-gray-400 font-bold uppercase">{intro.headerFontName} / {intro.headerSize}px</span>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => handleEdit(intro)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MdEdit size={16}/></button>
                            <button onClick={() => deleteIntro(intro.id)} className="p-2 bg-red-50 text-red-500 rounded-lg"><MdDelete size={16}/></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}