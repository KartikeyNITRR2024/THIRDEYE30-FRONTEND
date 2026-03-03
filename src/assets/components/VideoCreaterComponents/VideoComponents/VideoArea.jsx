import { useContext, useState } from "react";
import { MdArrowBack, MdRefresh, MdDelete, MdEdit, MdClose, MdCheckCircle, MdHourglassEmpty } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import VideoContext from "../../../contexts/VideoCreater/Videos/VideoContext";
import StockContext from "../../../contexts/VideoCreater/Stock/StockContext"; // Import StockContext
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function VideoArea({ onBack }) {
  const { notifySuccess } = useContext(NotificationContext);
  const { videoList, pendingVideosCount, fetchVideos, addVideo, updateVideo, deleteVideo } = useContext(VideoContext);
  const { groups } = useContext(StockContext);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dateOfUpload: new Date().toISOString().slice(0, 16),
    typeOfVideo: "NEWS_LADDER",
    stockGroup: "", // This will store the UUID
    adsPresent: false,
    adsId: "",
    isCompleted: false
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      dateOfUpload: new Date().toISOString().slice(0, 16),
      typeOfVideo: "NEWS_LADDER",
      stockGroup: "",
      adsPresent: false,
      adsId: "",
      isCompleted: false
    });
  };

  const handleAction = async () => {
    if (!formData.name || !formData.stockGroup) return;
    if (editingId) {
      const success = await updateVideo(editingId, formData);
      if (success) resetForm();
    } else {
      await addVideo(formData);
      resetForm();
    }
  };

  const startEdit = (video) => {
    setEditingId(video.id);
    setFormData({
      name: video.name || "",
      description: video.description || "",
      dateOfUpload: video.dateOfUpload ? video.dateOfUpload.slice(0, 16) : "",
      typeOfVideo: video.typeOfVideo || "NEWS_LADDER",
      stockGroup: video.stockGroup || "",
      adsPresent: video.adsPresent || false,
      adsId: video.adsId || "",
      isCompleted: video.isCompleted || false
    });
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
            <button onClick={() => fetchVideos()} className="text-gray-400 hover:text-black">
              <MdRefresh size={22} className={pendingVideosCount > 0 ? "animate-spin" : ""} />
            </button>
            <div>
              <h2 className="text-sm font-black text-gray-700 uppercase">Video Console</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {pendingVideosCount} Processing Tasks
              </span>
            </div>
          </div>
        </div>

        {/* INPUT FORM */}
        <div className={`mb-8 p-5 border-2 rounded-xl transition-all shadow-sm ${editingId ? 'border-blue-500 bg-blue-50/20' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
              {editingId ? "Edit Video Mode" : "Register New Video"}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-red-500 flex items-center gap-1 text-[10px] font-black hover:underline">
                <MdClose /> CANCEL EDIT
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-3">
              <input type="text" placeholder="Title" className="w-full border rounded px-3 py-2 text-sm outline-none" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <textarea placeholder="Description" className="w-full border rounded px-3 py-2 text-sm h-20 resize-none outline-none" 
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            
            <div className="space-y-3">
              <select className="w-full border rounded px-3 py-2 text-sm bg-white font-bold" 
                value={formData.typeOfVideo} onChange={e => setFormData({...formData, typeOfVideo: e.target.value})}>
                <option value="NEWS_LADDER">NEWS_LADDER</option>
                <option value="NEWS_IMAGE">NEWS_IMAGE</option>
                <option value="NEWS_STOCKRACE">NEWS_STOCKRACE</option>
                <option value="STOCKRACE">STOCKRACE</option>
              </select>

              {/* DROPDOWN FOR STOCK GROUP */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Assign Stock Group</label>
                <select 
                  className={`w-full border rounded px-3 py-2 text-sm font-bold bg-white ${!formData.stockGroup && 'text-red-400'}`}
                  value={formData.stockGroup} 
                  onChange={e => setFormData({...formData, stockGroup: e.target.value})}
                >
                  <option value="">Select Group...</option>
                  {(groups || []).map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <input type="datetime-local" className="w-full border rounded px-3 py-2 text-sm bg-white font-medium" 
                value={formData.dateOfUpload} onChange={e => setFormData({...formData, dateOfUpload: e.target.value})} />
            </div>

            <div className="flex flex-col gap-3 justify-between">
              <div className="p-3 border rounded-lg bg-white space-y-2 shadow-inner">
                <label className="flex items-center gap-2 cursor-pointer text-[10px] font-black uppercase text-gray-400">
                  <input type="checkbox" checked={formData.adsPresent} onChange={e => setFormData({...formData, adsPresent: e.target.checked})} />
                  Ads Present
                </label>
                {formData.adsPresent && (
                  <input type="text" placeholder="Ads ID" className="w-full border rounded px-2 py-1 text-xs" 
                    value={formData.adsId} onChange={e => setFormData({...formData, adsId: e.target.value})} />
                )}
                {editingId && (
                  <label className="flex items-center gap-2 cursor-pointer text-[10px] font-black uppercase text-blue-600 border-t pt-2 mt-2">
                    <input type="checkbox" checked={formData.isCompleted} onChange={e => setFormData({...formData, isCompleted: e.target.checked})} />
                    Is Completed
                  </label>
                )}
              </div>
              <button 
                onClick={handleAction} 
                disabled={!formData.stockGroup || !formData.name}
                className={`w-full py-3 rounded-lg text-xs font-black uppercase transition shadow-md
                ${(!formData.stockGroup || !formData.name) ? 'bg-gray-300 cursor-not-allowed' : editingId ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-black text-white hover:bg-gray-800'}`}>
                {editingId ? "Update Record" : "Save Record"}
              </button>
            </div>
          </div>
        </div>

        {/* LIST TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-center text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-tighter">
                <th className="px-2 py-4 border-b">Progress</th>
                <th className="px-2 py-4 border-b text-left">Identity</th>
                <th className="px-2 py-4 border-b">Group</th>
                <th className="px-2 py-4 border-b">Settings</th>
                <th className="px-2 py-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videoList.map((v) => {
                const groupName = v.stockGroup ? (groups.find(g => g.id === v.stockGroup)?.name || "N/A") : "";
                return (
                  <tr key={v.id} className={`${editingId === v.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-2 py-4 border-b border-gray-50">
                      {v.isCompleted ? 
                        <div className="flex items-center justify-center text-green-500 font-bold text-[11px]"><MdCheckCircle className="mr-1"/> READY</div> : 
                        <div className="flex items-center justify-center text-blue-400 font-bold text-[11px] animate-pulse"><MdHourglassEmpty className="mr-1"/> PENDING</div>
                      }
                    </td>
                    <td className="px-2 py-4 text-left border-b border-gray-50">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 uppercase tracking-tighter leading-tight">{v.name}</span>
                        <span className="text-[9px] text-gray-400 font-black">{v.typeOfVideo}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4 border-b border-gray-50">
                       <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                         {groupName}
                       </span>
                    </td>
                    <td className="px-2 py-4 border-b border-gray-50">
                       <span className={`text-[9px] px-2 py-0.5 rounded font-black border ${v.adsPresent ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                          {v.adsPresent ? `ADS ID: ${v.adsId}` : 'CLEAN'}
                       </span>
                    </td>
                    <td className="px-2 py-4 border-b border-gray-50">
                      <div className="flex justify-center items-center gap-4">
                        <button onClick={() => startEdit(v)} className="text-blue-500 hover:text-blue-700 transition">
                          <MdEdit size={18} />
                        </button>
                        <button onClick={() => deleteVideo(v.id)} className="text-gray-200 hover:text-red-500 transition">
                          <MdDelete size={18} />
                        </button>
                        <button onClick={() => {navigator.clipboard.writeText(v.id); notifySuccess("ID Copied");}} className="text-[9px] font-black text-gray-300 hover:text-black">
                          ID
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}