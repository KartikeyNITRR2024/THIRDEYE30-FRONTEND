import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdSwapHoriz, MdRadioButtonChecked, 
  MdPlayArrow, MdClose, MdLayers, MdSdStorage 
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import VideoContext from "../../../contexts/VideoCreater/Videos/VideoContext";
import CurrentVideoContext from "../../../contexts/VideoCreater/CurrentVideo/CurrentVideoContext";

export default function CurrentVideoArea({ onBack }) {
  const { videoList } = useContext(VideoContext);
  const { currentVideo, fetchCurrentVideo, updateCurrentVideo } = useContext(CurrentVideoContext);

  const initialForm = { videoId: null };
  const [formData, setFormData] = useState(initialForm);

  // Filter incomplete videos for the dropdown
  const pendingVideos = videoList.filter((v) => !v.isCompleted);
  
  // Identify the currently broadcasting video
  const activeVideo = videoList.find((v) => v.id === currentVideo?.videoId);

  const reset = () => setFormData(initialForm);

  const handleUpdate = async () => {
    if (!formData.videoId) return;
    const success = await updateCurrentVideo(formData.videoId);
    if (success !== false) reset();
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6">
      
      {/* TOP HEADER - Matches VideoArea */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div>
                <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Broadcast Controller</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Singleton Management</span>
                </div>
            </div>
        </div>
        
        <button onClick={() => fetchCurrentVideo()} className="p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition bg-white shadow-sm">
            <MdRefresh size={20} />
        </button>
      </div>

      {/* MAIN CONTROL PANEL */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        {/* STATUS BAR */}
        <div className="bg-slate-900 px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <MdRadioButtonChecked className="text-rose-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-[2px]">Live Transmission</span>
            </div>
            {formData.videoId && (
                <button onClick={reset} className="text-[9px] font-black text-rose-400 flex items-center gap-1 hover:text-rose-300 transition">
                    <MdClose size={14}/> ABORT SWAP
                </button>
            )}
        </div>

        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* CURRENT ACTIVE DISPLAY */}
                <div className="lg:col-span-5">
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block ml-1">Currently On-Air</label>
                    <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                        <div className="bg-slate-900 p-4 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform">
                            <MdPlayArrow size={28} />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="text-sm font-black text-slate-800 uppercase truncate leading-tight mb-1">
                                {activeVideo ? activeVideo.name : "System Standby"}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">UUID</span>
                                <p className="text-[10px] text-slate-400 font-mono truncate">
                                    {currentVideo?.videoId || "X-000-STANDBY"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SWAP CONTROLS */}
                <div className="lg:col-span-4 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase block ml-1">Swap Content Source</label>
                    <div className="relative">
                        <select
                            value={formData.videoId ?? ""}
                            onChange={(e) => setFormData({...formData, videoId: e.target.value})}
                            className="w-full border-2 rounded-xl px-4 py-3 text-xs font-bold bg-white outline-none focus:border-slate-800 transition-all appearance-none cursor-pointer shadow-sm"
                        >
                            <option value="" disabled>Select from pending queue...</option>
                            {pendingVideos.map((v) => (
                                <option key={v.id} value={v.id}>{v.name.toUpperCase()}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <MdLayers size={18} />
                        </div>
                    </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="lg:col-span-3">
                    <button 
                        onClick={handleUpdate}
                        disabled={!formData.videoId}
                        className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95
                        ${formData.videoId ? 'bg-slate-900 text-white hover:bg-black' : 'bg-slate-100 text-slate-300 cursor-not-allowed border-2'}`}
                    >
                        <MdSwapHoriz size={20} /> Switch Source
                    </button>
                </div>
            </div>
        </div>
      </motion.div>

      {/* QUEUE PREVIEW SECTION */}
      <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-200 p-1.5 rounded-md">
                <MdSdStorage size={16} className="text-slate-600"/>
              </div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Buffer Queue ({pendingVideos.length})</h3>
              <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <div className="flex flex-wrap gap-3">
            {pendingVideos.length > 0 ? (
                pendingVideos.map(v => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        key={v.id} 
                        className="bg-white border border-slate-100 px-4 py-2.5 rounded-xl shadow-sm hover:border-blue-400 transition-colors group cursor-default"
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                {v.name}
                            </span>
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="w-full text-center py-10 bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[3px]">All Cycles Dispatched • Queue Idle</p>
                </div>
            )}
          </div>
      </div>
    </div>
  );
}