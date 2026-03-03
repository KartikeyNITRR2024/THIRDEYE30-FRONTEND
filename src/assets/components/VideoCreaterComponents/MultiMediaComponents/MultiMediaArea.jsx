import { useContext, useState } from "react";
import { MdArrowBack, MdRefresh, MdCloudUpload, MdDelete, MdContentCopy, MdVisibility, MdAutoDelete, MdToggleOn, MdToggleOff } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import MultiMediaContext from "../../../contexts/VideoCreater/MultiMedia/MultiMediaContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function MultiMediaArea({ onBack }) {
  const { mediaList, todayMedia, fetchMedia, uploadMedia, deleteMedia } = useContext(MultiMediaContext);
  const { notifySuccess } = useContext(NotificationContext);
  
  const [file, setFile] = useState(null);
  const [viewMode, setViewMode] = useState("all");
  const [formData, setFormData] = useState({
    name: "", description: "", folder1: "NEWS", folder2: "ASSETS", autoDelete: false
  });

  const handleUpload = async () => {
    if (!file || !formData.name) return;
    const data = new FormData();
    data.append("file", file);
    
    const finalName = formData.name.toLowerCase();
    
    data.append("name", finalName);
    data.append("description", formData.description);
    data.append("folder1", formData.folder1);
    data.append("folder2", formData.folder2);
    data.append("autoDelete", formData.autoDelete);

    if (await uploadMedia(data)) {
      setFile(null);
      setFormData({ ...formData, name: "", description: "" });
    }
  };

  const listToDisplay = viewMode === "all" ? mediaList : todayMedia;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 shadow-md mt-6 border border-gray-100">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition"><MdArrowBack/></button>
          <div>
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-tight">Multimedia Vault</h2>
            <div className="flex gap-2 mt-1">
              <button onClick={() => setViewMode("all")} className={`text-[9px] font-black px-2 py-0.5 rounded ${viewMode === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>DATABASE</button>
              <button onClick={() => setViewMode("today")} className={`text-[9px] font-black px-2 py-0.5 rounded ${viewMode === 'today' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>TODAY</button>
            </div>
          </div>
        </div>
        <button onClick={() => fetchMedia()} className="text-gray-400 hover:text-black transition-all"><MdRefresh size={22}/></button>
      </div>

      {/* UPLOAD PANEL */}
      <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="space-y-2">
          <input type="text" placeholder="File Name (e.g. StockData)" className="w-full border rounded px-3 py-2 text-xs font-bold"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <div className="flex items-center justify-between bg-white border rounded px-3 py-1">
                <span className="text-[9px] font-black text-gray-400 flex items-center gap-1"><MdAutoDelete/> AUTO-DELETE</span>
                <button onClick={() => setFormData({...formData, autoDelete: !formData.autoDelete})}>
                    {formData.autoDelete ? <MdToggleOn className="text-blue-500" size={28}/> : <MdToggleOff className="text-gray-300" size={28}/>}
                </button>
            </div>
        </div>
        
        <div className="md:col-span-2 space-y-2">
            <input type="file" className="text-[10px] w-full file:bg-gray-200 file:border-none file:rounded file:px-2 file:py-1 file:font-bold" onChange={e => setFile(e.target.files[0])} />
            <input type="text" placeholder="Short Description" className="w-full border rounded px-3 py-2 text-xs bg-white"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <button onClick={handleUpload} className="h-full bg-black text-white rounded-lg flex flex-col items-center justify-center hover:bg-gray-800 transition py-3">
          <MdCloudUpload size={22} />
          <span className="text-[9px] font-black uppercase mt-1">Upload Document</span>
        </button>
      </div>

      {/* COMPACT TABLE SECTION */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-black uppercase text-gray-400 border-b">
              <th className="py-3 text-left">Asset Name</th>
              <th className="py-3 text-left">UUID / Key</th>
              <th className="py-3 text-center">Auto Delete</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {listToDisplay.map((m) => (
                <motion.tr key={m.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 uppercase text-xs">
                        {m.name.toLowerCase()}
                      </span>
                      <span className="text-[9px] text-gray-400 italic">{m.description || "No description"}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 bg-blue-50 w-fit px-2 py-1 rounded">
                       <span className="text-[10px] text-blue-600 font-mono font-bold tracking-tighter">
                          {m.key} 
                       </span>
                       <button onClick={() => {navigator.clipboard.writeText(m.key); notifySuccess("UUID Copied");}} className="text-blue-300 hover:text-blue-700">
                            <MdContentCopy size={12}/>
                        </button>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    {m.autoDelete ? (
                        <div className="flex items-center justify-center text-orange-500">
                          <MdAutoDelete size={18} />
                          <span className="text-[8px] font-black ml-1">ACTIVE</span>
                        </div>
                    ) : (
                      <span className="text-[8px] font-black text-gray-300 uppercase">Disabled</span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={`${m.url}`} target="_blank" rel="noreferrer" title="View" className="bg-gray-100 p-2 rounded text-gray-600 hover:bg-black hover:text-white transition">
                        <MdVisibility size={16}/>
                      </a>
                      <button onClick={() => deleteMedia(m.key)} title="Delete" className="bg-red-50 p-2 rounded text-red-300 hover:text-red-600 transition">
                        <MdDelete size={16}/>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}