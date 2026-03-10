import { useContext, useState, useMemo } from "react";
import { 
  MdArrowBack, MdRefresh, MdDelete, MdEdit, MdClose, 
  MdCheckCircle, MdHourglassEmpty, MdLayers, 
  MdEvent, MdCampaign, MdRocketLaunch, MdAdd, MdTaskAlt,
  MdContentCopy, MdVisibility
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import VideoContext from "../../../contexts/VideoCreater/Videos/VideoContext";
import StockContext from "../../../contexts/VideoCreater/Stock/StockContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";
import AdvertisementContext from "../../../contexts/VideoCreater/Advertisement/AdvertisementContext";

export default function VideoArea({ onBack }) {
  const { notifySuccess } = useContext(NotificationContext);
  const { videoList, pendingVideosCount, fetchVideos, addVideo, updateVideo, deleteVideo, getAudioUrl } = useContext(VideoContext);
  const { groups } = useContext(StockContext);
  
  // 2. Consume Advertisement Context
  const { adList } = useContext(AdvertisementContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dateOfUpload: new Date().toISOString().slice(0, 16),
    typeOfVideo: "NEWS_LADDER",
    stockGroup: "", 
    adsPresent: false,
    adsId: "",
    isCompleted: false
  });

  // 3. Filter only active ads for the dropdown
  const activeAds = useMemo(() => {
    return (adList || []).filter(ad => ad.active);
  }, [adList]);

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "", description: "",
      dateOfUpload: new Date().toISOString().slice(0, 16),
      typeOfVideo: "NEWS_LADDER", stockGroup: "",
      adsPresent: false, adsId: "", isCompleted: false
    });
    setIsModalOpen(false);
  };

  const handleAction = async () => {
    if (!formData.name || !formData.stockGroup) return;
    const success = editingId ? await updateVideo(editingId, formData) : await addVideo(formData);
    if (success) resetForm();
  };

  const startEdit = (video) => {
    setEditingId(video.id);
    setFormData({
      ...video,
      dateOfUpload: video.dateOfUpload ? video.dateOfUpload.slice(0, 16) : "",
    });
    setIsModalOpen(true);
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    notifySuccess("Task UUID Copied to Clipboard");
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6">
      
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div>
                <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Video Console</h2>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${pendingVideosCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{videoList.length} TOTAL RECORDS</span>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={() => fetchVideos()} className="flex-1 sm:flex-none bg-white p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition shadow-sm">
                <MdRefresh size={20} className={pendingVideosCount > 0 ? "animate-spin text-blue-500" : ""} />
            </button>
            <button 
                onClick={openCreateModal}
                className="flex-3 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
            >
                <MdAdd size={18} /> New Production
            </button>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
              {/* MODAL HEADER */}
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${editingId ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>
                        {editingId ? <MdTaskAlt size={20} /> : <MdRocketLaunch size={20} />}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
                          {editingId ? "Modify Production" : "Initiate Production"}
                      </h3>
                      {editingId && (
                        <span className={`text-[8px] font-bold uppercase ${formData.isCompleted ? 'text-emerald-500' : 'text-blue-500'}`}>
                          Current Status: {formData.isCompleted ? 'Completed' : 'Rendering'}
                        </span>
                      )}
                    </div>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition">
                    <MdClose size={24} />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Video Title</label>
                            <input type="text" placeholder="Task Name..." className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800 transition-all" 
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Engine Template</label>
                            <select className="w-full border-2 rounded-xl px-4 py-2.5 text-xs bg-white font-bold outline-none focus:border-slate-800" 
                                value={formData.typeOfVideo} onChange={e => setFormData({...formData, typeOfVideo: e.target.value})}>
                                <option value="NEWS_LADDER">NEWS_LADDER</option>
                                <option value="NEWS_IMAGE">NEWS_IMAGE</option>
                                <option value="NEWS_STOCKRACE">NEWS_STOCKRACE</option>
                                <option value="STOCKRACE">STOCKRACE</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Data Source</label>
                            <select className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold bg-white outline-none focus:border-slate-800"
                                value={formData.stockGroup} onChange={e => setFormData({...formData, stockGroup: e.target.value})}>
                                <option value="">Select Group...</option>
                                {(groups || []).map(g => (<option key={g.id} value={g.id}>{g.name.toUpperCase()}</option>))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdEvent/> Schedule</label>
                            <input type="datetime-local" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800" 
                            value={formData.dateOfUpload} onChange={e => setFormData({...formData, dateOfUpload: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Production Notes</label>
                    <textarea placeholder="Optional details..." className="w-full border-2 rounded-xl px-4 py-2.5 text-xs h-24 resize-none outline-none focus:border-slate-800" 
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-700 uppercase">Ad Integration</span>
                              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">Monetization Sync</span>
                          </div>
                          {/* Updated Checkbox: Resets adsId if unchecked */}
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-slate-800" 
                            checked={formData.adsPresent} 
                            onChange={e => setFormData({...formData, adsPresent: e.target.checked, adsId: e.target.checked ? formData.adsId : ""})} 
                          />
                      </div>
                      <AnimatePresence>
                        {formData.adsPresent && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }} 
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-1"
                            >
                                <label className="text-[9px] font-black text-blue-600 uppercase ml-1">Advertisement Config</label>
                                {/* NEW DROPDOWN INSTEAD OF TEXT INPUT */}
                                <select 
                                  className="w-full border-2 rounded-xl px-4 py-2 text-xs font-bold bg-white outline-none focus:border-blue-600 transition-colors"
                                  value={formData.adsId} 
                                  onChange={e => setFormData({...formData, adsId: e.target.value})}
                               >
                                    <option value="">Select Active Ad...</option>
                                    {activeAds.map(ad => (
                                      <option key={ad.id} value={ad.id}>
                                        {ad.name.toUpperCase()}
                                      </option>
                                    ))}
                                </select>
                                {activeAds.length === 0 && (
                                  <span className="text-[8px] text-rose-500 font-bold uppercase ml-1">No active ads available</span>
                                )}
                            </motion.div>
                        )}
                      </AnimatePresence>
                  </div>

                  {editingId && (
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-blue-700 uppercase tracking-tight">Production Status</span>
                                <span className="text-[8px] text-blue-400 font-bold uppercase">Mark as completed</span>
                            </div>
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 accent-blue-600 cursor-pointer" 
                              checked={formData.isCompleted} 
                              onChange={e => setFormData({...formData, isCompleted: e.target.checked})} 
                            />
                        </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:bg-slate-50 transition">Cancel</button>
                <button 
                    onClick={handleAction} 
                    disabled={!formData.stockGroup || !formData.name}
                    className={`flex-[2] py-3 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all shadow-lg active:scale-95
                    ${(!formData.stockGroup || !formData.name) ? 'bg-slate-100 text-slate-300' : editingId ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-black'}`}>
                    {editingId ? "Update Production" : "Confirm Production"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIDEO LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {videoList.map((v) => {
          const groupName = v.stockGroup ? (groups.find(g => g.id === v.stockGroup)?.name || "DETACHED") : "NONE";
          return (
            <motion.div layout key={v.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${v.isCompleted ? 'bg-emerald-400' : 'bg-blue-400 animate-pulse'}`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="max-w-[140px]">
                    <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate">{v.name}</h4>
                    <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{v.typeOfVideo}</span>
                </div>
                <div className="flex gap-0.5 sm:gap-1">
                    <button 
                      onClick={() => copyToClipboard(v.id)} 
                      title="Copy UUID"
                      className="p-1.5 sm:p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                        <MdContentCopy size={16} />
                    </button>
                    { v.videoMultiMediaKey && <a href={getAudioUrl(v.videoMultiMediaKey)} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                      <MdVisibility size={18} />
                    </a> }
                    <button 
                      onClick={() => startEdit(v)} 
                      title="Edit"
                      className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                    >
                        <MdEdit size={18} />
                    </button>
                    <button 
                      onClick={() => deleteVideo(v.id)} 
                      title="Delete"
                      className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    >
                        <MdDelete size={18} />
                    </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-tighter">Workflow Status</span>
                    {v.isCompleted ? 
                        <span className="text-emerald-600 font-black uppercase flex items-center gap-1"><MdCheckCircle size={12}/> Ready</span> : 
                        <span className="text-blue-500 font-black uppercase flex items-center gap-1 animate-pulse"><MdHourglassEmpty size={12}/> Rendering</span>
                    }
                </div>
                <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 font-bold uppercase tracking-tighter">Dataset Group</span>
                    <span className="text-slate-700 font-black uppercase truncate max-w-[120px]">{groupName}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}