import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdCloudUpload, MdDelete, 
  MdContentCopy, MdVisibility, MdAutoDelete, 
  MdToggleOn, MdToggleOff, MdInsertDriveFile, MdHistory 
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import MultiMediaContext from "../../../contexts/VideoCreater/MultiMedia/MultiMediaContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function MultiMediaArea({ onBack }) {
  const { mediaList, todayMedia, fetchMedia, uploadMedia, deleteMedia } = useContext(MultiMediaContext);
  const { notifySuccess } = useContext(NotificationContext);
  
  const [file, setFile] = useState(null);
  const [viewMode, setViewMode] = useState("all");
  const [formData, setFormData] = useState({
    name: "", 
    description: "", 
    folder1: "NEWS", 
    folder2: "ASSETS", 
    autoDelete: false
  });

  const handleUpload = async () => {
    if (!file || !formData.name) return;
    const data = new FormData();
    data.append("file", file);
    
    // Normalize name for database consistency
    const finalName = formData.name.toLowerCase().trim();
    
    data.append("name", finalName);
    data.append("description", formData.description);
    data.append("folder1", formData.folder1);
    data.append("folder2", formData.folder2);
    data.append("autoDelete", formData.autoDelete);

    const success = await uploadMedia(data);
    if (success) {
      setFile(null);
      setFormData({ ...formData, name: "", description: "" });
      // Reset the file input element manually
      document.getElementById('file-upload').value = "";
    }
  };

  const listToDisplay = viewMode === "all" ? mediaList : todayMedia;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="bg-gray-100 p-2.5 rounded-lg hover:bg-gray-200 transition active:scale-90">
            <MdArrowBack size={20}/>
          </button>
          <div>
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-tight">Multimedia Vault</h2>
            <div className="flex gap-1 mt-1.5">
              <button 
                onClick={() => setViewMode("all")} 
                className={`text-[9px] font-black px-3 py-1 rounded-full transition-all flex items-center gap-1 ${viewMode === 'all' ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
              >
                <MdInsertDriveFile size={10}/> DATABASE
              </button>
              <button 
                onClick={() => setViewMode("today")} 
                className={`text-[9px] font-black px-3 py-1 rounded-full transition-all flex items-center gap-1 ${viewMode === 'today' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
              >
                <MdHistory size={10}/> RECENT
              </button>
            </div>
          </div>
        </div>
        <button onClick={() => fetchMedia()} className="text-gray-400 hover:text-black transition-transform active:rotate-180 duration-500 p-2 bg-slate-50 rounded-full">
          <MdRefresh size={22}/>
        </button>
      </div>

      {/* UPLOAD PANEL */}
      <div className="mb-8 p-6 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
        <div className="space-y-3">
          <div>
            <label className="text-[8px] font-black text-gray-400 uppercase ml-1">Asset Reference Name</label>
            <input type="text" placeholder="e.g. background_loop" className="w-full border-2 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-black transition"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="flex items-center justify-between bg-white border-2 rounded-lg px-3 py-1.5 shadow-sm">
              <span className="text-[9px] font-black text-gray-400 flex items-center gap-1"><MdAutoDelete size={14}/> AUTO-DELETE</span>
              <button onClick={() => setFormData({...formData, autoDelete: !formData.autoDelete})} className="transition-transform active:scale-110">
                  {formData.autoDelete ? <MdToggleOn className="text-blue-500" size={32}/> : <MdToggleOff className="text-gray-300" size={32}/>}
              </button>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-3">
            <div>
              <label className="text-[8px] font-black text-gray-400 uppercase ml-1">Select File</label>
              <input id="file-upload" type="file" className="text-[10px] w-full border-2 border-white bg-white rounded-lg file:bg-gray-800 file:text-white file:border-none file:rounded file:px-3 file:py-1.5 file:mr-3 file:font-black file:uppercase file:cursor-pointer" 
                onChange={e => setFile(e.target.files[0])} />
            </div>
            <div>
              <label className="text-[8px] font-black text-gray-400 uppercase ml-1">Description / Tags</label>
              <input type="text" placeholder="Internal notes about this file..." className="w-full border-2 rounded-lg px-3 py-2 text-xs bg-white outline-none focus:border-black transition"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
        </div>

        <button onClick={handleUpload} disabled={!file || !formData.name} className="md:mt-4 h-[84px] w-full bg-black text-white rounded-xl flex flex-col items-center justify-center hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed">
          <MdCloudUpload size={24} />
          <span className="text-[10px] font-black uppercase mt-2 tracking-widest">Push to Cloud</span>
        </button>
      </div>

      {/* COMPACT TABLE SECTION */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-[10px] font-black uppercase text-gray-400 border-b bg-gray-50/50">
              <th className="py-4 px-4 text-left">Asset Profile</th>
              <th className="py-4 text-left">Internal Key (UUID)</th>
              <th className="py-4 text-center">Lifecycle</th>
              <th className="py-4 px-4 text-right">Utility</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {listToDisplay.length > 0 ? (
                listToDisplay.map((m) => (
                  <motion.tr 
                    key={m.key} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    className="hover:bg-slate-50/80 border-b last:border-0 border-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-800 uppercase text-xs leading-none mb-1">
                          {m.name.toLowerCase()}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold truncate max-w-[150px]">
                          {m.description || "System Managed Asset"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 group">
                         <div className="bg-blue-50 px-2 py-1.5 rounded-md border border-blue-100 transition-colors group-hover:bg-blue-100">
                           <span className="text-[10px] text-blue-700 font-mono font-bold tracking-tight">
                              {m.key} 
                           </span>
                         </div>
                         <button 
                           onClick={() => {navigator.clipboard.writeText(m.key); notifySuccess("UUID Copied to Clipboard");}} 
                           className="text-blue-300 hover:text-blue-600 transition-colors p-1.5 hover:bg-white rounded-md shadow-sm"
                           title="Copy UUID"
                         >
                            <MdContentCopy size={14}/>
                          </button>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      {m.autoDelete ? (
                          <div className="inline-flex items-center px-2 py-1 rounded bg-orange-50 text-orange-600 border border-orange-100">
                            <MdAutoDelete size={14} />
                            <span className="text-[8px] font-black ml-1 uppercase">Ephemeral</span>
                          </div>
                      ) : (
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded border border-gray-100">Persistent</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a href={`${m.url}`} target="_blank" rel="noreferrer" title="Open in New Tab" className="bg-white p-2 rounded-lg text-gray-400 hover:text-black border border-gray-100 shadow-sm transition-all hover:shadow-md">
                          <MdVisibility size={16}/>
                        </a>
                        <button onClick={() => deleteMedia(m.key)} title="Purge Asset" className="bg-white p-2 rounded-lg text-gray-200 hover:text-rose-500 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                          <MdDelete size={16}/>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <MdInsertDriveFile size={48} />
                      <span className="text-xs font-black uppercase mt-2 tracking-widest">Vault is empty</span>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}