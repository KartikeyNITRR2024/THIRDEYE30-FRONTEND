import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdCheckCircle, 
  MdRadioButtonUnchecked, MdClose, MdFormatColorFill, 
  MdTextFields, MdImage, MdMusicNote, MdSettings, MdAdd,
  MdLayers, MdPalette, MdOutlineTextFields, MdStraighten, MdBusiness
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import IntroVideoContext from "../../../contexts/VideoCreater/IntroVideo/IntroVideoContext";

export default function IntroVideoArea({ onBack }) {
  const { intros, createIntro, updateIntro, deleteIntro, activateIntro, fetchIntros } = useContext(IntroVideoContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 1. Updated Initial State - Including Company Name fields
  const emptyForm = {
    name: null, 
    description: null, 
    active: false,
    isBackgroundImage: false, 
    backgroundImage: null, 
    backgroundColor: null, 
    backgroundOpacity: null, 
    isHeaderPresent: false, 
    headerFontType: null, 
    headerFontName: null, 
    headerSize: null, 
    headerColor: null,
    isSubHeaderPresent: false, 
    subHeaderFontType: null, 
    subHeaderFontName: null, 
    subHeaderSize: null, 
    subHeaderColor: null,
    isLinePresent: false, 
    lineColor: null, 
    lineWidth: null, 
    adImageHeight: null, 
    adImageWidth: null, 
    isAudio: false, 
    audioMultiMediaKey: null, 
    audioVolumne: null,
    // NEW FIELDS
    iscompanyNamePresent: false,
    companyNamefontSize: null,
    companyNamefontColor: null,
    companyNamefontName: null
  };

  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => { 
    setEditingId(null); 
    setFormData(emptyForm); 
    setIsModalOpen(false);
  };

  const startEdit = (intro) => {
    setEditingId(intro.id);
    setFormData({ ...emptyForm, ...intro });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) return;

    // Casting logic for the payload - including new numeric field
    const payload = {
      ...formData,
      backgroundOpacity: formData.backgroundOpacity ? parseFloat(formData.backgroundOpacity) : 0,
      headerSize: formData.headerSize ? parseInt(formData.headerSize) : 0,
      subHeaderSize: formData.subHeaderSize ? parseInt(formData.subHeaderSize) : 0,
      companyNamefontSize: formData.companyNamefontSize ? parseInt(formData.companyNamefontSize) : 0,
      lineWidth: formData.lineWidth ? parseInt(formData.lineWidth) : 0,
      adImageWidth: formData.adImageWidth ? parseInt(formData.adImageWidth) : 0,
      adImageHeight: formData.adImageHeight ? parseInt(formData.adImageHeight) : 0,
      audioVolumne: formData.audioVolumne ? parseInt(formData.audioVolumne) : 0
    };

    const success = editingId ? await updateIntro(editingId, payload) : await createIntro(payload);
    if (success) resetForm();
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 font-sans text-slate-900">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            <MdArrowBack size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase leading-none mb-1">Intro Templates</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{intros.length} Layouts Loaded</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => fetchIntros()} className="flex-1 sm:flex-none bg-white p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition shadow-sm">
            <MdRefresh size={20} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-3 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
          >
            <MdAdd size={18} /> Create Template
          </button>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {intros.map((intro) => (
          <motion.div layout key={intro.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${intro.active ? 'bg-purple-600' : 'bg-slate-200'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[200px]">
                <h4 className="font-black text-slate-900 uppercase text-xs mb-1 truncate leading-tight">
                  {intro.name || "Unnamed Layout"}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mb-2">
                  {intro.description || "No description provided."}
                </p>
                <div className="flex flex-wrap gap-2">
                   <span className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-black uppercase border border-slate-200">
                     {intro.headerFontName || 'Default'} · {intro.headerSize || 0}px
                   </span>
                </div>
              </div>

              <div className="flex gap-1">
                <button onClick={() => startEdit(intro)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <MdEdit size={18} />
                </button>
                <button onClick={() => deleteIntro(intro.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
                  <MdDelete size={18} />
                </button>
              </div>
            </div>

            {/* Visual Specs Preview */}
            <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded border border-white shadow-sm" style={{ backgroundColor: intro.backgroundColor || '#000', opacity: intro.backgroundOpacity || 1 }}></div>
                   <span className="text-[8px] font-black text-slate-500 uppercase">Canvas</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                   <span className="text-[8px] font-black text-slate-400 uppercase">Audio:</span>
                   <span className={`text-[8px] font-black ${intro.isAudio ? 'text-emerald-600' : 'text-slate-300'}`}>{intro.isAudio ? 'ON' : 'OFF'}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
               <button onClick={() => activateIntro(intro.id)} className="flex items-center gap-2 group">
                  {intro.active ? <MdCheckCircle size={22} className="text-purple-600"/> : <MdRadioButtonUnchecked size={22} className="text-slate-200 group-hover:text-purple-300"/>}
                  <span className={`text-[10px] font-black uppercase ${intro.active ? 'text-purple-600' : 'text-slate-400'}`}>
                    {intro.active ? 'Selected' : 'Use Template'}
                  </span>
               </button>
               <div className="flex gap-1">
                  {intro.isLinePresent && <MdLayers className="text-rose-400" size={14}/>}
                  {intro.isBackgroundImage && <MdImage className="text-blue-400" size={14}/>}
                  {intro.iscompanyNamePresent && <MdBusiness className="text-amber-500" size={14}/>}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL CONFIGURATION */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 text-white rounded-lg"><MdPalette size={20} /></div>
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
                    {editingId ? "Modify Template Core" : "Initialize New Intro Design"}
                  </h3>
                </div>
                <button onClick={resetForm} className="p-2 text-slate-400 hover:text-rose-500 transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto">
                
                {/* COLUMN 1: IDENTITY & CANVAS */}
                <div className="space-y-6">
                    <section className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MdSettings size={14}/> Identity</label>
                      <input type="text" placeholder="Layout Name" className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-purple-500 transition-all" 
                        value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
                      <textarea placeholder="Layout Description..." className="w-full border-2 border-slate-100 rounded-xl px-4 py-2 text-[11px] h-20 resize-none outline-none focus:border-purple-500" 
                        value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </section>

                    <section className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MdFormatColorFill size={14}/> Canvas Logic</label>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black text-slate-500">IMAGE OVERLAY</span>
                        <input type="checkbox" className="w-4 h-4 accent-purple-600" checked={formData.isBackgroundImage} onChange={e => setFormData({...formData, isBackgroundImage: e.target.checked})} />
                      </div>
                      
                      {formData.isBackgroundImage ? (
                        <input type="text" placeholder="Image UUID Key" className="w-full border rounded-lg p-2 text-[10px] font-mono bg-white" 
                          value={formData.backgroundImage || ""} onChange={e => setFormData({...formData, backgroundImage: e.target.value})} />
                      ) : (
                        <div className="flex items-center gap-4">
                           <input type="color" className="w-10 h-10 rounded shadow-sm border-0" value={formData.backgroundColor || "#000000"} onChange={e => setFormData({...formData, backgroundColor: e.target.value})} />
                           <div className="flex-1">
                              <div className="flex justify-between text-[8px] font-black mb-1"><span>OPACITY</span><span>{Math.round((formData.backgroundOpacity || 0) * 100)}%</span></div>
                              <input type="range" min="0" max="1" step="0.1" className="w-full accent-purple-600" value={formData.backgroundOpacity || 0} onChange={e => setFormData({...formData, backgroundOpacity: e.target.value})} />
                           </div>
                        </div>
                      )}
                    </section>
                </div>

                {/* COLUMN 2: TYPOGRAPHY ENGINE */}
                <div className="space-y-6 md:border-x border-slate-100 md:px-6">
                    {/* Header Section */}
                    <section className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MdTextFields size={16}/> Header</label>
                        <input type="checkbox" className="w-4 h-4 accent-slate-900" checked={formData.isHeaderPresent} onChange={e => setFormData({...formData, isHeaderPresent: e.target.checked})} />
                      </div>
                      <div className={`space-y-3 ${!formData.isHeaderPresent && 'opacity-20 pointer-events-none'}`}>
                        <input type="text" placeholder="Font Family" className="w-full border rounded-lg p-2 text-[10px] font-bold" value={formData.headerFontName || ""} onChange={e => setFormData({...formData, headerFontName: e.target.value})} />
                        <div className="flex gap-2">
                           <input type="color" className="w-10 h-9 rounded" value={formData.headerColor || "#FFFFFF"} onChange={e => setFormData({...formData, headerColor: e.target.value})} />
                           <input type="number" placeholder="Size" className="flex-1 border rounded-lg p-2 text-xs font-black" value={formData.headerSize || ""} onChange={e => setFormData({...formData, headerSize: e.target.value})} />
                        </div>
                        <select className="w-full border rounded-lg p-2 text-[10px] font-black uppercase bg-slate-50" value={formData.headerFontType || ""} onChange={e => setFormData({...formData, headerFontType: e.target.value})}>
                          <option value="">Select Type</option><option value="NORMAL">Normal</option><option value="BOLD">Bold</option><option value="ITALIC">Italic</option>
                        </select>
                      </div>
                    </section>

                    {/* Subheader Section */}
                    <section className="space-y-4 pt-4 border-t border-slate-50">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MdOutlineTextFields size={16}/> Sub Header</label>
                        <input type="checkbox" className="w-4 h-4 accent-slate-900" checked={formData.isSubHeaderPresent} onChange={e => setFormData({...formData, isSubHeaderPresent: e.target.checked})} />
                      </div>
                      <div className={`space-y-3 ${!formData.isSubHeaderPresent && 'opacity-20 pointer-events-none'}`}>
                        <input type="text" placeholder="Sub Font Family" className="w-full border rounded-lg p-2 text-[10px] font-bold" value={formData.subHeaderFontName || ""} onChange={e => setFormData({...formData, subHeaderFontName: e.target.value})} />
                        <div className="flex gap-2">
                           <input type="color" className="w-10 h-9 rounded" value={formData.subHeaderColor || "#CCCCCC"} onChange={e => setFormData({...formData, subHeaderColor: e.target.value})} />
                           <input type="number" placeholder="Size" className="flex-1 border rounded-lg p-2 text-xs font-black" value={formData.subHeaderSize || ""} onChange={e => setFormData({...formData, subHeaderSize: e.target.value})} />
                        </div>
                      </div>
                    </section>

                    {/* NEW: Company Name Section */}
                    <section className="space-y-4 pt-4 border-t border-slate-50">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MdBusiness size={16}/> Company Name</label>
                        <input type="checkbox" className="w-4 h-4 accent-amber-500" checked={formData.iscompanyNamePresent} onChange={e => setFormData({...formData, iscompanyNamePresent: e.target.checked})} />
                      </div>
                      <div className={`space-y-3 ${!formData.iscompanyNamePresent && 'opacity-20 pointer-events-none'}`}>
                        <input type="text" placeholder="Company Font Name" className="w-full border rounded-lg p-2 text-[10px] font-bold" value={formData.companyNamefontName || ""} onChange={e => setFormData({...formData, companyNamefontName: e.target.value})} />
                        <div className="flex gap-2">
                           <input type="color" className="w-10 h-9 rounded" value={formData.companyNamefontColor || "#FFFFFF"} onChange={e => setFormData({...formData, companyNamefontColor: e.target.value})} />
                           <input type="number" placeholder="Size" className="flex-1 border rounded-lg p-2 text-xs font-black" value={formData.companyNamefontSize || ""} onChange={e => setFormData({...formData, companyNamefontSize: e.target.value})} />
                        </div>
                      </div>
                    </section>
                </div>

                {/* COLUMN 3: DECOR & AUDIO */}
                <div className="space-y-6">
                   <section className="p-4 bg-slate-900 rounded-2xl text-white space-y-4">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[2px] block text-center">Decoration & Line</label>
                      <div className="flex items-center gap-4">
                        <input type="checkbox" className="w-5 h-5 accent-rose-500" checked={formData.isLinePresent} onChange={e => setFormData({...formData, isLinePresent: e.target.checked})} />
                        <input type="color" className="w-10 h-10 rounded border-2 border-slate-700" value={formData.lineColor || "#FF0000"} onChange={e => setFormData({...formData, lineColor: e.target.value})} />
                        <input type="number" placeholder="Width" className="flex-1 bg-slate-800 border-0 rounded-lg p-2 text-xs font-black text-white outline-none focus:ring-1 ring-rose-500" value={formData.lineWidth || ""} onChange={e => setFormData({...formData, lineWidth: e.target.value})} />
                      </div>
                   </section>

                   <section className="p-4 border-2 border-slate-100 rounded-2xl space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><MdStraighten size={16}/> Geometry Overlay</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 block mb-1">WIDTH</span>
                          <input type="number" className="w-full border rounded-lg p-2 text-xs font-black" value={formData.adImageWidth || ""} onChange={e => setFormData({...formData, adImageWidth: e.target.value})} />
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-slate-400 block mb-1">HEIGHT</span>
                          <input type="number" className="w-full border rounded-lg p-2 text-xs font-black" value={formData.adImageHeight || ""} onChange={e => setFormData({...formData, adImageHeight: e.target.value})} />
                        </div>
                      </div>
                   </section>

                   <section className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2"><MdMusicNote size={16}/> Audio</span>
                        <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={formData.isAudio} onChange={e => setFormData({...formData, isAudio: e.target.checked})} />
                      </div>
                      <div className={!formData.isAudio ? 'opacity-20 pointer-events-none' : ''}>
                        <input type="text" placeholder="Audio UUID" className="w-full border rounded-lg p-2 text-[10px] font-mono mb-2" value={formData.audioMultiMediaKey || ""} onChange={e => setFormData({...formData, audioMultiMediaKey: e.target.value})} />
                        <input type="number" placeholder="Volume %" className="w-full border rounded-lg p-2 text-xs font-black" value={formData.audioVolumne || ""} onChange={e => setFormData({...formData, audioVolumne: e.target.value})} />
                      </div>
                   </section>
                </div>
              </div>

              {/* FOOTER */}
              <div className="p-6 bg-slate-50 border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-white transition-all">Cancel</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={!formData.name}
                  className="flex-[2] py-3 rounded-xl text-[10px] font-black uppercase tracking-[2px] bg-slate-900 text-white shadow-lg hover:bg-black transition-all disabled:opacity-30"
                >
                   {editingId ? "Commit Changes" : "Deploy Template"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}