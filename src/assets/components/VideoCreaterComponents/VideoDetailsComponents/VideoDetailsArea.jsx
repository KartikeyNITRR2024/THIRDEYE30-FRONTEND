import { useContext, useState } from "react";
import { MdArrowBack, MdRefresh, MdAdd, MdEdit, MdDelete, MdClose, MdInfoOutline } from "react-icons/md";
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
      videoId: "",
      introHeader: "",
      introSubHeader: "",
      header: "",
      outroHeader: "",
      outroSubHeader: "",
      isbarGraphJsonMultiMediaKeyUploaded: false,
      barGraphJsonMultiMediaKey: ""
    });
  };

  const handleAction = async () => {
    if (!formData.videoId) return;
    if (editingId) {
      const success = await updateDetails(editingId, formData);
      if (success) resetForm();
    } else {
      await createDetails(formData);
      resetForm();
    }
  };

  const startEdit = (detail) => {
    setEditingId(detail.id);
    setFormData({ ...detail });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 shadow-md mt-6 border border-gray-100">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <button onClick={onBack} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-bold transition">
            <MdArrowBack size={18} /> BACK
          </button>
          <div className="flex items-center gap-4 text-right">
            <button onClick={() => fetchAllDetails()} className="text-gray-400 hover:text-black transition">
              <MdRefresh size={22} />
            </button>
            <div>
              <h2 className="text-sm font-black text-gray-700 uppercase">Video Details Manager</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Metadata Configuration</span>
            </div>
          </div>
        </div>

        {/* INPUT FORM */}
        <div className={`mb-8 p-5 border-2 rounded-xl transition-all shadow-sm ${editingId ? 'border-blue-500 bg-blue-50/20' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
              {editingId ? "Edit Metadata Mode" : "New Metadata Entry"}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-red-500 flex items-center gap-1 text-[10px] font-black hover:underline">
                <MdClose /> CANCEL EDIT
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* COLUMN 1: Video & Main Header */}
            <div className="space-y-3">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Target Video</label>
              <select className="w-full border rounded px-3 py-2 text-sm font-bold bg-white" 
                value={formData.videoId} onChange={e => setFormData({...formData, videoId: e.target.value})}>
                <option value="">Select Video...</option>
                {videoList.map(v => <option key={v.id} value={v.id}>{v.name.toUpperCase()}</option>)}
              </select>
              <input type="text" placeholder="Main Header" className="w-full border rounded px-3 py-2 text-sm outline-none" 
                value={formData.header} onChange={e => setFormData({...formData, header: e.target.value})} />
            </div>

            {/* COLUMN 2: Intro/Outro */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Intro Header" className="w-full border rounded px-2 py-2 text-xs" 
                  value={formData.introHeader} onChange={e => setFormData({...formData, introHeader: e.target.value})} />
                <input type="text" placeholder="Intro Sub" className="w-full border rounded px-2 py-2 text-xs" 
                  value={formData.introSubHeader} onChange={e => setFormData({...formData, introSubHeader: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Outro Header" className="w-full border rounded px-2 py-2 text-xs" 
                  value={formData.outroHeader} onChange={e => setFormData({...formData, outroHeader: e.target.value})} />
                <input type="text" placeholder="Outro Sub" className="w-full border rounded px-2 py-2 text-xs" 
                  value={formData.outroSubHeader} onChange={e => setFormData({...formData, outroSubHeader: e.target.value})} />
              </div>
            </div>

            {/* COLUMN 3: Media Key & Button */}
            <div className="flex flex-col gap-3 justify-between">
              <div className="p-3 border rounded-lg bg-white space-y-2 shadow-inner">
                <label className="flex items-center gap-2 cursor-pointer text-[10px] font-black uppercase text-gray-400">
                  <input type="checkbox" checked={formData.isbarGraphJsonMultiMediaKeyUploaded} 
                    onChange={e => setFormData({...formData, isbarGraphJsonMultiMediaKeyUploaded: e.target.checked})} />
                  Graph Uploaded
                </label>
                <input type="text" placeholder="Graph Multimedia UUID" className="w-full border rounded px-2 py-1 text-xs" 
                  value={formData.barGraphJsonMultiMediaKey || ""} 
                  onChange={e => setFormData({...formData, barGraphJsonMultiMediaKey: e.target.value})} />
              </div>
              <button onClick={handleAction} className={`w-full py-3 rounded-lg text-xs font-black uppercase transition shadow-md
                ${editingId ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-black text-white hover:bg-gray-800'}`}>
                {editingId ? "Update Details" : "Save Details"}
              </button>
            </div>
          </div>
        </div>

        {/* LIST TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-center text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-tighter">
                <th className="px-2 py-4 border-b text-left">Target Video</th>
                <th className="px-2 py-4 border-b">Main Header</th>
                <th className="px-2 py-4 border-b">Graph Status</th>
                <th className="px-2 py-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {detailsList.map((d) => {
                const video = videoList.find(v => v.id === d.videoId);
                return (
                  <tr key={d.id} className={`${editingId === d.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-2 py-4 border-b border-gray-50 text-left">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 uppercase tracking-tighter leading-tight">
                          {video ? video.name : "Unknown Video"}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono italic truncate max-w-[150px]">{d.videoId}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4 border-b border-gray-50 font-medium text-gray-600">
                      {d.header || "---"}
                    </td>
                    <td className="px-2 py-4 border-b border-gray-50">
                       <span className={`text-[9px] px-2 py-0.5 rounded font-black border ${d.isbarGraphJsonMultiMediaKeyUploaded ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                          {d.isbarGraphJsonMultiMediaKeyUploaded ? 'GRAPH ACTIVE' : 'NO GRAPH'}
                       </span>
                    </td>
                    <td className="px-2 py-4 border-b border-gray-50">
                      <div className="flex justify-center items-center gap-4">
                        <button onClick={() => startEdit(d)} className="text-blue-500 hover:text-blue-700 transition"><MdEdit size={18} /></button>
                        <button onClick={() => deleteDetails(d.id)} className="text-gray-200 hover:text-red-500 transition"><MdDelete size={18} /></button>
                        <button onClick={() => {navigator.clipboard.writeText(d.id); notifySuccess("ID Copied");}} className="text-[9px] font-black text-gray-300 hover:text-black">ID</button>
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