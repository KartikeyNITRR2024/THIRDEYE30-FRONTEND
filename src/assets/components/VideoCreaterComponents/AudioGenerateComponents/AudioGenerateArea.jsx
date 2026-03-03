import { useContext, useState } from "react";
import { 
  MdArrowBack, MdContentCopy, MdDelete, MdAdd, 
  MdRefresh, MdClose, MdMic, MdHistory, 
  MdAutoDelete, MdCheckCircle, MdFingerprint 
} from "react-icons/md";
import { RiLoader4Line } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import AudioGeneratorContext from "../../../contexts/VideoCreater/AudioGenerators/AudioGeneratorContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function AudioGenerateArea({ onBack }) {
  const { notifySuccess, notifyError } = useContext(NotificationContext);
  const { 
    audioList, pendingCount, fetchAudioList, 
    getAudioUrl, addAudio, deleteAudio 
  } = useContext(AudioGeneratorContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    autoDelete: false
  });

  const resetForm = () => {
    setFormData({ content: "", autoDelete: false });
    setIsModalOpen(false);
  };

  const handleCreate = async () => {
    if (!formData.content.trim()) return;
    const success = await addAudio(formData.content, formData.autoDelete);
    if (success) resetForm();
  };

  const copyKey = (key) => {
    if (key) {
      navigator.clipboard.writeText(key);
      notifySuccess("Multimedia Key Copied");
    } else {
      notifyError("Asset still processing...");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition text-slate-600">
            <MdArrowBack size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-slate-700 uppercase leading-none">Audio Vault</h2>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black animate-pulse uppercase tracking-tighter">
                  {pendingCount} Syncing
                </span>
              )}
            </div>
            <span className="text-[9px] text-sky-500 font-bold uppercase tracking-widest">Synthetic Voice Generation</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => fetchAudioList()} className="flex-1 sm:flex-none bg-white p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition shadow-sm">
            <MdRefresh size={20} className={pendingCount > 0 ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-3 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
          >
            <MdMic size={18} /> New Vocalization
          </button>
        </div>
      </div>

      {/* ASSET GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {audioList.map((t) => (
          <motion.div layout key={t.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            {/* STATUS BAR */}
            <div className={`absolute top-0 left-0 w-1.5 h-full ${!t.isAudioGenerated ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[140px]">
                <h4 className="font-black text-slate-400 uppercase text-[8px] mb-1 tracking-tighter flex items-center gap-1">
                  <MdHistory size={10}/> {t.tableName || "SYSTEM_GEN"}
                </h4>
                <div className="flex flex-wrap gap-1">
                  <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border uppercase ${t.autoDelete ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-900 text-white border-slate-900'}`}>
                    {t.autoDelete ? "Ephemeral" : "Permanent"}
                  </span>
                  {t.isAudioGenerated && (
                    <button 
                      onClick={() => copyKey(t.audioMultiMediaKey)}
                      className="text-[7px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black hover:bg-slate-200 transition uppercase tracking-tighter flex items-center gap-1"
                    >
                      <MdFingerprint size={10}/> {t.audioMultiMediaKey?.slice(0, 8)}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => copyKey(t.audioMultiMediaKey)} 
                  disabled={!t.isAudioGenerated}
                  className="p-2 text-slate-300 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition disabled:opacity-20"
                >
                  <MdContentCopy size={16} />
                </button>
                <button onClick={() => deleteAudio(t.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition">
                  <MdDelete size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[50px]">
                <p className="text-[10px] font-bold text-slate-600 leading-relaxed italic line-clamp-2 uppercase">"{t.content}"</p>
              </div>

              <div className="flex items-center justify-center pt-2">
                {t.isAudioGenerated ? (
                  <audio src={getAudioUrl(t.audioMultiMediaKey)} controls className="h-8 w-full accent-slate-900" />
                ) : (
                  <div className="flex items-center gap-3 text-amber-600 bg-amber-50/50 w-full py-2 justify-center rounded-lg border border-amber-100 border-dashed">
                    <RiLoader4Line className="animate-spin" size={18} />
                    <span className="text-[9px] font-black uppercase tracking-[2px]">Synthesizing Audio...</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* GENERATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-white"><MdMic size={20} /></div>
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Voice Synthesis Engine</h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">Content to Synthesize</label>
                  <textarea 
                    placeholder="Enter the text that should be converted to speech..." 
                    className="w-full border-2 rounded-xl px-4 py-3 text-xs font-bold h-32 resize-none outline-none focus:border-slate-800 transition bg-slate-50/30" 
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})} 
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${formData.autoDelete ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                      <MdAutoDelete size={20}/>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-700 uppercase">Auto-Cleanup Policy</span>
                      <span className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter">Delete asset after production use</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, autoDelete: !formData.autoDelete})}
                    className={`w-12 h-6 rounded-full relative transition-colors ${formData.autoDelete ? 'bg-amber-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.autoDelete ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition tracking-widest">Cancel</button>
                <button 
                  onClick={handleCreate} 
                  disabled={!formData.content.trim()}
                  className="flex-[2] bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[2px] shadow-lg active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  <MdCheckCircle size={18}/> Initiate Generation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {audioList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-300">
           <MdMic size={48} className="mb-2 opacity-20"/>
           <p className="text-[10px] font-black uppercase tracking-[4px]">No Audio Assets Found</p>
        </div>
      )}
    </div>
  );
}