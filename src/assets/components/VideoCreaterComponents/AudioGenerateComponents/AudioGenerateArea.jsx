import { useContext, useState } from "react";
import { MdArrowBack, MdContentCopy, MdDelete, MdAdd, MdRefresh } from "react-icons/md";
import { RiLoader4Line } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import AudioGeneratorContext from "../../../contexts/VideoCreater/AudioGenerators/AudioGeneratorContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function AudioGenerateArea({ onBack }) {
  const { notifySuccess } = useContext(NotificationContext);
  const { audioList, pendingCount, fetchAudioList, getAudioUrl, addAudio, deleteAudio } = useContext(AudioGeneratorContext);

  const [newContent, setNewContent] = useState("");
  const [newAutoDelete, setNewAutoDelete] = useState(false);

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    await addAudio(newContent, newAutoDelete);
    setNewContent(""); 
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="audio-ui"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl p-4 shadow-md mt-6 max-w-full mx-auto border border-gray-100"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
          >
            <MdArrowBack size={18} /> Back
          </button>
          
          <div className="flex items-center gap-4">
            <button onClick={() => fetchAudioList()} className="text-gray-400 hover:text-black transition">
              <MdRefresh size={22} className={pendingCount > 0 ? "animate-spin" : ""} />
            </button>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm font-bold text-gray-700">Audio Management</span>
                {pendingCount > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {pendingCount} PENDING
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Newest First</p>
            </div>
          </div>
        </div>

        {/* CREATE FORM */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50 border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full text-left">
              <label className="text-[10px] font-black text-gray-400 ml-1 uppercase">Content</label>
              <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Enter text..."
                className="w-full border rounded px-3 py-2 text-sm outline-none focus:border-black mt-1"
              />
            </div>
            <div className="w-full md:w-32 text-left">
              <label className="text-[10px] font-black text-gray-400 ml-1 uppercase">Auto Delete</label>
              <select
                value={newAutoDelete}
                onChange={(e) => setNewAutoDelete(e.target.value === "true")}
                className="w-full border rounded px-3 py-2 text-sm bg-white mt-1 cursor-pointer"
              >
                <option value="false">False</option>
                <option value="true">True</option>
              </select>
            </div>
            <button
              onClick={handleCreate}
              className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-sm"
            >
              <MdAdd size={20} /> Generate
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto border-collapse text-center text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="border px-2 py-3 w-1/4">Status / Player</th>
                <th className="border px-2 py-3">Content Preview</th>
                <th className="border px-2 py-3 w-32">Config</th>
                <th className="border px-2 py-3 w-48">Table Source</th>
              </tr>
            </thead>
            <tbody>
              {audioList.map((t) => (
                <tr key={t.id} className={!t.isAudioGenerated ? 'bg-orange-50/20' : 'hover:bg-gray-50'}>
                  <td className="border px-2 py-2">
                    <AudioActionCell 
                      item={t} 
                      onCopy={() => { 
                        if(t.audioMultiMediaKey) {
                          navigator.clipboard.writeText(t.audioMultiMediaKey); 
                          notifySuccess("Multimedia Key Copied!");
                        } else {
                          notifyError("Key not generated yet");
                        }
                      }} 
                      onDelete={deleteAudio} 
                      getAudioUrl={getAudioUrl} 
                    />
                  </td>
                  <td className="border px-4 py-2 text-left">
                    <input type="text" value={t.content} readOnly className="w-full border rounded px-2 py-1 bg-gray-100 text-xs italic" />
                  </td>
                  <td className="border px-2 py-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${t.autoDelete ? 'bg-white text-orange-600 border-orange-200' : 'bg-white text-green-600 border-green-200'}`}>
                      {t.autoDelete ? "TEMP" : "SAVED"}
                    </span>
                  </td>
                  <td className="border px-2 py-2 font-bold text-gray-400 text-[10px] uppercase">
                    {t.tableName || "System"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {audioList.map((t) => (
            <div key={t.id} className={`border rounded-lg p-4 ${!t.isAudioGenerated ? 'bg-orange-50' : 'bg-gray-50'}`}>
               <p className="text-xs font-bold text-gray-400 mb-2">{t.tableName}</p>
               <p className="text-sm bg-white p-2 rounded border border-gray-200 mb-3 italic">"{t.content}"</p>
               <AudioActionCell 
                item={t} 
                onCopy={() => {
                  if(t.audioMultiMediaKey) {
                    navigator.clipboard.writeText(t.audioMultiMediaKey);
                    notifySuccess("Key Copied!");
                  }
                }} 
                onDelete={deleteAudio} 
                getAudioUrl={getAudioUrl} 
                isMobile={true} 
               />
            </div>
          ))}
        </div>

        {audioList.length === 0 && (
          <div className="text-center py-20 text-gray-400 italic">No records found.</div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function AudioActionCell({ item, onCopy, onDelete, getAudioUrl, isMobile = false }) {
  return (
    <div className={`flex flex-col gap-2 ${!isMobile ? 'items-center' : ''}`}>
      {item.isAudioGenerated ? (
        <audio src={getAudioUrl(item.audioMultiMediaKey)} controls className="h-7 w-full max-w-[170px] accent-black" />
      ) : (
        <div className="flex items-center justify-center gap-2 text-orange-600 py-1 font-black animate-pulse">
          <RiLoader4Line className="animate-spin" size={16} />
          <span className="text-[9px] uppercase tracking-widest">Generating...</span>
        </div>
      )}
      <div className="flex gap-4">
        {/* Updated Button Label and Logic */}
        <button 
          onClick={onCopy} 
          disabled={!item.isAudioGenerated}
          className={`text-[9px] font-bold uppercase tracking-tighter ${item.isAudioGenerated ? 'text-blue-600 hover:underline' : 'text-gray-300 cursor-not-allowed'}`}
        >
          Copy Key
        </button>
        <button onClick={() => onDelete(item.id)} className="text-[9px] text-red-600 font-bold hover:underline uppercase tracking-tighter">Delete</button>
      </div>
    </div>
  );
}