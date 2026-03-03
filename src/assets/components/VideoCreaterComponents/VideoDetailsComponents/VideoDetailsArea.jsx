import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdClose, 
  MdLink, MdTitle, MdOutlineSubtitles, MdBarChart, 
  MdFingerprint, MdAdd, MdLayers, MdCheckCircle, MdError,
  MdContentCopy
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import VideoContext from "../../../contexts/VideoCreater/Videos/VideoContext";
import VideoDetailsContext from "../../../contexts/VideoCreater/VideoDetails/VideoDetailsContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function VideoDetailsArea({ onBack }) {
  const { videoList } = useContext(VideoContext);
  const { detailsList, fetchAllDetails, createDetails, updateDetails, deleteDetails } = useContext(VideoDetailsContext);
  const { notifySuccess } = useContext(NotificationContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    videoId: "", introHeader: "", introSubHeader: "",
    header: "", outroHeader: "", outroSubHeader: "",
    isbarGraphJsonMultiMediaKeyUploaded: false,
    barGraphJsonMultiMediaKey: ""
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      videoId: "", introHeader: "", introSubHeader: "",
      header: "", outroHeader: "", outroSubHeader: "",
      isbarGraphJsonMultiMediaKeyUploaded: false,
      barGraphJsonMultiMediaKey: ""
    });
    setIsModalOpen(false);
  };

  const handleAction = async () => {
    if (!formData.videoId) return;
    const success = editingId 
      ? await updateDetails(editingId, formData) 
      : await createDetails(formData);
    if (success) resetForm();
  };

  const startEdit = (detail) => {
    resetForm(); 
    // Small timeout ensures state is wiped before new data is injected
    setTimeout(() => {
      setEditingId(detail.id);
      setFormData({ ...detail });
      setIsModalOpen(true);
    }, 10);
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    notifySuccess(message || "Copied to Clipboard");
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 font-sans">
      
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            <MdArrowBack size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Metadata Manager</h2>
            <span className="text-[9px] text-sky-500 font-bold uppercase tracking-widest leading-none">Content Layer Configuration</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => fetchAllDetails()} className="flex-1 sm:flex-none bg-white p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition shadow-sm">
            <MdRefresh size={20} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-3 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
          >
            <MdAdd size={18} /> Configure Metadata
          </button>
        </div>
      </div>

      {/* RESPONSIVE CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {detailsList.map((d) => {
          const video = videoList.find(v => v.id === d.videoId);
          return (
            <motion.div layout key={d.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${d.isbarGraphJsonMultiMediaKeyUploaded ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="max-w-[140px]">
                  <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate">{video?.name || "Unlinked Project"}</h4>
                  <button 
                    onClick={() => copyToClipboard(d.id, "Metadata ID Copied")}
                    className="flex items-center gap-1 text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase tracking-tighter hover:bg-slate-900 hover:text-white transition"
                  >
                    <MdFingerprint size={10}/> {d.id.slice(0,8)}
                  </button>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => copyToClipboard(d.id, "Metadata UUID Copied")} 
                    className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition"
                    title="Copy UUID"
                  >
                    <MdContentCopy size={16} />
                  </button>
                  <button onClick={() => startEdit(d)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"><MdEdit size={18} /></button>
                  <button onClick={() => deleteDetails(d.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"><MdDelete size={18} /></button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[8px] font-black text-slate-400 uppercase block mb-1 tracking-tighter">Main Header</span>
                  <p className="text-[10px] font-bold text-slate-700 uppercase line-clamp-1 italic">"{d.header || "---"}"</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[7px] font-black text-slate-400 uppercase">Intro</span>
                      <span className="text-[9px] font-bold text-slate-800 truncate">{d.introHeader || "N/A"}</span>
                   </div>
                   <div className="flex flex-col gap-0.5 border-l border-slate-100 pl-2">
                      <span className="text-[7px] font-black text-slate-400 uppercase">Outro</span>
                      <span className="text-[9px] font-bold text-slate-800 truncate">{d.outroHeader || "N/A"}</span>
                   </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* EDIT/CREATE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-white"><MdLayers size={20} /></div>
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
                    {editingId ? "Update Configuration" : "New Metadata Layer"}
                  </h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                {/* PRIMARY SETTINGS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdLink/> Target Project</label>
                    <select className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold bg-white focus:border-slate-800 outline-none transition" 
                      value={formData.videoId} onChange={e => setFormData({...formData, videoId: e.target.value})}>
                      <option value="">Select Video Project...</option>
                      {videoList.map(v => <option key={v.id} value={v.id}>{v.name.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Hero Title</label>
                    <input type="text" placeholder="Visual Heading..." className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800 transition" 
                      value={formData.header} onChange={e => setFormData({...formData, header: e.target.value})} />
                  </div>
                </div>

                {/* OVERLAYS */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-[8px] font-black text-indigo-500 uppercase tracking-tighter border-b border-indigo-100 pb-1 flex items-center gap-2"><MdOutlineSubtitles/> Intro Segment</p>
                      <input type="text" placeholder="Header Title..." className="w-full bg-transparent border-b-2 py-1 text-xs font-bold outline-none focus:border-indigo-400" 
                        value={formData.introHeader} onChange={e => setFormData({...formData, introHeader: e.target.value})} />
                      <input type="text" placeholder="Sub-header..." className="w-full bg-transparent border-b-2 py-1 text-xs outline-none focus:border-indigo-400" 
                        value={formData.introSubHeader} onChange={e => setFormData({...formData, introSubHeader: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <p className="text-[8px] font-black text-purple-500 uppercase tracking-tighter border-b border-purple-100 pb-1 flex items-center gap-2"><MdOutlineSubtitles/> Outro Segment</p>
                      <input type="text" placeholder="Header Title..." className="w-full bg-transparent border-b-2 py-1 text-xs font-bold outline-none focus:border-purple-400" 
                        value={formData.outroHeader} onChange={e => setFormData({...formData, outroHeader: e.target.value})} />
                      <input type="text" placeholder="Sub-header..." className="w-full bg-transparent border-b-2 py-1 text-xs outline-none focus:border-purple-400" 
                        value={formData.outroSubHeader} onChange={e => setFormData({...formData, outroSubHeader: e.target.value})} />
                    </div>
                </div>

                {/* GRAPH SYNC SECTION */}
                <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-4 shadow-xl">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-2"><MdBarChart className="text-sky-400" size={16}/> Graph Engine Sync</span>
                        <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Multimedia Database Link</span>
                      </div>
                      <button onClick={() => setFormData({...formData, isbarGraphJsonMultiMediaKeyUploaded: !formData.isbarGraphJsonMultiMediaKeyUploaded})}>
                         {formData.isbarGraphJsonMultiMediaKeyUploaded ? <MdCheckCircle size={32} className="text-emerald-400"/> : <MdError size={32} className="text-slate-700"/>}
                      </button>
                   </div>
                   
                   <div className="relative group">
                    <input type="text" placeholder="PASTE MULTIMEDIA UUID HERE..." 
                      disabled={!formData.isbarGraphJsonMultiMediaKeyUploaded}
                      className="w-full bg-slate-800 border-none rounded-xl pl-4 pr-12 py-3 text-[10px] font-mono font-bold text-sky-400 placeholder-slate-700 outline-none focus:ring-1 focus:ring-sky-500 transition-all disabled:opacity-20" 
                      value={formData.barGraphJsonMultiMediaKey || ""} 
                      onChange={e => setFormData({...formData, barGraphJsonMultiMediaKey: e.target.value})} />
                    
                    {formData.barGraphJsonMultiMediaKey && (
                      <button 
                        onClick={() => copyToClipboard(formData.barGraphJsonMultiMediaKey, "Multimedia Key Copied")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition"
                      >
                        <MdContentCopy size={16}/>
                      </button>
                    )}
                   </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition tracking-widest">Discard</button>
                <button 
                  onClick={handleAction} 
                  disabled={!formData.videoId}
                  className={`flex-[2] py-3 rounded-xl text-[10px] font-black uppercase tracking-[2px] shadow-lg active:scale-95 transition-all ${editingId ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-slate-900 text-white hover:bg-black'} disabled:bg-slate-100 disabled:text-slate-300`}
                >
                    {editingId ? "Apply Changes" : "Deploy Metadata"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}