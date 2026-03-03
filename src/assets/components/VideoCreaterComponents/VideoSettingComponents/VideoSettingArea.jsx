import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdCheckCircle, 
  MdRadioButtonUnchecked, MdClose, MdMusicNote, MdSettings, 
  MdVideocam, MdTimer, MdViewQuilt, MdGraphicEq
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import VideoSettingContext from "../../../contexts/VideoCreater/VideoSetting/VideoSettingContext";

export default function VideoSettingArea({ onBack }) {
  const { settings, fetchSettings, createSetting, updateSetting, deleteSetting, activateSetting } = useContext(VideoSettingContext);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = {
    name: "", description: "", fps: 30, height: 1080, width: 1920,
    introPresent: false, introTime: 0,
    mainVideoPresent: true, mainVideoTime: 0,
    outroPresent: false, outroTime: 0, 
    sequence: "I,M,O", isAudio: false,
    audioMultiMediaKey: "", audioVolumne: 100
  };

  const [formData, setFormData] = useState(initialForm);

  const reset = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    if (editingId) {
      const success = await updateSetting(editingId, formData);
      if (success) reset();
    } else {
      createSetting(formData);
      reset();
    }
  };

  const startEdit = (s) => { 
    setEditingId(s.id); 
    setFormData({ ...initialForm, ...s }); 
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
      
      {/* ENGINE HEADER */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button onClick={onBack} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 text-[10px] font-black transition uppercase tracking-wider shadow-sm active:scale-95">
          <MdArrowBack size={16} /> BACK
        </button>
        <div className="flex items-center gap-4">
          <button onClick={() => fetchSettings()} className="text-slate-400 hover:text-blue-600 transition-all hover:rotate-180 duration-500 p-2 bg-slate-50 rounded-full">
            <MdRefresh size={22} />
          </button>
          <div className="text-right">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-tight">Video Profiles</h2>
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest leading-none">Engine Configuration</span>
          </div>
        </div>
      </div>

      {/* CONFIGURATION PANEL */}
      <div className={`mb-8 p-6 rounded-2xl border-2 transition-all ${editingId ? 'border-blue-400 bg-blue-50/20' : 'bg-slate-50/50 border-slate-200 border-dashed'}`}>
        <div className="flex items-center gap-2 mb-6 text-slate-500">
            <MdSettings size={18} className={editingId ? "text-blue-500" : ""} />
            <h3 className="text-[10px] font-black uppercase tracking-[2px]">{editingId ? "Modify Global Constants" : "Define New Render Profile"}</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* GROUP 1: BASE PARAMETERS */}
          <div className="lg:col-span-2 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Profile Identity</label>
                    <input type="text" placeholder="e.g., 4K TikTok Vertical" className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-blue-500 transition shadow-sm bg-white"
                        value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Description</label>
                    <input type="text" placeholder="Brief use case..." className="w-full border-2 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-500 transition shadow-sm bg-white"
                        value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
             </div>

             <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Width (px)</label>
                    <input type="number" className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-center focus:border-blue-500 outline-none bg-white" 
                        value={formData.width ?? ""} onChange={e => setFormData({...formData, width: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Height (px)</label>
                    <input type="number" className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-center focus:border-blue-500 outline-none bg-white" 
                        value={formData.height ?? ""} onChange={e => setFormData({...formData, height: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Framerate</label>
                    <input type="number" className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-black text-center text-blue-600 focus:border-blue-500 outline-none bg-white" 
                        value={formData.fps ?? ""} onChange={e => setFormData({...formData, fps: e.target.value})} />
                </div>
             </div>
          </div>

          {/* GROUP 2: TIMELINE FLOW */}
          <div className="lg:col-span-2 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Intro */}
                <div className={`p-3 rounded-xl border-2 transition-all bg-white ${formData.introPresent ? 'border-indigo-200 ring-4 ring-indigo-50' : 'border-slate-100 opacity-60'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black text-indigo-500 uppercase flex items-center gap-1"><MdTimer/> Intro</span>
                        <input type="checkbox" className="accent-indigo-500" checked={!!formData.introPresent} onChange={e => setFormData({...formData, introPresent: e.target.checked})} />
                    </div>
                    <div className="flex items-center gap-1">
                        <input type="number" className="w-full bg-slate-50 rounded text-xs p-1 font-bold text-center outline-none" placeholder="Secs" 
                            value={formData.introTime ?? ""} onChange={e => setFormData({...formData, introTime: e.target.value})} />
                        <span className="text-[8px] font-bold text-slate-400">SEC</span>
                    </div>
                </div>

                {/* Main */}
                <div className={`p-3 rounded-xl border-2 transition-all bg-white ${formData.mainVideoPresent ? 'border-blue-200 ring-4 ring-blue-50 shadow-sm' : 'border-slate-100 opacity-60'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1"><MdVideocam/> Main</span>
                        <input type="checkbox" className="accent-blue-600" checked={!!formData.mainVideoPresent} onChange={e => setFormData({...formData, mainVideoPresent: e.target.checked})} />
                    </div>
                    <div className="flex items-center gap-1">
                        <input type="number" className="w-full bg-blue-50 rounded text-xs p-1 font-black text-center outline-none" placeholder="Secs" 
                            value={formData.mainVideoTime ?? ""} onChange={e => setFormData({...formData, mainVideoTime: e.target.value})} />
                        <span className="text-[8px] font-bold text-blue-400">SEC</span>
                    </div>
                </div>

                {/* Outro */}
                <div className={`p-3 rounded-xl border-2 transition-all bg-white ${formData.outroPresent ? 'border-purple-200 ring-4 ring-purple-50' : 'border-slate-100 opacity-60'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black text-purple-500 uppercase flex items-center gap-1"><MdTimer/> Outro</span>
                        <input type="checkbox" className="accent-purple-500" checked={!!formData.outroPresent} onChange={e => setFormData({...formData, outroPresent: e.target.checked})} />
                    </div>
                    <div className="flex items-center gap-1">
                        <input type="number" className="w-full bg-slate-50 rounded text-xs p-1 font-bold text-center outline-none" placeholder="Secs" 
                            value={formData.outroTime ?? ""} onChange={e => setFormData({...formData, outroTime: e.target.value})} />
                        <span className="text-[8px] font-bold text-slate-400">SEC</span>
                    </div>
                </div>
             </div>

             <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdViewQuilt/> Composition Order</label>
                    <input type="text" placeholder="I,M,O" className="w-full border-2 rounded-xl px-3 py-2 text-xs font-mono font-black text-center uppercase focus:border-blue-500 outline-none bg-white tracking-[5px]" 
                        value={formData.sequence || ""} onChange={e => setFormData({...formData, sequence: e.target.value.toUpperCase()})} />
                </div>
                <div className="w-1/3 space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdMusicNote/> Volume</label>
                    <div className="flex items-center gap-3 border-2 rounded-xl px-3 py-2 bg-white">
                        <input type="checkbox" className="accent-slate-800" checked={!!formData.isAudio} onChange={e => setFormData({...formData, isAudio: e.target.checked})} />
                        <input type="number" className="w-full text-xs font-black text-center outline-none" 
                            value={formData.audioVolumne ?? ""} onChange={e => setFormData({...formData, audioVolumne: e.target.value})} />
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* CONDITIONAL AUDIO KEY */}
        <AnimatePresence>
            {formData.isAudio && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-dashed border-slate-200">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-inner">
                        <MdGraphicEq className="text-blue-500" size={20}/>
                        <input type="text" placeholder="Audio Multimedia Source UUID" className="flex-1 text-[10px] font-mono outline-none"
                        value={formData.audioMultiMediaKey || ""} onChange={e => setFormData({...formData, audioMultiMediaKey: e.target.value})} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
            <button onClick={handleSubmit} className="flex-1 bg-black text-white rounded-xl text-[11px] font-black uppercase tracking-[3px] hover:bg-blue-600 transition-all py-4 shadow-lg active:scale-[0.98]">
                {editingId ? "Commit Profile Update" : "Establish New Engine Profile"}
            </button>
            {editingId && (
                <button onClick={reset} className="bg-rose-50 text-rose-500 px-6 rounded-xl hover:bg-rose-500 hover:text-white transition-colors border border-rose-100 flex items-center shadow-sm">
                    <MdClose size={24}/>
                </button>
            )}
        </div>
      </div>

      {/* REPOSITORY TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-black uppercase text-slate-400 border-b bg-slate-50/50">
              <th className="py-4 px-4 text-center w-16">Active</th>
              <th className="py-4 text-left">Configuration Profile</th>
              <th className="py-4 text-center">Engine Specs</th>
              <th className="py-4 text-center">Sequence Flow</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
                {settings.map(s => (
                <motion.tr key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors ${s.active ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-4 px-4 text-center">
                    <button onClick={() => activateSetting(s.id)} className="transition-transform active:scale-125">
                        {s.active ? <MdCheckCircle className="text-blue-500" size={24}/> : <MdRadioButtonUnchecked className="text-slate-200" size={24}/>}
                    </button>
                    </td>
                    <td className="py-4">
                    <div className="flex flex-col">
                        <span className="font-black text-slate-800 uppercase text-xs tracking-tight leading-none mb-1">{s.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{s.description || "System Global Profile"}</span>
                    </div>
                    </td>
                    <td className="py-4 text-center">
                    <div className="inline-flex flex-col bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-mono font-black text-slate-600 leading-none">
                            {s.width}×{s.height}
                        </span>
                        <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">{s.fps} FPS</span>
                    </div>
                    </td>
                    <td className="py-4 text-center">
                    <div className="flex gap-1 justify-center items-center">
                        <div className="flex bg-white rounded-md border shadow-sm overflow-hidden">
                            {s.introPresent && <div className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black border-r border-indigo-100">{s.introTime}s</div>}
                            
                            {s.mainVideoPresent ? (
                                <div className="px-2 py-1 bg-blue-600 text-white text-[8px] font-black">M: {s.mainVideoTime}s</div>
                            ) : (
                                <div className="px-2 py-1 bg-slate-100 text-slate-400 text-[8px] font-black italic">SKIP</div>
                            )}

                            {s.outroPresent && <div className="px-2 py-1 bg-purple-50 text-purple-600 text-[8px] font-black border-l border-purple-100">{s.outroTime}s</div>}
                        </div>
                    </div>
                    <div className="mt-1 text-[8px] font-mono font-bold text-slate-400 tracking-[3px]">{s.sequence}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-1">
                        <button onClick={() => startEdit(s)} className="p-2 text-blue-500 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-blue-100 transition-all">
                            <MdEdit size={18}/>
                        </button>
                        <button onClick={() => deleteSetting(s.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                            <MdDelete size={18}/>
                        </button>
                    </div>
                    </td>
                </motion.tr>
                ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}