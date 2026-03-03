import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdCheckCircle, 
  MdRadioButtonUnchecked, MdClose, MdFormatColorFill, 
  MdTextFields, MdImage, MdMusicNote, MdSettings, MdLayers
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import OutroVideoContext from "../../../contexts/VideoCreater/OutroVideo/OutroVideoContext";

export default function OutroVideoArea({ onBack }) {
  const { outros, createOutro, updateOutro, deleteOutro, activateOutro, fetchOutros } = useContext(OutroVideoContext);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    name: "", 
    description: "", 
    active: false,
    isBackgroundImage: false, 
    backgroundImage: "", // UUID
    backgroundColor: "#000000", 
    backgroundOpacity: 1.0,
    isHeaderPresent: true, 
    headerFontType: "BOLD", 
    headerFontName: "Arial", 
    headerSize: 60, 
    headerColor: "#FFFFFF",
    isSubHeaderPresent: false, 
    subHeaderFontType: "NORMAL", 
    subHeaderFontName: "Arial", 
    subHeaderSize: 40, 
    subHeaderColor: "#CCCCCC",
    isAudio: false, 
    audioMultiMediaKey: "", // UUID
    audioVolumne: 100
  };

  const [formData, setFormData] = useState(initialForm);

  const reset = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
  };

  const handleEdit = (outro) => {
    setEditingId(outro.id);
    setFormData({ ...initialForm, ...outro });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    const success = editingId ? await updateOutro(editingId, formData) : await createOutro(formData);
    if (success) reset();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
        <button onClick={onBack} className="bg-slate-100 px-4 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 hover:bg-slate-200 transition uppercase tracking-wider">
          <MdArrowBack size={16}/> Back to Creator
        </button>
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <button onClick={() => fetchOutros()} className="text-slate-400 hover:text-indigo-600 transition p-2 bg-slate-50 rounded-full active:rotate-180 duration-500">
                <MdRefresh size={20}/>
            </button>
            <div className="text-right">
                <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Outro Designer</h2>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[2px]">Branding & Credits Template</span>
            </div>
        </div>
      </div>

      {/* DESIGNER PANEL */}
      <div className={`mb-8 p-5 md:p-7 rounded-2xl border-2 transition-all shadow-sm ${editingId ? 'border-indigo-400 bg-indigo-50/10' : 'bg-slate-50/50 border-slate-200 border-dashed'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] flex items-center gap-2">
                <MdLayers size={18} className={editingId ? "text-indigo-500" : "text-slate-400"}/>
                {editingId ? "Modify Template Architecture" : "Compose New Outro Sequence"}
            </h3>
            {editingId && (
                <button onClick={reset} className="bg-white border px-3 py-1 rounded-full text-rose-500 flex items-center gap-1 text-[9px] font-black hover:bg-rose-50 transition shadow-sm uppercase">
                    <MdClose /> Discard Edit
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* COLUMN 1: BASE IDENTITY */}
          <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Template Label</label>
                <input type="text" placeholder="e.g. Corporate Standard" className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-indigo-400 bg-white" 
                  value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Internal Description</label>
                <textarea placeholder="Usage guide..." className="w-full border-2 rounded-xl px-3 py-2 text-[10px] h-20 outline-none focus:border-indigo-400 bg-white resize-none" 
                  value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          {/* COLUMN 2: CANVAS/BACKGROUND */}
          <div className="space-y-4 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
            <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-[9px] font-black text-indigo-500 uppercase flex items-center gap-2"><MdFormatColorFill/> Canvas</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-slate-400">USE IMAGE</span>
                    <input type="checkbox" className="w-4 h-4 accent-indigo-500 cursor-pointer" checked={!!formData.isBackgroundImage} onChange={e => setFormData({...formData, isBackgroundImage: e.target.checked})} />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {formData.isBackgroundImage ? (
                  <motion.div key="img" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase">Background UUID</label>
                    <input type="text" placeholder="Multimedia Key..." className="w-full border-2 rounded-lg px-2 py-2 text-[10px] font-mono bg-indigo-50/20 outline-none focus:border-indigo-400" 
                        value={formData.backgroundImage || ""} onChange={e => setFormData({...formData, backgroundImage: e.target.value})} />
                  </motion.div>
                ) : (
                  <motion.div key="color" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex gap-3 items-center bg-slate-50 p-2 rounded-xl">
                        <input type="color" className="w-10 h-10 cursor-pointer rounded-lg bg-transparent border-0 p-0" 
                          value={formData.backgroundColor || "#000000"} onChange={e => setFormData({...formData, backgroundColor: e.target.value})} />
                        <span className="text-[10px] font-mono text-slate-600 uppercase font-black tracking-tighter">{formData.backgroundColor}</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
                            <span>Opacity Control</span>
                            <span className="text-indigo-600">{Math.round((formData.backgroundOpacity || 0) * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.1" className="w-full h-1.5 accent-indigo-600 bg-slate-100 rounded-lg appearance-none cursor-pointer" 
                          value={formData.backgroundOpacity ?? 1} onChange={e => setFormData({...formData, backgroundOpacity: parseFloat(e.target.value)})} />
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* COLUMN 3: PRIMARY TYPOGRAPHY */}
          <div className="space-y-4 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-[9px] font-black text-indigo-500 uppercase flex items-center gap-2"><MdTextFields/> Header</h3>
                <input type="checkbox" className="w-4 h-4 accent-indigo-500" checked={!!formData.isHeaderPresent} onChange={e => setFormData({...formData, isHeaderPresent: e.target.checked})} />
            </div>
            <div className={`space-y-3 transition-opacity duration-300 ${!formData.isHeaderPresent ? 'opacity-20 pointer-events-none' : ''}`}>
                <input type="text" placeholder="Font (e.g. Montserrat)" className="w-full border-2 rounded-lg px-2 py-2 text-[10px] font-bold outline-none focus:border-indigo-400" 
                  value={formData.headerFontName || ""} onChange={e => setFormData({...formData, headerFontName: e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border">
                        <input type="color" className="w-6 h-6 rounded cursor-pointer border-0" value={formData.headerColor || "#FFFFFF"} onChange={e => setFormData({...formData, headerColor: e.target.value})} />
                        <span className="text-[8px] font-black text-slate-400 uppercase">HEX</span>
                    </div>
                    <input type="number" placeholder="Size" className="w-full border-2 rounded-lg px-2 text-[10px] font-black outline-none" 
                      value={formData.headerSize ?? ""} onChange={e => setFormData({...formData, headerSize: e.target.value})} />
                </div>
                <select className="w-full border-2 rounded-lg text-[9px] p-2 font-black uppercase tracking-tighter" value={formData.headerFontType || "NORMAL"} onChange={e => setFormData({...formData, headerFontType: e.target.value})}>
                    <option value="NORMAL">NORMAL WEIGHT</option><option value="BOLD">BOLD WEIGHT</option><option value="ITALIC">ITALIC STYLE</option>
                </select>
            </div>
          </div>

          {/* COLUMN 4: SECONDARY TYPOGRAPHY */}
          <div className="space-y-4 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-2"><MdTextFields/> Sub-Header</h3>
                <input type="checkbox" className="w-4 h-4 accent-rose-500" checked={!!formData.isSubHeaderPresent} onChange={e => setFormData({...formData, isSubHeaderPresent: e.target.checked})} />
            </div>
            <div className={`space-y-3 transition-opacity duration-300 ${!formData.isSubHeaderPresent ? 'opacity-20 pointer-events-none' : ''}`}>
                <input type="text" placeholder="Sub-Header Font" className="w-full border-2 rounded-lg px-2 py-2 text-[10px] font-bold outline-none focus:border-rose-400" 
                  value={formData.subHeaderFontName || ""} onChange={e => setFormData({...formData, subHeaderFontName: e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border">
                        <input type="color" className="w-6 h-6 rounded cursor-pointer border-0" value={formData.subHeaderColor || "#CCCCCC"} onChange={e => setFormData({...formData, subHeaderColor: e.target.value})} />
                        <span className="text-[8px] font-black text-slate-400 uppercase">HEX</span>
                    </div>
                    <input type="number" placeholder="Size" className="w-full border-2 rounded-lg px-2 text-[10px] font-black outline-none" 
                      value={formData.subHeaderSize ?? ""} onChange={e => setFormData({...formData, subHeaderSize: e.target.value})} />
                </div>
                <select className="w-full border-2 rounded-lg text-[9px] p-2 font-black uppercase tracking-tighter" value={formData.subHeaderFontType || "NORMAL"} onChange={e => setFormData({...formData, subHeaderFontType: e.target.value})}>
                    <option value="NORMAL">NORMAL</option><option value="BOLD">BOLD</option>
                </select>
            </div>
          </div>
        </div>

        {/* AUDIO SYNC ROW */}
        <div className="mt-6 pt-6 border-t-2 border-slate-100 border-dashed">
           <div className="bg-white p-4 rounded-2xl border-2 border-indigo-100 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="flex flex-col items-center gap-1 min-w-[100px] border-r pr-6">
                <span className="text-[8px] font-black text-slate-400 uppercase">Soundtrack</span>
                <div className="flex items-center gap-3">
                    <MdMusicNote className={formData.isAudio ? "text-indigo-500" : "text-slate-300"} size={22}/>
                    <input type="checkbox" className="w-5 h-5 accent-indigo-500" checked={!!formData.isAudio} onChange={e => setFormData({...formData, isAudio: e.target.checked})} />
                </div>
              </div>
              
              <div className={`flex flex-1 flex-col sm:flex-row gap-4 items-center w-full transition-opacity duration-300 ${!formData.isAudio && 'opacity-20 pointer-events-none'}`}>
                <div className="flex-1 w-full space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Multimedia UUID</label>
                    <input type="text" placeholder="Paste Audio Key..." className="w-full border-2 rounded-xl p-2.5 text-[10px] font-mono bg-slate-50 focus:bg-white transition shadow-inner" 
                      value={formData.audioMultiMediaKey || ""} onChange={e => setFormData({...formData, audioMultiMediaKey: e.target.value})} />
                </div>
                <div className="flex flex-col items-center w-full sm:w-24">
                  <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Volume</span>
                  <input type="number" className="w-full border-2 rounded-xl p-2.5 text-xs text-center font-black text-indigo-600 outline-none" 
                    value={formData.audioVolumne ?? ""} onChange={e => setFormData({...formData, audioVolumne: e.target.value})} />
                </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button onClick={handleSubmit} className="flex-1 bg-black text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[3px] hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
            {editingId ? "Commit Changes to Outro" : "Deploy Outro Template"}
          </button>
          {editingId && (
            <button onClick={reset} className="py-4 px-8 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-colors border border-rose-100 flex justify-center items-center shadow-sm">
              <MdClose size={24}/>
            </button>
          )}
        </div>
      </div>

      {/* REPOSITORY SECTION */}
      <div className="mt-4">
        <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full">
                <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase border-b bg-slate-50/50">
                        <th className="py-4 px-6 text-center w-16">Active</th>
                        <th className="py-4 text-left">Style Template</th>
                        <th className="py-4 text-center">Visual Assets</th>
                        <th className="py-4 text-center">Typography Mix</th>
                        <th className="py-4 px-6 text-right">Utility</th>
                    </tr>
                </thead>
                <tbody>
                    {outros.map(outro => (
                        <tr key={outro.id} className={`hover:bg-indigo-50/30 border-b border-slate-50 last:border-0 transition-colors ${outro.active ? 'bg-indigo-50/50' : ''}`}>
                            <td className="py-4 px-6 text-center">
                                <button onClick={() => activateOutro(outro.id)} className="transition-transform active:scale-125">
                                    {outro.active ? <MdCheckCircle className="text-indigo-500" size={26}/> : <MdRadioButtonUnchecked className="text-slate-200" size={26}/>}
                                </button>
                            </td>
                            <td className="py-4">
                                <div className="flex flex-col text-left">
                                    <span className="font-black text-slate-800 uppercase text-xs tracking-tight leading-none mb-1">{outro.name}</span>
                                    <span className="text-[9px] text-slate-400 font-bold max-w-[250px] truncate uppercase tracking-tighter">{outro.description || "Default Profile"}</span>
                                </div>
                            </td>
                            <td className="py-4 text-center">
                                <div className="flex gap-2 justify-center items-center">
                                    <div className="w-6 h-6 rounded-md shadow-inner border-2 border-white ring-1 ring-slate-100" style={{ backgroundColor: outro.backgroundColor || '#000', opacity: outro.backgroundOpacity }}></div>
                                    {outro.isBackgroundImage && <div className="p-1 bg-indigo-100 rounded text-indigo-600"><MdImage size={16}/></div>}
                                    {outro.isAudio && <div className="p-1 bg-rose-100 rounded text-rose-600"><MdMusicNote size={16}/></div>}
                                </div>
                            </td>
                            <td className="py-4 text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex gap-1">
                                        {outro.isHeaderPresent && <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[8px] font-black text-slate-600 border border-slate-200">H1</span>}
                                        {outro.isSubHeaderPresent && <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[8px] font-black text-slate-600 border border-slate-200">H2</span>}
                                    </div>
                                    <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">{outro.headerFontName || 'System'} / {outro.headerSize}px</span>
                                </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                                <div className="flex justify-end gap-1">
                                    <button onClick={() => handleEdit(outro)} className="p-2 text-indigo-500 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-indigo-100 transition-all"><MdEdit size={18}/></button>
                                    <button onClick={() => deleteOutro(outro.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><MdDelete size={18}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {outros.map(outro => (
                <div key={outro.id} className={`p-5 rounded-2xl border-2 transition-all ${outro.active ? 'border-indigo-500 bg-white shadow-md' : 'bg-white border-slate-100'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => activateOutro(outro.id)}>
                                {outro.active ? <MdCheckCircle className="text-indigo-500" size={28}/> : <MdRadioButtonUnchecked className="text-slate-200" size={28}/>}
                            </button>
                            <div>
                                <h4 className="font-black text-xs uppercase text-slate-800 leading-tight">{outro.name}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{outro.description?.slice(0,30)}...</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => handleEdit(outro)} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><MdEdit size={16}/></button>
                            <button onClick={() => deleteOutro(outro.id)} className="p-2 bg-rose-50 text-rose-500 rounded-xl"><MdDelete size={16}/></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}