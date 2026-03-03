import { useContext, useState, useRef } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdClose, 
  MdNewspaper, MdAudiotrack, MdImage, MdColorLens, 
  MdAutoDelete, MdLink, MdAdd, MdLayers, MdContentCopy,
  MdFingerprint, MdCheckCircle, MdUploadFile
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import NewsContext from "../../../contexts/VideoCreater/News/NewsContext";
import VideoDetailsContext from "../../../contexts/VideoCreater/VideoDetails/VideoDetailsContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function NewsArea({ onBack }) {
  const { newsList, fetchNews, addNews, updateNews, deleteNews, uploadNewsCsv } = useContext(NewsContext);
  const { detailsList } = useContext(VideoDetailsContext);
  const { notifySuccess, notifyError } = useContext(NotificationContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadTargetId, setUploadTargetId] = useState("");
  const fileInputRef = useRef(null);
  
  const initialForm = {
    videoDetailsId: "",
    header: "",
    content: "",
    audioContent: "",
    newsWarningColor: "#000000",
    isImageMultiMediaKeyUploaded: false,
    imageMultiMediaKey: "",
    isAudioMultiMediaKeyUploaded: false,
    audioMultiMediaKey: "",
    autoDelete: false
  };

  const [formData, setFormData] = useState(initialForm);

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(false);
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!uploadTargetId) {
        notifyError("Select a Target Project first");
        e.target.value = null;
        return;
    }
    const success = await uploadNewsCsv(file, uploadTargetId);
    if (success) e.target.value = null;
  };

  const handleAction = async () => {
    if (!formData.videoDetailsId || !formData.header) return;
    const payload = { ...formData, header: formData.header.toUpperCase().trim() };
    const success = editingId ? await updateNews(editingId, payload) : await addNews(payload);
    if (success) resetForm();
  };

  const startEdit = (news) => {
    setEditingId(news.id);
    setFormData({ ...news });
    setIsModalOpen(true);
  };

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    notifySuccess(`${label} Copied`);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition text-slate-600">
            <MdArrowBack size={20} />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">News Desk</h2>
            <span className="text-[9px] text-sky-500 font-bold uppercase tracking-widest leading-none">Media Asset & Segment Composition</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Target Selector for CSV */}
          <select 
            className="flex-1 lg:flex-none bg-slate-50 border-2 border-slate-100 rounded-lg px-3 py-2 text-[10px] font-black uppercase outline-none focus:border-emerald-500 transition"
            value={uploadTargetId}
            onChange={(e) => setUploadTargetId(e.target.value)}
          >
            <option value="">Select Project for CSV...</option>
            {detailsList.map(d => <option key={d.id} value={d.id}>{d.introHeader || d.id.slice(0,8)}</option>)}
          </select>

          {/* Hidden File Input */}
          <input type="file" ref={fileInputRef} onChange={handleCsvUpload} accept=".csv" className="hidden" />
          
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-lg hover:bg-emerald-100 text-[10px] font-black transition uppercase tracking-widest"
          >
            <MdUploadFile size={18} /> CSV Upload
          </button>

          <button onClick={() => fetchNews()} className="bg-white p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition shadow-sm">
            <MdRefresh size={20} />
          </button>

          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
          >
            <MdAdd size={18} /> Compose Segment
          </button>
        </div>
      </div>

      {/* ASSET REPOSITORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsList.map((n) => {
          const detail = detailsList.find(d => d.id === n.videoDetailsId);
          return (
            <motion.div layout key={n.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: n.newsWarningColor }}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="max-w-[160px]">
                  <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate">{n.header}</h4>
                  <div className="flex gap-1">
                    <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase truncate max-w-[100px]">
                      {detail?.introHeader || "UNLINKED"}
                    </span>
                    {n.autoDelete && <span className="text-[8px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded font-black uppercase">TEMP</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(n)} className="p-2 text-slate-300 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"><MdEdit size={16} /></button>
                  <button onClick={() => deleteNews(n.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"><MdDelete size={16} /></button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[44px]">
                  <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-tight">"{n.content}"</p>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                   <div className="flex gap-3">
                      <div className={`flex flex-col items-center gap-1 ${n.isImageMultiMediaKeyUploaded ? 'text-blue-500' : 'text-slate-200'}`}>
                         <MdImage size={18} />
                         <span className="text-[7px] font-black uppercase tracking-tighter">IMG</span>
                      </div>
                      <div className={`flex flex-col items-center gap-1 ${n.isAudioMultiMediaKeyUploaded ? 'text-purple-500' : 'text-slate-200'}`}>
                         <MdAudiotrack size={18} />
                         <span className="text-[7px] font-black uppercase tracking-tighter">AUD</span>
                      </div>
                   </div>
                   <button 
                    onClick={() => copyToClipboard(n.id, "News ID")}
                    className="flex items-center gap-1 text-[8px] bg-slate-900 text-white px-2 py-1 rounded font-black uppercase tracking-tighter hover:bg-black transition"
                   >
                    <MdFingerprint size={10}/> {n.id.slice(0,8)}
                   </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* COMPOSITION MODAL (UNMODIFIED AS REQUESTED) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-white"><MdNewspaper size={20} /></div>
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
                    {editingId ? "Modify News Article" : "Compose News Segment"}
                  </h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[75vh] grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* LEFT: EDITORIAL */}
                <div className="space-y-5">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdLink/> Project Association</label>
                      <select className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold bg-white focus:border-slate-800 outline-none transition" 
                        value={formData.videoDetailsId} onChange={e => setFormData({...formData, videoDetailsId: e.target.value})}>
                        <option value="">Select Target Details...</option>
                        {detailsList.map(d => <option key={d.id} value={d.id}>{d.introHeader?.toUpperCase() || `ID: ${d.id.slice(0,8)}`}</option>)}
                      </select>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdLayers/> Headline</label>
                      <input type="text" placeholder="URGENT UPDATE..." className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:border-slate-800 transition uppercase" 
                        value={formData.header} onChange={e => setFormData({...formData, header: e.target.value})} />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">Ticker / Scroll Text</label>
                      <textarea placeholder="The primary text displayed on screen..." className="w-full border-2 rounded-xl px-4 py-3 text-xs font-bold h-24 resize-none outline-none focus:border-slate-800 transition bg-slate-50/30" 
                        value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-indigo-400 uppercase ml-1 flex items-center gap-1"><MdAudiotrack/> Speech Synthesis Script</label>
                      <textarea placeholder="Text to be converted into AI Voice..." className="w-full border-2 border-indigo-50 rounded-xl px-4 py-3 text-xs font-medium h-24 resize-none outline-none focus:border-indigo-400 transition bg-indigo-50/20 italic" 
                        value={formData.audioContent} onChange={e => setFormData({...formData, audioContent: e.target.value})} />
                   </div>
                </div>

                {/* RIGHT: MEDIA & STYLE */}
                <div className="space-y-6">
                   <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Multimedia Sync</p>
                      
                      <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black uppercase text-sky-400 flex items-center gap-1"><MdImage/> Image Link</span>
                            <input type="checkbox" className="accent-sky-400" checked={formData.isImageMultiMediaKeyUploaded} onChange={e => setFormData({...formData, isImageMultiMediaKeyUploaded: e.target.checked})} />
                         </div>
                         <div className="relative">
                            <input type="text" placeholder="UUID..." disabled={!formData.isImageMultiMediaKeyUploaded} className="w-full bg-slate-800 border-none rounded-lg pl-3 pr-10 py-2 text-[10px] font-mono text-sky-300 disabled:opacity-20 transition"
                              value={formData.imageMultiMediaKey} onChange={e => setFormData({...formData, imageMultiMediaKey: e.target.value})} />
                            <button onClick={() => copyToClipboard(formData.imageMultiMediaKey, "Image Key")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"><MdContentCopy size={14}/></button>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black uppercase text-purple-400 flex items-center gap-1"><MdAudiotrack/> Audio Link</span>
                            <input type="checkbox" className="accent-purple-400" checked={formData.isAudioMultiMediaKeyUploaded} onChange={e => setFormData({...formData, isAudioMultiMediaKeyUploaded: e.target.checked})} />
                         </div>
                         <div className="relative">
                            <input type="text" placeholder="UUID..." disabled={!formData.isAudioMultiMediaKeyUploaded} className="w-full bg-slate-800 border-none rounded-lg pl-3 pr-10 py-2 text-[10px] font-mono text-purple-300 disabled:opacity-20 transition"
                              value={formData.audioMultiMediaKey} onChange={e => setFormData({...formData, audioMultiMediaKey: e.target.value})} />
                            <button onClick={() => copyToClipboard(formData.audioMultiMediaKey, "Audio Key")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"><MdContentCopy size={14}/></button>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border-2 rounded-2xl flex flex-col items-center gap-2">
                         <span className="text-[8px] font-black uppercase text-slate-400">Alert Color</span>
                         <input type="color" className="h-10 w-full cursor-pointer rounded-lg bg-transparent p-0 border-0"
                            value={formData.newsWarningColor} onChange={e => setFormData({...formData, newsWarningColor: e.target.value})} />
                         <span className="text-[9px] font-mono font-bold text-slate-700">{formData.newsWarningColor.toUpperCase()}</span>
                      </div>
                      
                      <button 
                        onClick={() => setFormData({...formData, autoDelete: !formData.autoDelete})}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all ${formData.autoDelete ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-slate-50 border-slate-100 text-slate-300'}`}
                      >
                         <MdAutoDelete size={24} />
                         <span className="text-[8px] font-black uppercase mt-1">Auto-Purge</span>
                      </button>
                   </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition tracking-[2px]">Discard</button>
                <button 
                  onClick={handleAction} 
                  disabled={!formData.videoDetailsId || !formData.header}
                  className={`flex-[2] py-4 rounded-xl text-[10px] font-black uppercase tracking-[2px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-slate-900 text-white hover:bg-black'} disabled:bg-slate-100 disabled:text-slate-300`}
                >
                    <MdCheckCircle size={18}/> {editingId ? "Commit Changes" : "Deploy News Asset"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}