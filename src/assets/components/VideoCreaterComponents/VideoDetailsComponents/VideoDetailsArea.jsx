import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdClose, 
  MdLink, MdTitle, MdOutlineSubtitles, MdBarChart, MdFingerprint 
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import VideoContext from "../../../contexts/VideoCreater/Videos/VideoContext";
import VideoDetailsContext from "../../../contexts/VideoCreater/VideoDetails/VideoDetailsContext";
import NotificationContext from "../../../contexts/Notification/NotificationContext";

export default function VideoDetailsArea({ onBack }) {
  const { videoList } = useContext(VideoContext);
  const { detailsList, fetchAllDetails, createDetails, updateDetails, deleteDetails } = useContext(VideoDetailsContext);
  const { notifySuccess } = useContext(NotificationContext);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    videoId: "",
    introHeader: "",
    introSubHeader: "",
    header: "",
    outroHeader: "",
    outroSubHeader: "",
    isbarGraphJsonMultiMediaKeyUploaded: false,
    barGraphJsonMultiMediaKey: ""
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      videoId: "", introHeader: "", introSubHeader: "",
      header: "", outroHeader: "", outroSubHeader: "",
      isbarGraphJsonMultiMediaKeyUploaded: false,
      barGraphJsonMultiMediaKey: ""
    });
  };

  const handleAction = async () => {
    if (!formData.videoId) return;
    const success = editingId 
      ? await updateDetails(editingId, formData) 
      : await createDetails(formData);
    if (success) resetForm();
  };

  const startEdit = (detail) => {
    setEditingId(detail.id);
    setFormData({ ...detail });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <button onClick={onBack} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 text-[10px] font-black transition uppercase tracking-widest shadow-sm">
            <MdArrowBack size={18} /> BACK
          </button>
          <div className="flex items-center gap-4 text-right">
            <button onClick={() => fetchAllDetails()} className="text-slate-400 hover:text-sky-600 transition-all hover:rotate-180 duration-500">
              <MdRefresh size={22} />
            </button>
            <div>
              <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Video Details Manager</h2>
              <span className="text-[10px] text-sky-500 font-bold uppercase tracking-[2px]">Content Metadata Configuration</span>
            </div>
          </div>
        </div>

        {/* METADATA EDITOR */}
        <div className={`mb-8 p-6 border-2 rounded-2xl transition-all shadow-sm ${editingId ? 'border-sky-400 bg-sky-50/20' : 'border-slate-100 bg-slate-50/50 border-dashed'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] flex items-center gap-2">
              <MdTitle className={editingId ? "text-sky-500" : ""} size={18}/>
              {editingId ? "Modify Content Metadata" : "Initialize New Metadata Layer"}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="bg-white border px-3 py-1 rounded-full text-rose-500 flex items-center gap-1 text-[9px] font-black hover:bg-rose-50 transition uppercase shadow-sm">
                <MdClose /> Discard Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CORE ASSIGNMENT */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdLink/> Target Video Assignment</label>
                <select className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-bold bg-white focus:border-sky-500 outline-none transition-all shadow-sm" 
                  value={formData.videoId} onChange={e => setFormData({...formData, videoId: e.target.value})}>
                  <option value="">Choose Project...</option>
                  {videoList.map(v => <option key={v.id} value={v.id}>{v.name.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Hero Title (Main Header)</label>
                <input type="text" placeholder="Visual Heading..." className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-sky-500 bg-white transition-all shadow-sm" 
                  value={formData.header} onChange={e => setFormData({...formData, header: e.target.value})} />
              </div>
            </div>

            {/* BRANDING WRAPPERS */}
            <div className="space-y-4 p-4 bg-white rounded-2xl border-2 border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1 mb-2"><MdOutlineSubtitles/> Segment Overlays</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <input type="text" placeholder="Intro Title" className="w-full border-b-2 py-2 text-[10px] font-bold outline-none focus:border-indigo-400" 
                    value={formData.introHeader} onChange={e => setFormData({...formData, introHeader: e.target.value})} />
                  <input type="text" placeholder="Intro Sub" className="w-full border-b-2 py-2 text-[10px] outline-none focus:border-indigo-400" 
                    value={formData.introSubHeader} onChange={e => setFormData({...formData, introSubHeader: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <input type="text" placeholder="Outro Title" className="w-full border-b-2 py-2 text-[10px] font-bold outline-none focus:border-purple-400" 
                    value={formData.outroHeader} onChange={e => setFormData({...formData, outroHeader: e.target.value})} />
                  <input type="text" placeholder="Outro Sub" className="w-full border-b-2 py-2 text-[10px] outline-none focus:border-purple-400" 
                    value={formData.outroSubHeader} onChange={e => setFormData({...formData, outroSubHeader: e.target.value})} />
                </div>
              </div>
            </div>

            {/* DATA ASSETS */}
            <div className="flex flex-col gap-4">
              <div className="p-4 border-2 rounded-2xl bg-white space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><MdBarChart/> Dynamic Graph</span>
                  <input type="checkbox" className="w-4 h-4 accent-sky-500" checked={formData.isbarGraphJsonMultiMediaKeyUploaded} 
                    onChange={e => setFormData({...formData, isbarGraphJsonMultiMediaKeyUploaded: e.target.checked})} />
                </div>
                <input type="text" placeholder="JSON Multimedia UUID" className={`w-full border-2 rounded-xl px-3 py-2 text-[10px] font-mono transition-opacity ${!formData.isbarGraphJsonMultiMediaKeyUploaded && 'opacity-30'}`} 
                  value={formData.barGraphJsonMultiMediaKey || ""} 
                  onChange={e => setFormData({...formData, barGraphJsonMultiMediaKey: e.target.value})} />
              </div>
              <button onClick={handleAction} className={`w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-[3px] transition-all shadow-lg active:scale-95
                ${editingId ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-black text-white hover:bg-slate-800'}`}>
                {editingId ? "Apply Metadata Updates" : "Deploy Metadata Layer"}
              </button>
            </div>
          </div>
        </div>

        {/* REPOSITORY TABLE */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                <th className="px-4 py-4 border-b text-left">Assignment</th>
                <th className="px-4 py-4 border-b text-left">Hero Title</th>
                <th className="px-4 py-4 border-b text-center">Asset Sync</th>
                <th className="px-4 py-4 border-b text-right">Utility</th>
              </tr>
            </thead>
            <tbody>
              {detailsList.map((d) => {
                const video = videoList.find(v => v.id === d.videoId);
                return (
                  <tr key={d.id} className={`transition-colors border-b border-slate-50 last:border-0 ${editingId === d.id ? 'bg-sky-50/50' : 'hover:bg-slate-50/30'}`}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                          <MdFingerprint size={16}/>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-700 uppercase text-xs tracking-tight leading-none mb-1">
                            {video ? video.name : "Unlinked Object"}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono tracking-tighter">{d.videoId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-600 truncate max-w-[200px]">{d.header || "---"}</span>
                        <div className="flex gap-2 mt-1">
                          {d.introHeader && <span className="text-[8px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-black uppercase">Intro</span>}
                          {d.outroHeader && <span className="text-[8px] bg-purple-50 text-purple-500 px-1.5 py-0.5 rounded font-black uppercase">Outro</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                       <div className={`inline-flex items-center gap-1.5 text-[9px] px-3 py-1 rounded-full font-black border ${d.isbarGraphJsonMultiMediaKeyUploaded ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                          <MdBarChart size={14}/>
                          {d.isbarGraphJsonMultiMediaKeyUploaded ? 'DATA LINKED' : 'NO DATA'}
                       </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end items-center gap-2">
                        <button onClick={() => startEdit(d)} className="p-2 text-sky-500 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-sky-100 transition-all"><MdEdit size={18} /></button>
                        <button onClick={() => deleteDetails(d.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><MdDelete size={18} /></button>
                        <button onClick={() => {navigator.clipboard.writeText(d.id); notifySuccess("Reference Key Copied");}} 
                          className="px-2 py-1 text-[8px] font-black text-slate-300 hover:text-slate-600 border border-slate-200 rounded-md transition-all">
                          REF
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