import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdClose, 
  MdNewspaper, MdAudiotrack, MdImage, MdColorLens, 
  MdAutoDelete, MdLink 
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import NewsContext from "../../../contexts/VideoCreater/News/NewsContext";
import VideoDetailsContext from "../../../contexts/VideoCreater/VideoDetails/VideoDetailsContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function NewsArea({ onBack }) {
  const { newsList, fetchNews, addNews, updateNews, deleteNews } = useContext(NewsContext);
  const { detailsList } = useContext(VideoDetailsContext);
  const { notifySuccess } = useContext(NotificationContext);

  const [editingId, setEditingId] = useState(null);
  
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
  };

  const handleAction = async () => {
    if (!formData.videoDetailsId || !formData.header) return;
    
    // Normalize and clean data for backend
    const payload = {
      ...formData,
      header: formData.header.toUpperCase().trim(),
    };

    if (editingId) {
      const success = await updateNews(editingId, payload);
      if (success) resetForm();
    } else {
      const success = await addNews(payload);
      if (success) resetForm();
    }
  };

  const startEdit = (news) => {
    setEditingId(news.id);
    setFormData({ ...news });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
          <button onClick={onBack} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 text-xs font-black transition active:scale-95">
            <MdArrowBack size={16} /> BACK
          </button>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button onClick={() => fetchNews()} className="text-gray-400 hover:text-black transition p-2 bg-slate-50 rounded-full active:rotate-180 duration-500">
              <MdRefresh size={22} />
            </button>
            <div className="text-right">
              <h2 className="text-sm font-black text-gray-700 uppercase leading-none mb-1">News Desk</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Article & Media Assets</span>
            </div>
          </div>
        </div>

        {/* COMPOSITION FORM */}
        <div className={`mb-8 p-5 border-2 rounded-2xl transition-all shadow-sm ${editingId ? 'border-orange-200 bg-orange-50/10' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] flex items-center gap-2">
              <MdNewspaper size={16} className={editingId ? "text-orange-500" : "text-blue-500"} />
              {editingId ? "Modify News Article" : "Compose New Segment"}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="bg-white border px-3 py-1 rounded-full text-rose-500 flex items-center gap-1 text-[9px] font-black hover:bg-rose-50 transition shadow-sm">
                <MdClose /> DISCARD EDIT
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COLUMN 1: EDITORIAL CONTENT */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Parent Link</label>
                <select className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-bold bg-white outline-none focus:border-blue-400" 
                  value={formData.videoDetailsId} onChange={e => setFormData({...formData, videoDetailsId: e.target.value})}>
                  <option value="">Select Project Detail...</option>
                  {detailsList.map(d => <option key={d.id} value={d.id}>{d.introHeader?.toUpperCase() || `PROJECT ID: ${d.id.slice(0,8)}`}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Headline</label>
                <input type="text" placeholder="CRITICAL MARKET SHIFT..." className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-black outline-none focus:border-blue-400 uppercase" 
                  value={formData.header} onChange={e => setFormData({...formData, header: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Visual Text Overlay</label>
                <textarea placeholder="Main scroll or body content..." className="w-full border-2 rounded-xl px-3 py-2 text-xs h-24 resize-none outline-none focus:border-blue-400" 
                  value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              </div>
            </div>

            {/* COLUMN 2: AUDIO & STYLE */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Speech Synthesis Script</label>
                <textarea placeholder="Paste the exact text for AI voice generation..." className="w-full border-2 rounded-xl px-3 py-2 text-[11px] h-24 bg-blue-50/20 font-medium outline-none focus:border-blue-400 italic" 
                  value={formData.audioContent} onChange={e => setFormData({...formData, audioContent: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border-2 rounded-xl shadow-sm space-y-2">
                  <label className="text-[8px] font-black uppercase text-gray-400 block text-center">Alert Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" className="h-8 w-10 cursor-pointer rounded bg-transparent p-0 border-0"
                      value={formData.newsWarningColor} onChange={e => setFormData({...formData, newsWarningColor: e.target.value})} />
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">{formData.newsWarningColor}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setFormData({...formData, autoDelete: !formData.autoDelete})}
                  className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all ${formData.autoDelete ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-300'}`}
                >
                  <MdAutoDelete size={20} />
                  <span className="text-[8px] font-black uppercase mt-1">Auto-Purge</span>
                </button>
              </div>
            </div>

            {/* COLUMN 3: MULTIMEDIA SYNC */}
            <div className="flex flex-col gap-4">
              <div className="p-4 border-2 rounded-2xl bg-white space-y-4 shadow-sm">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-[9px] font-black uppercase text-gray-400">
                      <MdImage className="text-blue-400"/> Image Reference
                    </label>
                    <input type="checkbox" className="accent-blue-500 w-4 h-4" checked={formData.isImageMultiMediaKeyUploaded} onChange={e => setFormData({...formData, isImageMultiMediaKeyUploaded: e.target.checked})} />
                  </div>
                  <input type="text" placeholder="Multimedia UUID" className={`w-full border rounded-lg px-2 py-2 text-[10px] font-mono transition-opacity ${!formData.isImageMultiMediaKeyUploaded && 'opacity-30'}`} 
                    value={formData.imageMultiMediaKey || ""} onChange={e => setFormData({...formData, imageMultiMediaKey: e.target.value})} />
                </div>

                <div className="space-y-2 border-t pt-3">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-[9px] font-black uppercase text-gray-400">
                      <MdAudiotrack className="text-purple-400"/> Custom Audio
                    </label>
                    <input type="checkbox" className="accent-purple-500 w-4 h-4" checked={formData.isAudioMultiMediaKeyUploaded} onChange={e => setFormData({...formData, isAudioMultiMediaKeyUploaded: e.target.checked})} />
                  </div>
                  <input type="text" placeholder="Multimedia UUID" className={`w-full border rounded-lg px-2 py-2 text-[10px] font-mono transition-opacity ${!formData.isAudioMultiMediaKeyUploaded && 'opacity-30'}`} 
                    value={formData.audioMultiMediaKey || ""} onChange={e => setFormData({...formData, audioMultiMediaKey: e.target.value})} />
                </div>
              </div>

              <button onClick={handleAction} className={`w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-[2px] transition-all shadow-lg active:scale-95
                ${editingId ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-black text-white hover:bg-gray-800'}`}>
                {editingId ? "Commit Changes" : "Deploy News Asset"}
              </button>
            </div>
          </div>
        </div>

        {/* REPOSITORY TABLE */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b">
                <th className="px-4 py-4 text-left">Article Intel</th>
                <th className="px-4 py-4 text-center">Project Link</th>
                <th className="px-4 py-4 text-center">Media Mix</th>
                <th className="px-4 py-4 text-center">Styling</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((n) => (
                <tr key={n.id} className={`transition-colors border-b border-gray-50 last:border-0 ${editingId === n.id ? 'bg-orange-50/40' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-4 py-4 text-left">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 uppercase text-xs leading-none mb-1">{n.header}</span>
                      <span className="text-[10px] text-gray-400 font-medium truncate max-w-[250px]">{n.content}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full uppercase">
                      {detailsList.find(d => d.id === n.videoDetailsId)?.introHeader?.slice(0,12) || 'Det: ' + n.videoDetailsId.slice(0,6)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-3">
                      <div className={`p-1.5 rounded ${n.isImageMultiMediaKeyUploaded ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-200'}`}>
                        <MdImage size={16} />
                      </div>
                      <div className={`p-1.5 rounded ${n.isAudioMultiMediaKeyUploaded ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-200'}`}>
                        <MdAudiotrack size={16} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100" style={{backgroundColor: n.newsWarningColor}}></div>
                      {n.autoDelete && <span className="text-[7px] font-black text-rose-500 uppercase tracking-tighter">TEMP</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <button onClick={() => startEdit(n)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><MdEdit size={18} /></button>
                      <button onClick={() => deleteNews(n.id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors"><MdDelete size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}