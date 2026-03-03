import { useContext, useState } from "react";
import { MdArrowBack, MdRefresh, MdSwapHoriz, MdRadioButtonChecked, MdPlayArrow, MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import VideoContext from "../../../contexts/VideoCreater/Videos/VideoContext";
import CurrentVideoContext from "../../../contexts/VideoCreater/CurrentVideo/CurrentVideoContext";

export default function CurrentVideoArea({ onBack }) {
  const { videoList } = useContext(VideoContext);
  const { currentVideo, fetchCurrentVideo, updateCurrentVideo } = useContext(CurrentVideoContext);

  // 1. Initial state with null pattern
  const initialForm = {
    videoId: null
  };

  const [formData, setFormData] = useState(initialForm);

  // Only show videos where isCompleted is false
  const pendingVideos = videoList.filter((v) => !v.isCompleted);
  
  // Find the video object for the currently active videoId
  const activeVideo = videoList.find((v) => v.id === currentVideo?.videoId);

  // 2. Reset logic
  const reset = () => {
    setFormData(initialForm);
  };

  const handleUpdate = async () => {
    if (!formData.videoId) return;
    
    // Ensure ID is passed correctly (usually as a string or number based on your API)
    const success = await updateCurrentVideo(formData.videoId);
    
    if (success !== false) {
      reset();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="bg-white rounded-xl p-4 shadow-md mt-6 border border-gray-100"
      >
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <button onClick={onBack} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-bold transition">
            <MdArrowBack size={18} /> BACK
          </button>
          <div className="flex items-center gap-4 text-right">
            <button onClick={() => fetchCurrentVideo()} className="text-gray-400 hover:text-black transition active:scale-90">
              <MdRefresh size={22} />
            </button>
            <div>
              <h2 className="text-sm font-black text-gray-700 uppercase leading-none">Broadcast Controller</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Singleton Management
              </span>
            </div>
          </div>
        </div>

        {/* ACTIVE STATUS PANEL */}
        <div className="mb-8 p-5 border-2 rounded-xl border-gray-100 bg-gray-50 shadow-sm relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <MdRadioButtonChecked className="text-red-500 animate-pulse" /> Now Active
            </h3>
            <div className="flex gap-2 items-center">
                {formData.videoId && (
                    <button onClick={reset} className="text-[9px] font-black text-rose-500 flex items-center gap-0.5 hover:underline">
                        <MdClose /> CANCEL SWAP
                    </button>
                )}
                <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 rounded italic">
                    LIVE SOURCE
                </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* CURRENT DISPLAY */}
            <div className="md:col-span-2 flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-inner">
              <div className="bg-gradient-to-br from-gray-800 to-black p-3 rounded-full text-white shadow-lg">
                <MdPlayArrow size={24} />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">Current Title</span>
                <h3 className="text-sm font-black text-gray-800 uppercase truncate leading-tight">
                  {activeVideo ? activeVideo.name : "System Standby"}
                </h3>
                <p className="text-[10px] text-gray-400 font-mono truncate mt-1">
                  ID: <span className="text-gray-600">{currentVideo?.videoId || "NONE"}</span>
                </p>
              </div>
            </div>

            {/* SELECTION DROPDOWN - MAPPED TO formData.videoId */}
            <div className="flex flex-col justify-center gap-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Swap Content</label>
              <select
                value={formData.videoId ?? ""}
                onChange={(e) => setFormData({...formData, videoId: e.target.value})}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm font-bold bg-white outline-none focus:border-black transition shadow-sm appearance-none"
              >
                <option value="" disabled>Select Pending Video...</option>
                {pendingVideos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* ACTION BUTTON */}
            <div className="flex flex-col justify-end">
              <button 
                onClick={handleUpdate}
                disabled={!formData.videoId}
                className={`w-full py-3.5 rounded-xl text-xs font-black uppercase transition shadow-lg flex items-center justify-center gap-2 active:scale-95
                  ${formData.videoId ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-300 cursor-not-allowed border-2'}`}
              >
                <MdSwapHoriz size={20} /> Switch Source
              </button>
            </div>
          </div>
          
          {!formData.videoId && pendingVideos.length === 0 && (
             <div className="absolute -bottom-6 left-0 right-0 text-center">
                <p className="text-[9px] text-orange-500 font-black uppercase tracking-widest">
                  Queue Empty: No incomplete videos available for broadcast
                </p>
             </div>
          )}
        </div>

        {/* PENDING QUEUE PREVIEW */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-4">
           <div className="flex justify-between items-center mb-3">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                 Upcoming Queue ({pendingVideos.length})
               </p>
               <div className="h-px flex-1 bg-gray-200 mx-4"></div>
           </div>
           <div className="flex flex-wrap gap-2">
              {pendingVideos.length > 0 ? (
                pendingVideos.slice(0, 8).map(v => (
                    <div key={v.id} className="group relative">
                        <span className="text-[10px] bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold text-gray-600 shadow-sm block hover:border-black transition-colors">
                          {v.name}
                        </span>
                    </div>
                  ))
              ) : (
                <span className="text-[10px] text-gray-400 italic font-medium">All video production cycles are completed.</span>
              )}
              {pendingVideos.length > 8 && (
                <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg font-black">
                    +{pendingVideos.length - 8} MORE
                </span>
              )}
           </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}