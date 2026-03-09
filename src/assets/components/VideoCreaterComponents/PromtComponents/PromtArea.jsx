import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdDelete, MdEdit, MdClose, 
  MdAdd, MdTerminal, MdHistory, MdContentCopy 
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import PromptContext from "../../../contexts/VideoCreater/Prompt/PromptContext";

export default function PromptArea({ onBack }) {
  const { promptList, fetchPrompts, addPrompt, updatePrompt, deletePrompt, getFullPrompt } = useContext(PromptContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", prompt: "", typeOfVideo: "NEWS_GENERATER"
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", prompt: "", typeOfVideo: "NEWS_GENERATER" });
    setIsModalOpen(false);
  };

  /**
   * COPY TO CLIPBOARD
   * Fetches the full prompt first since it's not in the list DTO
   */
  const handleCopy = async (promptSummary) => {
    const fullDetail = await getFullPrompt(promptSummary.id);
    if (fullDetail && fullDetail.prompt) {
      try {
        await navigator.clipboard.writeText(fullDetail.prompt);
        // Assuming your NotificationContext provides a success notify
        alert("Prompt copied to clipboard!"); 
      } catch (err) {
        console.error("Failed to copy!", err);
      }
    }
  };

  const handleEditClick = async (promptSummary) => {
    const fullDetail = await getFullPrompt(promptSummary.id);
    if (fullDetail) {
      setEditingId(fullDetail.id);
      setFormData({ 
        name: fullDetail.name, 
        prompt: fullDetail.prompt, 
        typeOfVideo: fullDetail.typeOfVideo 
      });
      setIsModalOpen(true);
    }
  };

  const handleAction = async () => {
    if (!formData.name || !formData.prompt) return;
    const success = editingId ? await updatePrompt(editingId, formData) : await addPrompt(formData);
    if (success) resetForm();
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            <MdArrowBack size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-sm font-black uppercase leading-none mb-1">AI Prompt Library</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{promptList.length} STORED PROMPTS</span>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => fetchPrompts()} className="p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition bg-white shadow-sm">
            <MdRefresh size={20} />
          </button>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 text-[10px] font-black transition uppercase tracking-widest shadow-md">
            <MdAdd size={18} /> New Prompt
          </button>
        </div>
      </div>

      {/* PROMPT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promptList.map((p) => (
          <motion.div layout key={p.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate pr-2">{p.name}</h4>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-indigo-50 text-indigo-600">
                        {p.typeOfVideo}
                    </span>
                </div>
              </div>
              <div className="flex gap-1">
                {/* COPY BUTTON */}
                <button 
                  onClick={() => handleCopy(p)} 
                  title="Copy Prompt"
                  className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition"
                >
                  <MdContentCopy size={18} />
                </button>

                <button onClick={() => handleEditClick(p)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition">
                  <MdEdit size={18} />
                </button>
                <button onClick={() => deletePrompt(p.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition">
                  <MdDelete size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                <span className="flex items-center gap-1"><MdHistory /> Last Used:</span>
                <span className="text-slate-800">
                  {p.lastlyUsed ? new Date(p.lastlyUsed).toLocaleDateString() : "NEVER"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white"><MdTerminal size={20} /></div>
                  <h3 className="text-xs font-black uppercase tracking-widest">{editingId ? 'Edit AI Prompt' : 'Create AI Prompt'}</h3>
                </div>
                <button onClick={resetForm} className="text-slate-400 hover:text-rose-500 transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Prompt Name</label>
                        <input type="text" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-600 transition" 
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Finance News Generator" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Video Category</label>
                        <select className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold bg-white outline-none focus:border-indigo-600"
                            value={formData.typeOfVideo} onChange={e => setFormData({...formData, typeOfVideo: e.target.value})}>
                            <option value="NEWS_GENERATER">NEWS_GENERATER</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex justify-between">
                    <span>Prompt Instructions</span>
                    <span className="text-indigo-500 lowercase">Supports dynamic variables</span>
                  </label>
                  <textarea className="w-full border-2 rounded-xl px-4 py-3 text-xs font-medium h-48 resize-none outline-none focus:border-indigo-600 transition leading-relaxed" 
                    value={formData.prompt} onChange={e => setFormData({...formData, prompt: e.target.value})} 
                    placeholder="Act as a news reporter and write a script about..." />
                </div>
              </div>

              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                <button onClick={handleAction} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition">
                  {editingId ? 'Update Prompt Config' : 'Save To Library'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}