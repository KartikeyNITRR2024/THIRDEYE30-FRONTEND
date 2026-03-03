import { useContext, useState } from "react";
import { MdArrowBack, MdRefresh, MdSwapHoriz, MdRadioButtonChecked, MdPlayArrow } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import VideoContext from "../../../contexts/VideoCreater/Videos/VideoContext";
import CurrentVideoContext from "../../../contexts/VideoCreater/CurrentVideo/CurrentVideoContext";

export default function CurrentVideoArea({ onBack }) {
  const { videoList } = useContext(VideoContext);
  const { currentVideo, fetchCurrentVideo, updateCurrentVideo } = useContext(CurrentVideoContext);
  const [selectedId, setSelectedId] = useState("");

  // Only show videos where isCompleted is false
  const pendingVideos = videoList.filter((v) => !v.isCompleted);
  
  // Find the video object for the currently active videoId
  const activeVideo = videoList.find((v) => v.id === currentVideo?.videoId);

  const handleUpdate = () => {
    if (selectedId) {
      updateCurrentVideo(selectedId);
      setSelectedId("");
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
            <button onClick={() => fetchCurrentVideo()} className="text-gray-400 hover:text-black">
              <MdRefresh size={22} />
            </button>
            <div>
              <h2 className="text-sm font-black text-gray-700 uppercase">Broadcast Controller</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Singleton Management
              </span>
            </div>
          </div>
        </div>

        {/* ACTIVE STATUS PANEL (Same style as your Input Form) */}
        <div className="mb-8 p-5 border-2 rounded-xl border-gray-100 bg-gray-50 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <MdRadioButtonChecked className="text-red-500 animate-pulse" /> Now Active
            </h3>
            <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 rounded italic">
              LIVE SOURCE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* CURRENT DISPLAY */}
            <div className="md:col-span-2 flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-inner">
              <div className="bg-black p-3 rounded-full text-white shadow-md">
                <MdPlayArrow size={24} />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">Current Title</span>
                <h3 className="text-sm font-black text-gray-800 uppercase truncate leading-tight">
                  {activeVideo ? activeVideo.name : "System Standby"}
                </h3>
                <p className="text-[10px] text-gray-400 font-mono truncate mt-1">
                  ID: {currentVideo?.videoId || "NONE"}
                </p>
              </div>
            </div>

            {/* SELECTION DROPDOWN */}
            <div className="flex flex-col justify-center gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Swap Content</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm font-bold bg-white outline-none focus:border-black transition"
              >
                <option value="">Select Pending Video...</option>
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
                disabled={!selectedId}
                className={`w-full py-3 rounded-lg text-xs font-black uppercase transition shadow-md flex items-center justify-center gap-2
                  ${selectedId ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-300 cursor-not-allowed border'}`}
              >
                <MdSwapHoriz size={18} /> Switch Source
              </button>
              {pendingVideos.length === 0 && (
                <p className="text-[8px] text-orange-500 font-bold mt-2 text-center uppercase">
                  No incomplete videos available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RECENT PENDING TABLE PREVIEW (Optional but keeps layout consistent) */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Available Incomplete Videos: {pendingVideos.length}</p>
           <div className="flex flex-wrap gap-2">
              {pendingVideos.slice(0, 5).map(v => (
                <span key={v.id} className="text-[9px] bg-white border border-gray-200 px-2 py-1 rounded font-bold text-gray-600">
                  {v.name}
                </span>
              ))}
              {pendingVideos.length > 5 && <span className="text-[9px] text-gray-400 font-bold">+{pendingVideos.length - 5} more</span>}
           </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}