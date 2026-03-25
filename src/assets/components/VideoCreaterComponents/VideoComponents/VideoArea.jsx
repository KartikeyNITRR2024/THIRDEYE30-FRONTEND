import { useContext, useState, useMemo } from "react";
import { 
  MdArrowBack, MdRefresh, MdDelete, MdEdit, MdClose, 
  MdEvent, MdRocketLaunch, MdAdd, MdTaskAlt,
  MdContentCopy, MdVisibility, MdHistory, MdTimeline, MdStorage
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
  const { adList } = useContext(AdvertisementContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startdateOfUpload: new Date().toISOString().slice(0, 16),
    enddateOfUpload: new Date().toISOString().slice(0, 16),
    interval: "ONE_DAY",
    typeOfVideo: "NEWS_LADDER",
    stockGroup: "", 
    adsPresent: false,
    adsId: "",
    isCompleted: false,
    videoMultiMediaKey: ""
  });

  const activeAds = useMemo(() => (adList || []).filter(ad => ad.active), [adList]);

  const openCreateModal = () => { resetForm(); setIsModalOpen(true); };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "", description: "",
      startdateOfUpload: new Date().toISOString().slice(0, 16),
      enddateOfUpload: new Date().toISOString().slice(0, 16),
      interval: "ONE_DAY",
      typeOfVideo: "NEWS_LADDER", stockGroup: "",
      adsPresent: false, adsId: "", isCompleted: false,
      videoMultiMediaKey: ""
    });
    setIsModalOpen(false);
  };

  const handleAction = async () => {
    // Only require stockGroup if it's a NEWS_STOCKRACE
    const isRace = formData.typeOfVideo === "NEWS_STOCKRACE";
    if (!formData.name || (isRace && !formData.stockGroup)) return;
    
    const success = editingId ? await updateVideo(editingId, formData) : await addVideo(formData);
    if (success) resetForm();
  };

  const startEdit = (video) => {
    setEditingId(video.id);
    setFormData({
      ...video,
      startdateOfUpload: video.startdateOfUpload ? video.startdateOfUpload.slice(0, 16) : "",
      enddateOfUpload: video.enddateOfUpload ? video.enddateOfUpload.slice(0, 16) : "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div>
                <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Production Console</h2>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className={`w-2 h-2 rounded-full ${pendingVideosCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  {videoList.length} RECORDS
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={() => fetchVideos()} className="bg-white p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 shadow-sm"><MdRefresh size={20} className={pendingVideosCount > 0 ? "animate-spin text-blue-500" : ""} /></button>
            <button onClick={openCreateModal} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95"><MdAdd size={18} /> New Production</button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
              
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${editingId ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>{editingId ? <MdTaskAlt size={20} /> : <MdRocketLaunch size={20} />}</div>
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">{editingId ? "Modify Production" : "Initiate Production"}</h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Video Title</label>
                            <input type="text" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800" 
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
                        {/* CONDITIONAL SOURCE & INTERVAL - ONLY SHOW IF NEWS_STOCKRACE */}
                        {formData.typeOfVideo === "NEWS_STOCKRACE" ? (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                              <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-600 uppercase ml-1 flex items-center gap-1"><MdStorage /> Data Source</label>
                                  <select className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-xs font-bold bg-white outline-none focus:border-blue-600"
                                      value={formData.stockGroup} onChange={e => setFormData({...formData, stockGroup: e.target.value})}>
                                      <option value="">Select Group...</option>
                                      {(groups || []).map(g => (<option key={g.id} value={g.id}>{g.name.toUpperCase()}</option>))}
                                  </select>
                              </div>
                              <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-600 uppercase ml-1 flex items-center gap-1"><MdTimeline /> Interval</label>
                                  <select className="w-full border-2 border-blue-100 rounded-xl px-4 py-2.5 text-xs bg-white font-bold outline-none focus:border-blue-600" 
                                      value={formData.interval} onChange={e => setFormData({...formData, interval: e.target.value})}>
                                      <option value="ONE_MINUTE">1 Minute</option>
                                      <option value="FIVE_MINUTES">5 Minutes</option>
                                      <option value="FIFTEEN_MINUTES">15 Minutes</option>
                                      <option value="ONE_HOUR">1 Hour</option>
                                      <option value="ONE_DAY">1 Day</option>
                                      <option value="ONE_WEEK">1 Week</option>
                                  </select>
                              </div>
                          </motion.div>
                        ) : (
                          <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl p-6 text-center">
                              <p className="text-[10px] font-bold text-slate-300 uppercase leading-relaxed tracking-wider">Additional parameters only required for StockRace Engine</p>
                          </div>
                        )}
                    </div>
                </div>

                {/* CONDITIONAL DATES - ONLY SHOW IF NEWS_STOCKRACE */}
                {formData.typeOfVideo === "NEWS_STOCKRACE" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
                      <div className="space-y-1">
                          <label className="text-[9px] font-black text-blue-600 uppercase ml-1 flex items-center gap-1"><MdEvent/> Analysis Start</label>
                          <input type="datetime-local" className="w-full border-2 border-white rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-blue-600" 
                          value={formData.startdateOfUpload} onChange={e => setFormData({...formData, startdateOfUpload: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                          <label className="text-[9px] font-black text-blue-600 uppercase ml-1 flex items-center gap-1"><MdHistory/> Analysis End</label>
                          <input type="datetime-local" className="w-full border-2 border-white rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-blue-600" 
                          value={formData.enddateOfUpload} onChange={e => setFormData({...formData, enddateOfUpload: e.target.value})} />
                      </div>
                  </motion.div>
                )}

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Notes</label>
                    <textarea className="w-full border-2 rounded-xl px-4 py-2.5 text-xs h-20 resize-none outline-none focus:border-slate-800" 
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-700 uppercase">Ad Integration</span>
                          <input type="checkbox" className="w-5 h-5 accent-slate-800 cursor-pointer" checked={formData.adsPresent} 
                            onChange={e => setFormData({...formData, adsPresent: e.target.checked, adsId: e.target.checked ? formData.adsId : ""})} />
                      </div>
                      {formData.adsPresent && (
                          <div className="mt-4 space-y-1">
                              <select className="w-full border-2 rounded-xl px-4 py-2 text-xs font-bold bg-white outline-none focus:border-blue-600"
                                value={formData.adsId} onChange={e => setFormData({...formData, adsId: e.target.value})}>
                                  <option value="">Select Ad...</option>
                                  {activeAds.map(ad => (<option key={ad.id} value={ad.id}>{ad.name.toUpperCase()}</option>))}
                              </select>
                          </div>
                      )}
                  </div>
                  {editingId && (
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-700 uppercase">Mark Completed</span>
                        <input type="checkbox" className="w-5 h-5 accent-blue-600 cursor-pointer" checked={formData.isCompleted} 
                          onChange={e => setFormData({...formData, isCompleted: e.target.checked})} />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 rounded-xl transition">Cancel</button>
                <button onClick={handleAction} 
                    className={`flex-[2] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg
                    ${!formData.name ? 'bg-slate-100 text-slate-300 shadow-none' : editingId ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
                    {editingId ? "Update Production" : "Confirm Production"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER VIDEO LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {videoList.map((v) => {
          const groupName = v.stockGroup ? (groups.find(g => g.id === v.stockGroup)?.name || "DETACHED") : "NONE";
          return (
            <motion.div layout key={v.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${v.isCompleted ? 'bg-emerald-400' : 'bg-blue-400 animate-pulse'}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-black text-slate-800 uppercase text-xs truncate max-w-[150px]">{v.name}</h4>
                    <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">{v.typeOfVideo}</span>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => startEdit(v)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg transition"><MdEdit size={18} /></button>
                    <button onClick={() => deleteVideo(v.id)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"><MdDelete size={18} /></button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 font-bold uppercase tracking-tighter">Status</span>
                    {v.isCompleted ? <span className="text-emerald-600 font-black uppercase">Ready</span> : <span className="text-blue-500 font-black uppercase animate-pulse">Processing</span>}
                </div>
                {v.typeOfVideo === "NEWS_STOCKRACE" && (
                   <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400 font-bold uppercase tracking-tighter">Source Group</span>
                      <span className="text-slate-700 font-black uppercase truncate max-w-[100px]">{groupName}</span>
                   </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}