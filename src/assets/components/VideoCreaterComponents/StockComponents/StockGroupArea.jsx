import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdCheckCircle, 
  MdBlock, MdClose, MdToggleOn, MdToggleOff, MdFolder, MdInfo 
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import StockContext from "../../../contexts/VideoCreater/Stock/StockContext";

export default function StockGroupArea({ onBack }) {
  const { groups, fetchGroups, addGroup, updateGroup, deleteGroup, toggleGroupActive } = useContext(StockContext);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", active: true });

  const reset = () => { setEditingId(null); setFormData({ name: "", description: "", active: true }); };

  const handleSubmit = async () => {
    if (!formData.name) return;
    const success = editingId ? await updateGroup(editingId, formData) : await addGroup(formData);
    if (success) reset();
  };

  const startEdit = (g) => { 
    setEditingId(g.id); 
    setFormData({ name: g.name, description: g.description, active: g.active }); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8 border-b pb-5">
        <button onClick={onBack} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white text-[10px] font-black transition-all uppercase tracking-widest shadow-sm">
          <MdArrowBack size={16} /> BACK
        </button>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Stock Groups</h2>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Asset Taxonomy</span>
          </div>
          <button onClick={() => fetchGroups()} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all border border-slate-100">
            <MdRefresh size={22} />
          </button>
        </div>
      </div>

      {/* CREATION/EDIT BOX */}
      <div className={`mb-10 p-6 rounded-2xl border-2 transition-all shadow-sm ${editingId ? 'border-blue-400 bg-blue-50/20' : 'bg-slate-50 border-slate-200 border-dashed'}`}>
        <div className="flex items-center gap-2 mb-4">
            <MdFolder className={editingId ? "text-blue-500" : "text-slate-400"} size={20}/>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">
                {editingId ? "Update Taxonomy Parameters" : "Define New Asset Group"}
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Group Identifier</label>
            <input type="text" placeholder="e.g. MEGA_CAP_TECH" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-slate-800 transition-all bg-white"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Strategic Description</label>
            <input type="text" placeholder="Contextual notes..." className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-slate-800 transition-all bg-white"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase ml-1 text-center block">Visibility</label>
            <div className="flex items-center justify-center gap-3 bg-white rounded-xl border-2 py-1.5 px-3 h-[42px]">
                <button onClick={() => setFormData({...formData, active: !formData.active})} className="transition-transform active:scale-90">
                    {formData.active ? <MdToggleOn className="text-emerald-500" size={34}/> : <MdToggleOff className="text-slate-300" size={34}/>}
                </button>
                <span className={`text-[9px] font-black uppercase ${formData.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {formData.active ? 'Active' : 'Muted'}
                </span>
            </div>
          </div>

          <div className="md:col-span-2 flex items-end gap-2">
              <button onClick={handleSubmit} className={`flex-1 h-[42px] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${editingId ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
                  {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button onClick={reset} className="bg-rose-50 text-rose-500 h-[42px] px-3 rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">
                    <MdClose size={20}/>
                </button>
              )}
          </div>
        </div>
      </div>

      {/* DATA REPOSITORY */}
      <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-[10px] font-black uppercase text-slate-400 bg-slate-50/50 tracking-wider">
              <th className="py-4 px-6 text-center w-24">Status</th>
              <th className="py-4 px-4 text-left">Identity & Context</th>
              <th className="py-4 px-6 text-right w-32">Utility</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
                {groups.map((g, idx) => (
                <motion.tr 
                    layout
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    key={g.id} 
                    className={`group border-b border-slate-50 last:border-0 hover:bg-emerald-50/30 transition-colors ${editingId === g.id ? 'bg-blue-50/50' : ''}`}
                >
                    <td className="py-4 px-6 text-center">
                    <button 
                        onClick={() => toggleGroupActive(g.id, !g.active)}
                        className={`transition-all transform hover:scale-110 ${g.active ? 'text-emerald-500' : 'text-slate-200'}`}
                    >
                        {g.active ? <MdCheckCircle size={24}/> : <MdBlock size={24}/>}
                    </button>
                    </td>
                    <td className="py-4 px-4 text-left">
                        <div className="flex flex-col">
                            <span className="font-black text-slate-700 uppercase text-xs tracking-tight mb-0.5">{g.name}</span>
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <MdInfo size={12} className="shrink-0"/>
                                <span className="text-[9px] font-bold uppercase tracking-tight truncate max-w-[300px]">{g.description || "No supplemental details provided"}</span>
                            </div>
                        </div>
                    </td>
                    <td className="py-4 px-6">
                    <div className="flex justify-end items-center gap-2">
                        <button onClick={() => startEdit(g)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-sky-500 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all shadow-sm">
                            <MdEdit size={16}/>
                        </button>
                        <button onClick={() => deleteGroup(g.id)} className="p-2.5 text-slate-300 hover:text-rose-500 transition-colors">
                            <MdDelete size={18}/>
                        </button>
                    </div>
                    </td>
                </motion.tr>
                ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {groups.length === 0 && (
          <div className="py-20 text-center text-slate-300">
              <MdFolder size={48} className="mx-auto mb-2 opacity-20"/>
              <p className="text-[10px] font-black uppercase tracking-[3px]">Repository Empty</p>
          </div>
      )}
    </motion.div>
  );
}