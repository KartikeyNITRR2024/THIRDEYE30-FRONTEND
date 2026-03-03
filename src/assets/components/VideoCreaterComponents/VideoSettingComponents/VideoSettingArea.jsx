import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdCheckCircle, 
  MdRadioButtonUnchecked, MdClose, MdMusicNote, MdSettings, 
  MdAdd, MdAspectRatio, MdSlowMotionVideo, MdDescription,
  MdLayers, MdVolumeUp, MdTimer, MdGraphicEq
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import VideoSettingContext from "../../../contexts/VideoCreater/VideoSetting/VideoSettingContext";

export default function VideoSettingArea({ onBack }) {
  const { settings, fetchSettings, createSetting, updateSetting, deleteSetting, activateSetting } = useContext(VideoSettingContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // 100% COMPLETE DTO MAPPING (Logic preserved)
  const emptyForm = {
    id: null,
    name: null,
    description: null,
    active: false,
    fps: null,
    height: null,
    width: null,
    introPresent: false,
    introTime: null,
    mainVideoPresent: false,
    mainVideoTime: null,
    outroPresent: false,
    outroTime: null,
    sequence: null,
    isAudio: false,
    audioMultiMediaKey: null,
    audioVolumne: null,
    lastlyUsed: null 
  };

  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => { 
    setEditingId(null); 
    setFormData(emptyForm); 
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    
    const payload = {
      ...formData,
      width: formData.width ? parseInt(formData.width) : null,
      height: formData.height ? parseInt(formData.height) : null,
      fps: formData.fps ? parseInt(formData.fps) : null,
      audioVolumne: formData.audioVolumne ? parseInt(formData.audioVolumne) : null,
    };

    if (editingId) {
      const success = await updateSetting(editingId, payload);
      if (success) resetForm();
    } else {
      await createSetting(payload);
      resetForm();
    }
  };

  const startEdit = (s) => { 
    resetForm(); 
    setTimeout(() => {
      setEditingId(s.id); 
      setFormData({ ...s }); 
      setIsModalOpen(true);
    }, 20);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 font-sans text-slate-900">
      
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            <MdArrowBack size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase leading-none mb-1">Engine Profiles</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${settings.length > 0 ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{settings.length} Profiles Found</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => fetchSettings()} className="flex-1 sm:flex-none bg-white p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition shadow-sm">
            <MdRefresh size={20} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-3 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
          >
            <MdAdd size={18} /> New Profile
          </button>
        </div>
      </div>

      {/* GRID VIEW - FIXED VISIBILITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {settings.map((s) => (
          <motion.div layout key={s.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            {/* Left Status Bar */}
            <div className={`absolute top-0 left-0 w-1 h-full ${s.active ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[180px]">
                {/* Title - Bold Black */}
                <h4 className="font-black text-slate-900 uppercase text-xs mb-2 truncate leading-tight">
                  {s.name || "Untitled Profile"}
                </h4>
                {/* Metadata - Visible Gray */}
                <div className="flex flex-wrap gap-2">
                   <span className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-slate-200">
                     {s.fps || 0} FPS
                   </span>
                   <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-blue-100">
                     {s.width}x{s.height}
                   </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1">
                <button onClick={() => startEdit(s)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <MdEdit size={18} />
                </button>
                <button onClick={() => deleteSetting(s.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
                  <MdDelete size={18} />
                </button>
              </div>
            </div>

            {/* Timeline Visualizer */}
            <div className="space-y-1.5 mb-4">
               <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
                  <span>Timeline Flow</span>
                  <span className="text-blue-600 font-mono tracking-widest bg-blue-50 px-1 rounded">{s.sequence || "---"}</span>
               </div>
               <div className="flex items-center gap-1 h-6 bg-slate-50 rounded-md p-1 border border-slate-100">
                  {s.introPresent && <div className="h-full flex-1 bg-indigo-500 rounded-sm" />}
                  {s.mainVideoPresent ? <div className="h-full flex-[3] bg-blue-600 rounded-sm" /> : <div className="h-full flex-[3] border border-dashed border-slate-200 rounded-sm" />}
                  {s.outroPresent && <div className="h-full flex-1 bg-purple-500 rounded-sm" />}
               </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
               <div className="flex items-center gap-2">
                  <button onClick={() => activateSetting(s.id)} className={`transition-all ${s.active ? 'text-blue-600' : 'text-slate-300 hover:text-blue-400'}`}>
                    {s.active ? <MdCheckCircle size={24}/> : <MdRadioButtonUnchecked size={24}/>}
                  </button>
                  <span className={`text-[10px] font-black uppercase ${s.active ? 'text-blue-600' : 'text-slate-400'}`}>
                    {s.active ? 'Active' : 'Standby'}
                  </span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[7px] font-black text-slate-300 uppercase leading-none">Audio</span>
                  <span className={`text-[9px] font-bold ${s.isAudio ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {s.isAudio ? 'ENABLED' : 'MUTED'}
                  </span>
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
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 text-white rounded-lg"><MdSettings size={20} /></div>
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
                    {editingId ? "Update Global Constants" : "Establish New Engine Profile"}
                  </h3>
                </div>
                <button onClick={resetForm} className="p-2 text-slate-400 hover:text-rose-500 transition"><MdClose size={24} /></button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
                
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Profile Name</label>
                      <input type="text" className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800 focus:bg-slate-50 transition-all" 
                        value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Technical Notes</label>
                      <textarea className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-xs font-medium h-20 resize-none outline-none focus:border-slate-800 focus:bg-slate-50" 
                        value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {['width', 'height', 'fps'].map(field => (
                        <div key={field} className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase text-center block">{field}</label>
                          <input type="number" className="w-full border-2 border-slate-100 rounded-xl py-2.5 text-xs font-black text-center outline-none focus:border-blue-500 focus:bg-blue-50/30" 
                            value={formData[field] ?? ""} onChange={e => setFormData({...formData, [field]: e.target.value})} />
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl shadow-inner border border-slate-800">
                      <label className="text-[9px] font-black text-slate-500 uppercase block mb-1 text-center tracking-widest">Composition Sequence</label>
                      <input type="text" className="w-full bg-transparent border-b border-slate-700 py-1 text-white text-lg font-black tracking-[10px] uppercase outline-none text-center focus:border-blue-500" 
                        value={formData.sequence || ""} onChange={e => setFormData({...formData, sequence: e.target.value.toUpperCase()})} />
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">
                   <h4 className="text-[9px] font-black text-slate-400 uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
                     <MdTimer size={16}/> Segment Logic
                   </h4>
                   
                   <div className="space-y-2">
                     {[
                       { key: 'intro', label: 'Intro Segment', color: 'indigo' },
                       { key: 'mainVideo', label: 'Main Feature', color: 'blue' },
                       { key: 'outro', label: 'Outro Segment', color: 'purple' }
                     ].map(seg => (
                       <div key={seg.key} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${formData[`${seg.key}Present`] ? `border-${seg.color}-100 bg-${seg.color}-50/30` : 'border-slate-50 bg-slate-50/50'}`}>
                          <input type="checkbox" className="w-4 h-4 accent-slate-800 rounded" 
                            checked={formData[`${seg.key}Present`] || false} 
                            onChange={e => setFormData({...formData, [`${seg.key}Present`]: e.target.checked})} />
                          <span className={`text-[10px] font-black uppercase flex-1 ${formData[`${seg.key}Present`] ? `text-${seg.color}-700` : 'text-slate-400'}`}>
                            {seg.label}
                          </span>
                          <div className="relative w-24">
                            <input type="number" className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-[10px] font-black outline-none focus:border-blue-400"
                              value={formData[`${seg.key}Time`] ?? ""} 
                              onChange={e => setFormData({...formData, [`${seg.key}Time`]: e.target.value})} />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-300">SEC</span>
                          </div>
                       </div>
                     ))}
                   </div>

                   {/* AUDIO SUB-SYSTEM */}
                   <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-[1.5rem] space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-blue-800">
                            <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-sm"><MdMusicNote size={16}/></div>
                            <span className="text-[10px] font-black uppercase tracking-wider">Audio Engine</span>
                        </div>
                        <button onClick={() => setFormData({...formData, isAudio: !formData.isAudio})} className="transition-transform active:scale-90">
                           {formData.isAudio ? <MdCheckCircle className="text-blue-600" size={32}/> : <MdRadioButtonUnchecked className="text-slate-300" size={32}/>}
                        </button>
                      </div>

                      <div className={`grid grid-cols-4 gap-3 transition-all ${formData.isAudio ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                        <div className="col-span-1">
                           <label className="text-[8px] font-black text-blue-400 uppercase mb-1 block">Vol %</label>
                           <input type="number" className="w-full text-[10px] font-black p-2 rounded-lg border-2 border-white bg-white shadow-sm outline-none focus:border-blue-400" 
                            value={formData.audioVolumne ?? ""} onChange={e => setFormData({...formData, audioVolumne: e.target.value})} />
                        </div>
                        <div className="col-span-3">
                           <label className="text-[8px] font-black text-blue-400 uppercase mb-1 block">Multimedia UUID</label>
                           <input type="text" className="w-full text-[9px] font-mono font-bold p-2 rounded-lg border-2 border-white bg-white shadow-sm outline-none focus:border-blue-400"
                            placeholder="0000-0000..."
                            value={formData.audioMultiMediaKey || ""} onChange={e => setFormData({...formData, audioMultiMediaKey: e.target.value})} />
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-6 bg-slate-50 border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-white transition-all">Discard</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={!formData.name}
                  className="flex-[2] py-3 rounded-xl text-[10px] font-black uppercase tracking-[2px] bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-black transition-all disabled:opacity-30 disabled:grayscale"
                >
                   {editingId ? "Update Engine Core" : "Deploy Profile"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}