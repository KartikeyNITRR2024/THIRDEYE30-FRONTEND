import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdCloudUpload, MdDelete, 
  MdContentCopy, MdVisibility, MdAutoDelete, 
  MdToggleOn, MdToggleOff, MdAccessTime, MdAdd, 
  MdClose, MdHistory, MdFolder, MdInfoOutline
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import MultiMediaContext from "../../../contexts/VideoCreater/MultiMedia/MultiMediaContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function MultiMediaArea({ onBack }) {
  const { mediaList, todayMedia, fetchMedia, uploadMedia, deleteMedia } = useContext(MultiMediaContext);
  const { notifySuccess } = useContext(NotificationContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [viewMode, setViewMode] = useState("all");
  const [formData, setFormData] = useState({
    name: "", description: "", folder1: "", folder2: "", autoDelete: false
  });

  const resetForm = () => {
    setFile(null);
    setFormData({ name: "", description: "", folder1: "", folder2: "", autoDelete: false });
    setIsModalOpen(false);
  };

  const handleUpload = async () => {
    if (!file || !formData.name) return;
    const data = new FormData();
    data.append("file", file);
    data.append("name", formData.name.toLowerCase().trim());
    data.append("description", formData.description);
    data.append("folder1", formData.folder1.toUpperCase().trim());
    data.append("folder2", formData.folder2.toUpperCase().trim());
    data.append("autoDelete", formData.autoDelete);

    const success = await uploadMedia(data);
    if (success) resetForm();
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const listToDisplay = viewMode === "all" ? mediaList : todayMedia;

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div>
                <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Multimedia Vault</h2>
                <div className="flex gap-1.5">
                  <button onClick={() => setViewMode("all")} className={`text-[8px] font-black px-2 py-0.5 rounded border transition-all ${viewMode === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200'}`}>DATABASE</button>
                  <button onClick={() => setViewMode("today")} className={`text-[8px] font-black px-2 py-0.5 rounded border transition-all ${viewMode === 'today' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-400 border-slate-200'}`}>RECENT</button>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={() => fetchMedia()} className="flex-1 sm:flex-none bg-white p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition shadow-sm">
                <MdRefresh size={20} />
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-3 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
            >
                <MdAdd size={18} /> Ingest Asset
            </button>
        </div>
      </div>

      {/* ASSET GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listToDisplay.map((m) => (
          <motion.div layout key={m.key} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${m.autoDelete ? 'bg-amber-400' : 'bg-slate-800'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[160px] overflow-hidden">
                  <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate">{m.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {m.folder1 && <span className="text-[7px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">{m.folder1}</span>}
                    {m.folder2 && <span className="text-[7px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">{m.folder2}</span>}
                    <span className="text-[7px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">{m.multiMediaType}</span>
                  </div>
              </div>
              <div className="flex gap-1">
                  <button onClick={() => {navigator.clipboard.writeText(m.key); notifySuccess("UUID Copied");}} className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"><MdContentCopy size={16} /></button>
                  <a href={m.url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"><MdVisibility size={18} /></a>
                  <button onClick={() => deleteMedia(m.key)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"><MdDelete size={18} /></button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-bold uppercase tracking-tighter">Payload Size</span>
                  <span className="text-slate-800 font-black uppercase">{formatSize(m.size)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 py-1">
                  <div className="flex flex-col">
                      <span className="text-[7px] text-slate-400 font-black uppercase flex items-center gap-1"><MdCloudUpload size={10}/> Created</span>
                      <span className="text-[9px] text-slate-700 font-bold uppercase">{new Date(m.timeOfUpload).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col border-l border-slate-100 pl-2">
                      <span className="text-[7px] text-slate-400 font-black uppercase flex items-center gap-1"><MdHistory size={10}/> Last Active</span>
                      <span className="text-[9px] text-slate-700 font-bold uppercase">{m.lastUsed ? new Date(m.lastUsed).toLocaleDateString() : 'NEVER'}</span>
                  </div>
              </div>

              {m.description && (
                <div className="bg-slate-50 p-2 rounded-lg flex items-start gap-2 border border-slate-100">
                    <MdInfoOutline size={12} className="text-slate-400 shrink-0 mt-0.5"/>
                    <p className="text-[9px] text-slate-500 font-bold leading-tight line-clamp-2 uppercase italic">{m.description}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* UPLOAD MODAL - UPDATED WITH TEXT INPUTS FOR FOLDERS */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-white"><MdCloudUpload size={20} /></div>
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Multimedia Ingestion</h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Asset Key (Name)</label>
                        <input type="text" placeholder="e.g. background_v1" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800 transition" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Source File</label>
                        <input id="file-upload" type="file" className="text-[10px] w-full border-2 border-slate-50 bg-slate-50 rounded-xl file:bg-slate-900 file:text-white file:border-none file:rounded-lg file:px-4 file:py-2 file:mr-4 file:font-black file:uppercase file:cursor-pointer transition" 
                        onChange={e => setFile(e.target.files[0])} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdFolder/> Folder 1 (Root)</label>
                        <input type="text" placeholder="e.g. NEWS" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800 transition" 
                        value={formData.folder1} onChange={e => setFormData({...formData, folder1: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdFolder/> Folder 2 (Sub)</label>
                        <input type="text" placeholder="e.g. ASSETS" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800 transition" 
                        value={formData.folder2} onChange={e => setFormData({...formData, folder2: e.target.value})} />
                    </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase">Auto-Delete Mode</span>
                        <span className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter">Ephemeral lifecycle</span>
                    </div>
                    <button onClick={() => setFormData({...formData, autoDelete: !formData.autoDelete})}>
                        {formData.autoDelete ? <MdToggleOn size={36} className="text-blue-600"/> : <MdToggleOff size={36} className="text-slate-300"/>}
                    </button>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Description</label>
                    <textarea placeholder="Asset purpose..." className="w-full border-2 rounded-xl px-4 py-2 text-xs h-16 resize-none outline-none focus:border-slate-800" 
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>

              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleUpload} disabled={!file || !formData.name} className="flex-[2] bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[2px] shadow-lg active:scale-95 disabled:bg-slate-100 disabled:text-slate-300">
                    Push to Production
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}