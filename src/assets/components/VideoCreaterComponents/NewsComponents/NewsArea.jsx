import { useContext, useState } from "react";
import { MdArrowBack, MdRefresh, MdEdit, MdDelete, MdClose, MdNewspaper, MdAudiotrack, MdImage } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import NewsContext from "../../../contexts/VideoCreater/News/NewsContext";
import VideoDetailsContext from "../../../contexts/VideoCreater/VideoDetails/VideoDetailsContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function NewsArea({ onBack }) {
  const { newsList, fetchNews, addNews, updateNews, deleteNews } = useContext(NewsContext);
  const { detailsList } = useContext(VideoDetailsContext); // For the dropdown
  const { notifySuccess } = useContext(NotificationContext);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
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
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      videoDetailsId: "", header: "", content: "", audioContent: "",
      newsWarningColor: "#000000", isImageMultiMediaKeyUploaded: false,
      imageMultiMediaKey: "", isAudioMultiMediaKeyUploaded: false,
      audioMultiMediaKey: "", autoDelete: false
    });
  };

  const handleAction = async () => {
    if (!formData.videoDetailsId || !formData.header) return;
    if (editingId) {
      const success = await updateNews(editingId, formData);
      if (success) resetForm();
    } else {
      await addNews(formData);
      resetForm();
    }
  };

  const startEdit = (news) => {
    setEditingId(news.id);
    setFormData({ ...news });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 shadow-md mt-6 border border-gray-100">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <button onClick={onBack} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-bold transition">
            <MdArrowBack size={18} /> BACK
          </button>
          <div className="flex items-center gap-4 text-right">
            <button onClick={() => fetchNews()} className="text-gray-400 hover:text-black transition">
              <MdRefresh size={22} />
            </button>
            <div>
              <h2 className="text-sm font-black text-gray-700 uppercase">News Desk</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Article & Media Assets</span>
            </div>
          </div>
        </div>

        {/* INPUT FORM */}
        <div className={`mb-8 p-5 border-2 rounded-xl transition-all shadow-sm ${editingId ? 'border-orange-500 bg-orange-50/20' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
              {editingId ? "Edit News Article" : "Compose News"}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-red-500 flex items-center gap-1 text-[10px] font-black hover:underline">
                <MdClose /> DISCARD EDIT
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* COLUMN 1: Basic Info */}
            <div className="space-y-3">
              <select className="w-full border rounded px-3 py-2 text-sm font-bold bg-white" 
                value={formData.videoDetailsId} onChange={e => setFormData({...formData, videoDetailsId: e.target.value})}>
                <option value="">Select Video Detail...</option>
                {detailsList.map(d => <option key={d.id} value={d.id}>{d.introHeader?.toUpperCase() || d.id.slice(0,8)}</option>)}
              </select>
              <input type="text" placeholder="News Header" className="w-full border rounded px-3 py-2 text-sm font-bold outline-none" 
                value={formData.header} onChange={e => setFormData({...formData, header: e.target.value})} />
              <textarea placeholder="Main News Content" className="w-full border rounded px-3 py-2 text-sm h-24 resize-none" 
                value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
            </div>

            {/* COLUMN 2: Audio & Color */}
            <div className="space-y-4">
              <textarea placeholder="Audio Speech Content" className="w-full border rounded px-3 py-2 text-xs h-20 bg-blue-50/30 font-mono" 
                value={formData.audioContent} onChange={e => setFormData({...formData, audioContent: e.target.value})} />
              
              <div className="flex items-center gap-4 p-2 bg-white border rounded-lg">
                <label className="text-[10px] font-black uppercase text-gray-400">Warning Color</label>
                <input type="color" className="h-8 w-full cursor-pointer bg-transparent"
                  value={formData.newsWarningColor} onChange={e => setFormData({...formData, newsWarningColor: e.target.value})} />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-[10px] font-black uppercase text-red-500">
                <input type="checkbox" checked={formData.autoDelete} onChange={e => setFormData({...formData, autoDelete: e.target.checked})} />
                Auto-Delete after broadcast
              </label>
            </div>

            {/* COLUMN 3: Multimedia Keys */}
            <div className="flex flex-col gap-3">
              <div className="p-3 border rounded-lg bg-white space-y-3 shadow-inner">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                    <input type="checkbox" checked={formData.isImageMultiMediaKeyUploaded} onChange={e => setFormData({...formData, isImageMultiMediaKeyUploaded: e.target.checked})} />
                    <MdImage /> Image Key
                  </label>
                  <input type="text" placeholder="UUID" className="w-full border rounded px-2 py-1 text-[10px]" 
                    value={formData.imageMultiMediaKey || ""} onChange={e => setFormData({...formData, imageMultiMediaKey: e.target.value})} />
                </div>
                <div className="space-y-2 border-t pt-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                    <input type="checkbox" checked={formData.isAudioMultiMediaKeyUploaded} onChange={e => setFormData({...formData, isAudioMultiMediaKeyUploaded: e.target.checked})} />
                    <MdAudiotrack /> Audio Key
                  </label>
                  <input type="text" placeholder="UUID" className="w-full border rounded px-2 py-1 text-[10px]" 
                    value={formData.audioMultiMediaKey || ""} onChange={e => setFormData({...formData, audioMultiMediaKey: e.target.value})} />
                </div>
              </div>
              <button onClick={handleAction} className={`w-full py-4 rounded-lg text-xs font-black uppercase transition shadow-md
                ${editingId ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-black text-white hover:bg-gray-800'}`}>
                {editingId ? "Update News Item" : "Publish News"}
              </button>
            </div>
          </div>
        </div>

        {/* LIST TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-center text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-tighter">
                <th className="px-2 py-4 border-b text-left">Article Info</th>
                <th className="px-2 py-4 border-b">Media</th>
                <th className="px-2 py-4 border-b">Warning</th>
                <th className="px-2 py-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((n) => (
                <tr key={n.id} className={`${editingId === n.id ? 'bg-orange-50/50' : 'hover:bg-gray-50'}`}>
                  <td className="px-2 py-4 border-b border-gray-50 text-left">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 uppercase leading-tight">{n.header}</span>
                      <span className="text-[9px] text-gray-400 truncate max-w-[200px]">{n.content}</span>
                    </div>
                  </td>
                  <td className="px-2 py-4 border-b border-gray-50">
                    <div className="flex justify-center gap-2">
                      {n.isImageMultiMediaKeyUploaded && <MdImage className="text-blue-500" size={18} />}
                      {n.isAudioMultiMediaKeyUploaded && <MdAudiotrack className="text-purple-500" size={18} />}
                    </div>
                  </td>
                  <td className="px-2 py-4 border-b border-gray-50">
                     <div className="w-6 h-6 rounded border border-gray-200 mx-auto" style={{backgroundColor: n.newsWarningColor}}></div>
                  </td>
                  <td className="px-2 py-4 border-b border-gray-50">
                    <div className="flex justify-center items-center gap-3">
                      <button onClick={() => startEdit(n)} className="text-blue-500 hover:text-blue-700 transition"><MdEdit size={18} /></button>
                      <button onClick={() => deleteNews(n.id)} className="text-gray-200 hover:text-red-500 transition"><MdDelete size={18} /></button>
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