import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdCheckCircle, 
  MdBlock, MdClose, MdToggleOn, MdToggleOff, MdFolder, 
  MdInfo, MdAdd, MdLayers, MdFingerprint, MdContentCopy 
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import StockContext from "../../../contexts/VideoCreater/Stock/StockContext";

export default function StockGroupArea({ onBack }) {
  const { groups, fetchGroups, addGroup, updateGroup, deleteGroup, toggleGroupActive } = useContext(StockContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = { name: "", description: "", active: true };
  const [formData, setFormData] = useState(initialForm);

  // STANDARDIZED RESET LOGIC
  const resetForm = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    const success = editingId ? await updateGroup(editingId, formData) : await addGroup(formData);
    if (success) resetForm();
  };

  // STATE FLUSH TECHNIQUE
  const startEdit = (g) => { 
    resetForm(); 
    setTimeout(() => {
      setEditingId(g.id); 
      setFormData({ name: g.name, description: g.description, active: g.active }); 
      setIsModalOpen(true);
    }, 10);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition text-slate-600">
            <MdArrowBack size={20} />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Stock Groups</h2>
            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest leading-none">Asset Taxonomy & Classification</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => fetchGroups()} className="flex-1 sm:flex-none bg-white p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition shadow-sm">
            <MdRefresh size={20} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-3 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
          >
            <MdAdd size={18} /> Create New Group
          </button>
        </div>
      </div>

      {/* REPOSITORY GRID (CARD VIEW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g) => (
          <motion.div layout key={g.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${g.active ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[180px]">
                <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate">{g.name}</h4>
                <div className="flex items-center gap-1.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${g.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                     {g.active ? 'Operational' : 'Deactivated'}
                   </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(g)} className="p-2 text-slate-300 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"><MdEdit size={16} /></button>
                <button onClick={() => deleteGroup(g.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"><MdDelete size={16} /></button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[44px]">
                <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-tight uppercase">
                  {g.description || "NO SUPPLEMENTAL CONTEXT PROVIDED"}
                </p>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                 <button 
                  onClick={() => toggleGroupActive(g.id, !g.active)}
                  className={`text-[8px] font-black px-3 py-1.5 rounded-full transition-all uppercase ${g.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}
                 >
                   {g.active ? 'Mute Group' : 'Activate'}
                 </button>
                 
                 <div className="flex gap-1 items-center">
                    <button 
                      onClick={() => copyToClipboard(g.id)}
                      className="flex items-center gap-1 text-[8px] bg-slate-50 text-slate-400 px-2 py-1 rounded-full font-black uppercase tracking-tighter hover:bg-slate-900 hover:text-white transition"
                    >
                      <MdFingerprint size={10}/> {g.id.slice(0,8)}
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* COMPOSITION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-white shadow-lg"><MdFolder size={20} /></div>
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
                    {editingId ? "Update Taxonomy" : "New Asset Group"}
                  </h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Group Identifier</label>
                  <input type="text" placeholder="e.g. CRYPTO_VOLATILITY_ASSETS" className="w-full border-2 rounded-full px-5 py-3 text-xs font-black outline-none focus:border-slate-800 transition uppercase" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Strategic Description</label>
                  <textarea placeholder="Purpose and context of this classification..." className="w-full border-2 rounded-3xl px-5 py-4 text-xs font-bold h-24 resize-none outline-none focus:border-slate-800 transition bg-slate-50/30" 
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 uppercase">Operational Status</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">Determines visibility in composition menus</p>
                  </div>
                  <button onClick={() => setFormData({...formData, active: !formData.active})} className="transition-transform active:scale-90">
                    {formData.active ? <MdToggleOn className="text-emerald-500" size={44}/> : <MdToggleOff className="text-slate-300" size={44}/>}
                  </button>
                </div>
              </div>

              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-4 rounded-full text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition tracking-[2px]">Discard</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={!formData.name}
                  className={`flex-[2] py-4 rounded-full text-[10px] font-black uppercase tracking-[2px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-slate-900 text-white hover:bg-black'} disabled:bg-slate-100 disabled:text-slate-300`}
                >
                    <MdCheckCircle size={18}/> {editingId ? "Update Taxonomy" : "Deploy Group"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EMPTY STATE */}
      {groups.length === 0 && (
        <div className="py-20 text-center">
            <MdFolder size={48} className="mx-auto mb-4 text-slate-200"/>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">Taxonomy Repository Empty</p>
        </div>
      )}
    </div>
  );
}