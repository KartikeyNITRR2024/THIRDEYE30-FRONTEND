import { useContext, useState } from "react";
import { 
  MdArrowBack, MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked, 
  MdClose, MdPalette, MdGraphicEq, MdStraighten 
} from "react-icons/md";
import { motion } from "framer-motion";
import NewsTextSoundContext from "../../../contexts/VideoCreater/NewsTextSound/NewsTextSoundContext";

export default function NewsTextSoundArea({ onBack }) {
  const { 
    newsTextSounds, 
    createNewsTextSound, 
    updateNewsTextSound, 
    deleteNewsTextSound, 
    activateNewsTextSound 
  } = useContext(NewsTextSoundContext);

  const [editingId, setEditingId] = useState(null);

  // 1. Initial values set to null or empty defaults
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

  // 2. Reset logic to return everything to the "null" state
  const reset = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!formData.name) {
        alert("Please enter a style name.");
        return;
    }

    // Convert potential nulls/strings to correct types for the API
    const payload = {
      ...formData,
      boxAlpha: parseFloat(formData.boxAlpha ?? 0),
      boxPad: parseFloat(formData.boxPad ?? 0),
      dpi: parseInt(formData.dpi ?? 300),
      transitionT: parseFloat(formData.transitionT ?? 0.5),
      focusY: parseFloat(formData.focusY ?? 0.5),
      gapMain: parseFloat(formData.gapMain ?? 0),
      gapSub: parseFloat(formData.gapSub ?? 0),
      sideScale: parseFloat(formData.sideScale ?? 1.0),
      headerWrap: parseInt(formData.headerWrap ?? 0),
      contentWrap: parseInt(formData.contentWrap ?? 0),
      otherWrap: parseInt(formData.otherWrap ?? 0),
      baseFontSize: parseInt(formData.baseFontSize ?? 24),
      endSilenceTimeInSeconds: parseFloat(formData.endSilenceTimeInSeconds ?? 0),
      audioVolumne: parseInt(formData.audioVolumne ?? 100)
    };

    const success = editingId 
      ? await updateNewsTextSound(editingId, payload) 
      : await createNewsTextSound(payload);

    if (success) reset();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-3 md:p-6 shadow-md mt-6 border border-gray-100">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button onClick={onBack} className="bg-gray-100 px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 hover:bg-gray-200 transition">
          <MdArrowBack/> BACK
        </button>
        <div className="text-right">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-tighter">News Typography & Audio</h2>
          <span className="text-[10px] text-gray-400 font-bold uppercase">Multi-line Text Engine</span>
        </div>
      </div>

      {/* FORM AREA */}
      <div className={`mb-8 p-4 md:p-6 rounded-2xl border-2 transition-all ${editingId ? 'border-blue-200 bg-blue-50/10' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                {editingId ? "Mode: Editing Existing Style" : "Mode: Create New Style"}
            </h3>
            {editingId && (
                <button onClick={reset} className="flex items-center gap-1 text-[10px] font-black text-rose-500 hover:bg-rose-100 px-2 py-1 rounded">
                    <MdClose /> CANCEL EDIT
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* GROUP 1: CORE VISUALS */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-rose-600 flex items-center gap-2 uppercase"><MdPalette/> Theme & Box</h3>
            <input type="text" placeholder="Style Name" className="w-full border rounded-lg px-3 py-2 text-xs font-bold shadow-sm" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
            <textarea placeholder="Description" className="w-full border rounded-lg px-3 py-2 text-[10px] h-14 shadow-sm" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
            
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 bg-white rounded border">
                <label className="text-[7px] font-black text-gray-400 uppercase">BG</label>
                <input type="color" value={formData.bgTheme || "#000000"} onChange={e => setFormData({...formData, bgTheme: e.target.value})} />
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded border">
                <label className="text-[7px] font-black text-gray-400 uppercase">ACCENT</label>
                <input type="color" value={formData.accentColor || "#FF0000"} onChange={e => setFormData({...formData, accentColor: e.target.value})} />
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded border">
                <label className="text-[7px] font-black text-gray-400 uppercase">TEXT</label>
                <input type="color" value={formData.textColor || "#FFFFFF"} onChange={e => setFormData({...formData, textColor: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-[8px] font-black text-gray-400 uppercase">Alpha (0-1)</label><input type="number" step="0.1" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.boxAlpha ?? ""} onChange={e => setFormData({...formData, boxAlpha: e.target.value})} /></div>
              <div><label className="text-[8px] font-black text-gray-400 uppercase">Box Padding</label><input type="number" step="0.1" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.boxPad ?? ""} onChange={e => setFormData({...formData, boxPad: e.target.value})} /></div>
            </div>
            <div><label className="text-[8px] font-black text-gray-400 uppercase">DPI (Render Quality)</label><input type="number" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.dpi ?? ""} onChange={e => setFormData({...formData, dpi: e.target.value})} /></div>
          </div>

          {/* GROUP 2: GEOMETRY & WRAPPING */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-rose-600 flex items-center gap-2 uppercase"><MdStraighten/> Geometry & Wrap</h3>
            <div className="p-4 bg-white rounded-xl border shadow-sm space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <div><label className="text-[7px] font-black text-gray-400">HEADER W</label><input type="number" className="w-full border rounded p-1 text-[10px] font-bold" value={formData.headerWrap ?? ""} onChange={e => setFormData({...formData, headerWrap: e.target.value})} /></div>
                    <div><label className="text-[7px] font-black text-gray-400">CONTENT W</label><input type="number" className="w-full border rounded p-1 text-[10px] font-bold" value={formData.contentWrap ?? ""} onChange={e => setFormData({...formData, contentWrap: e.target.value})} /></div>
                    <div><label className="text-[7px] font-black text-gray-400">OTHER W</label><input type="number" className="w-full border rounded p-1 text-[10px] font-bold" value={formData.otherWrap ?? ""} onChange={e => setFormData({...formData, otherWrap: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[8px] font-black text-gray-400 uppercase">Gap Main</label><input type="number" step="0.1" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.gapMain ?? ""} onChange={e => setFormData({...formData, gapMain: e.target.value})} /></div>
                    <div><label className="text-[8px] font-black text-gray-400 uppercase">Gap Sub</label><input type="number" step="0.1" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.gapSub ?? ""} onChange={e => setFormData({...formData, gapSub: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[8px] font-black text-gray-400 uppercase">Focus Y</label><input type="number" step="0.1" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.focusY ?? ""} onChange={e => setFormData({...formData, focusY: e.target.value})} /></div>
                    <div><label className="text-[8px] font-black text-gray-400 uppercase">Side Scale</label><input type="number" step="0.1" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.sideScale ?? ""} onChange={e => setFormData({...formData, sideScale: e.target.value})} /></div>
                </div>
                <div><label className="text-[8px] font-black text-gray-400 uppercase">Base Font Size (PX)</label><input type="number" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.baseFontSize ?? ""} onChange={e => setFormData({...formData, baseFontSize: e.target.value})} /></div>
            </div>
          </div>

          {/* GROUP 3: AUDIO & MOTION */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-rose-600 flex items-center gap-2 uppercase"><MdGraphicEq/> Audio & Motion</h3>
            <div className="p-4 bg-white rounded-xl border shadow-sm space-y-3">
                <div className="flex justify-between items-center bg-rose-50 p-2 rounded-lg">
                    <span className="text-[9px] font-black text-rose-700 uppercase">Enable TTS Audio</span>
                    <input type="checkbox" checked={formData.isAudio || false} onChange={e => setFormData({...formData, isAudio: e.target.checked})} />
                </div>
                {formData.isAudio && (
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[7px] font-black text-gray-400 uppercase">Silence (S)</label><input type="number" step="0.1" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.endSilenceTimeInSeconds ?? ""} onChange={e => setFormData({...formData, endSilenceTimeInSeconds: e.target.value})} /></div>
                    <div><label className="text-[7px] font-black text-gray-400 uppercase">Volume %</label><input type="number" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.audioVolumne ?? ""} onChange={e => setFormData({...formData, audioVolumne: e.target.value})} /></div>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <label className="text-[8px] font-black text-gray-400 uppercase">Transition Time (Sec)</label>
                  <input type="number" step="0.1" className="w-full border rounded p-1.5 text-xs font-bold" value={formData.transitionT ?? ""} onChange={e => setFormData({...formData, transitionT: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[7px] font-black text-gray-400 uppercase">Enter</label><select className="w-full border text-[10px] p-1 font-bold" value={formData.enterFrom || "BOTTOM"} onChange={e => setFormData({...formData, enterFrom: e.target.value})}><option>LEFT</option><option>RIGHT</option><option>TOP</option><option>BOTTOM</option></select></div>
                    <div><label className="text-[7px] font-black text-gray-400 uppercase">Exit</label><select className="w-full border text-[10px] p-1 font-bold" value={formData.exitTo || "BOTTOM"} onChange={e => setFormData({...formData, exitTo: e.target.value})}><option>LEFT</option><option>RIGHT</option><option>TOP</option><option>BOTTOM</option></select></div>
                </div>
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} className={`w-full mt-6 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition active:scale-[0.98] ${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 shadow-lg' : 'bg-black hover:bg-gray-800'}`}>
          {editingId ? "Update News Style" : "Initialize News Style"}
        </button>
      </div>

      {/* LIST TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 uppercase border-b bg-gray-50/50">
              <th className="p-4 text-left w-12">Active</th>
              <th className="p-4 text-left">News Style</th>
              <th className="p-4 text-center">Config Summary</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsTextSounds.map(item => (
              <tr key={item.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${item.active ? 'bg-rose-50/20' : ''}`}>
                <td className="p-4 text-center">
                  <button onClick={() => activateNewsTextSound(item.id)}>
                    {item.active ? <MdCheckCircle className="text-rose-500" size={24}/> : <MdRadioButtonUnchecked className="text-gray-200" size={24}/>}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800 uppercase tracking-tight">{item.name}</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase truncate max-w-[200px]">{item.description || "NO DESCRIPTION"}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded shadow-inner border" style={{backgroundColor: item.bgTheme}} title="Background" />
                      <div className="w-4 h-4 rounded shadow-inner border" style={{backgroundColor: item.accentColor}} title="Accent" />
                      <div className="w-4 h-4 rounded shadow-inner border" style={{backgroundColor: item.textColor}} title="Text" />
                    </div>
                    <span className="text-[8px] font-black text-gray-500 uppercase">
                        Scale: {item.sideScale} | Font: {item.baseFontSize}px | Gap: {item.gapSub}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                   <div className="flex justify-end gap-1">
                     <button onClick={() => handleEdit(item)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><MdEdit size={18}/></button>
                     <button onClick={() => deleteNewsTextSound(item.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors"><MdDelete size={18}/></button>
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