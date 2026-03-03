import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdDelete, MdEdit, MdClose, 
  MdCheckCircle, MdHourglassEmpty, MdVideocam, MdLayers, 
  MdEvent, MdCampaign, MdRocketLaunch 
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import VideoContext from "../../../contexts/VideoCreater/Videos/VideoContext";
import StockContext from "../../../contexts/VideoCreater/Stock/StockContext";
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
    stockGroup: "", 
    adsPresent: false,
    adsId: "",
    isCompleted: false
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "", description: "",
      dateOfUpload: new Date().toISOString().slice(0, 16),
      typeOfVideo: "NEWS_LADDER", stockGroup: "",
      adsPresent: false, adsId: "", isCompleted: false
    });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <button onClick={onBack} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95">
            <MdArrowBack size={18} /> BACK
          </button>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Video Console</h2>
              <div className="flex items-center justify-end gap-2">
                 <span className={`w-2 h-2 rounded-full ${pendingVideosCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{pendingVideosCount} ACTIVE TASKS</span>
              </div>
            </div>
            <button onClick={() => fetchVideos()} className="bg-slate-50 p-2.5 rounded-full text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
              <MdRefresh size={22} className={pendingVideosCount > 0 ? "animate-spin text-blue-500" : ""} />
            </button>
          </div>
        </div>

        {/* REGISTRATION FORM */}
        <div className={`mb-8 p-6 border-2 rounded-2xl transition-all shadow-sm ${editingId ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 bg-slate-50/50 border-dashed'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] flex items-center gap-2">
              <MdRocketLaunch className={editingId ? "text-blue-500" : ""} size={18}/>
              {editingId ? "Modify Production Parameters" : "Initiate Production Sequence"}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-rose-500 flex items-center gap-1 text-[9px] font-black hover:bg-rose-50 px-2 py-1 rounded transition uppercase">
                <MdClose /> Abort Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* NAME & DESC */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Video Title</label>
                <input type="text" placeholder="Task Identifier..." className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800 transition-all bg-white" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Context / Description</label>
                <textarea placeholder="Production notes..." className="w-full border-2 rounded-xl px-4 py-2.5 text-xs h-[88px] resize-none outline-none focus:border-slate-800 transition-all bg-white" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
            
            {/* CONFIGURATION */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Engine Template</label>
                <div className="relative">
                    <MdLayers className="absolute left-3 top-3 text-slate-400" size={16}/>
                    <select className="w-full border-2 rounded-xl pl-10 pr-4 py-2.5 text-xs bg-white font-bold appearance-none outline-none focus:border-slate-800" 
                        value={formData.typeOfVideo} onChange={e => setFormData({...formData, typeOfVideo: e.target.value})}>
                        <option value="NEWS_LADDER">NEWS_LADDER</option>
                        <option value="NEWS_IMAGE">NEWS_IMAGE</option>
                        <option value="NEWS_STOCKRACE">NEWS_STOCKRACE</option>
                        <option value="STOCKRACE">STOCKRACE</option>
                    </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Data Source (Stock Group)</label>
                <select 
                  className={`w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold bg-white outline-none focus:border-slate-800 ${!formData.stockGroup && 'border-amber-200 text-amber-600'}`}
                  value={formData.stockGroup} 
                  onChange={e => setFormData({...formData, stockGroup: e.target.value})}
                >
                  <option value="">Select Group...</option>
                  {(groups || []).map(g => (
                    <option key={g.id} value={g.id}>{g.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdEvent/> Schedule Upload</label>
                <input type="datetime-local" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs bg-white font-bold outline-none focus:border-slate-800" 
                  value={formData.dateOfUpload} onChange={e => setFormData({...formData, dateOfUpload: e.target.value})} />
              </div>
            </div>

            {/* STATUS & CTA */}
            <div className="flex flex-col gap-4">
              <div className="p-4 border-2 rounded-2xl bg-white space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><MdCampaign/> Ad Campaign</span>
                    <input type="checkbox" className="w-4 h-4 accent-slate-800" checked={formData.adsPresent} onChange={e => setFormData({...formData, adsPresent: e.target.checked})} />
                </div>
                
                <AnimatePresence>
                    {formData.adsPresent && (
                    <motion.input initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        type="text" placeholder="Ads System ID" className="w-full border-b-2 py-1 text-xs font-mono outline-none focus:border-amber-400" 
                        value={formData.adsId} onChange={e => setFormData({...formData, adsId: e.target.value})} />
                    )}
                </AnimatePresence>

                {editingId && (
                  <div className="flex items-center justify-between border-t pt-3 mt-1">
                    <span className="text-[9px] font-black text-blue-600 uppercase">Production Status</span>
                    <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={formData.isCompleted} onChange={e => setFormData({...formData, isCompleted: e.target.checked})} />
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleAction} 
                disabled={!formData.stockGroup || !formData.name}
                className={`w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-[3px] transition-all shadow-lg active:scale-95
                ${(!formData.stockGroup || !formData.name) ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : editingId ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-black'}`}>
                {editingId ? "Commit Changes" : "Deploy Video Task"}
              </button>
            </div>
          </div>
        </div>

        {/* LIST TABLE */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                <th className="px-4 py-4 border-b text-center w-24">Workflow</th>
                <th className="px-4 py-4 border-b text-left">Video Identity</th>
                <th className="px-4 py-4 border-b text-center">Dataset</th>
                <th className="px-4 py-4 border-b text-center">Integrations</th>
                <th className="px-4 py-4 border-b text-right">Utility</th>
              </tr>
            </thead>
            <tbody>
              {videoList.map((v) => {
                const groupName = v.stockGroup ? (groups.find(g => g.id === v.stockGroup)?.name || "DETACHED") : "NONE";
                return (
                  <tr key={v.id} className={`transition-colors border-b border-slate-50 last:border-0 ${editingId === v.id ? 'bg-blue-50/50' : 'hover:bg-slate-50/30'}`}>
                    <td className="px-4 py-4 text-center">
                      {v.isCompleted ? 
                        <div className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-600 font-black text-[8px] uppercase tracking-tighter border border-emerald-100"><MdCheckCircle className="mr-1" size={12}/> READY</div> : 
                        <div className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-500 font-black text-[8px] uppercase tracking-tighter border border-blue-100 animate-pulse"><MdHourglassEmpty className="mr-1" size={12}/> RENDERING</div>
                      }
                    </td>
                    <td className="px-4 py-4 text-left">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-700 uppercase text-xs tracking-tight leading-none mb-1">{v.name}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded font-bold uppercase tracking-widest">{v.typeOfVideo}</span>
                            <span className="text-[8px] text-slate-400 font-mono italic truncate max-w-[100px]">{v.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                       <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase shadow-sm border ${v.stockGroup ? 'bg-white text-slate-600 border-slate-200' : 'bg-rose-50 text-rose-400 border-rose-100'}`}>
                         {groupName}
                       </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                       <span className={`text-[9px] px-2.5 py-1 rounded-full font-black border ${v.adsPresent ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                          {v.adsPresent ? `AD-SYNC: ${v.adsId}` : 'NO ADS'}
                       </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <button onClick={() => startEdit(v)} className="p-2 text-blue-500 hover:bg-white rounded-lg border border-transparent hover:border-blue-100 transition-all shadow-sm">
                          <MdEdit size={18} />
                        </button>
                        <button onClick={() => deleteVideo(v.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                          <MdDelete size={18} />
                        </button>
                        <button onClick={() => {navigator.clipboard.writeText(v.id); notifySuccess("Task ID Copied");}} 
                          className="px-2 py-1 text-[8px] font-black text-slate-300 hover:text-slate-700 transition-all uppercase">
                          UUID
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