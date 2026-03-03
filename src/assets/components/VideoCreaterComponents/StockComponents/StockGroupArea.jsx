import { useContext, useState } from "react";
import { MdArrowBack, MdRefresh, MdEdit, MdDelete, MdCheckCircle, MdBlock, MdClose, MdToggleOn, MdToggleOff } from "react-icons/md";
import { motion } from "framer-motion";
import StockContext from "../../../contexts/VideoCreater/Stock/StockContext";

export default function StockGroupArea({ onBack }) {
  const { groups, fetchGroups, addGroup, updateGroup, deleteGroup, toggleGroupActive } = useContext(StockContext);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", active: true });

  const reset = () => { setEditingId(null); setFormData({ name: "", description: "", active: true }); };

  const handleSubmit = async () => {
    if (!formData.name) return;
    if (editingId) {
      const success = await updateGroup(editingId, formData);
      if (success) reset();
    } else {
      addGroup(formData);
      reset();
    }
  };

  const startEdit = (g) => { setEditingId(g.id); setFormData({ name: g.name, description: g.description, active: g.active }); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 shadow-md mt-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button onClick={onBack} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-xs font-black transition">
          <MdArrowBack size={16} /> BACK
        </button>
        <div className="flex items-center gap-4">
          <button onClick={() => fetchGroups()} className="text-gray-400 hover:text-black"><MdRefresh size={22} /></button>
          <div className="text-right">
            <h2 className="text-sm font-black text-gray-700 uppercase">Stock Groups</h2>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CRUD Controller</span>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 rounded-xl border-2 transition-colors ${editingId ? 'border-blue-200 bg-blue-50/30' : 'bg-gray-50 border-gray-100'}`}>
        <input type="text" placeholder="Group Name" className="border rounded px-3 py-2 text-sm font-bold"
          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="text" placeholder="Description" className="border rounded px-3 py-2 text-sm"
          value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        <div className="flex items-center justify-center gap-2 bg-white rounded border px-3">
            <span className="text-[10px] font-black text-gray-400 uppercase">Status</span>
            <button onClick={() => setFormData({...formData, active: !formData.active})}>
                {formData.active ? <MdToggleOn className="text-green-500" size={30}/> : <MdToggleOff className="text-gray-300" size={30}/>}
            </button>
        </div>
        <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex-1 bg-black text-white rounded-lg text-[10px] font-black uppercase hover:bg-gray-800 transition">
                {editingId ? "Update Group" : "Create Group"}
            </button>
            {editingId && <button onClick={reset} className="bg-red-500 text-white p-2 rounded-lg"><MdClose size={20}/></button>}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase text-gray-400 border-b text-center">
            <th className="py-3">Live</th>
            <th className="py-3 text-left">Identity</th>
            <th className="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(g => (
            <tr key={g.id} className="hover:bg-gray-50 border-b border-gray-50">
              <td className="py-4 text-center">
                <button onClick={() => toggleGroupActive(g.id, !g.active)}>
                  {g.active ? <MdCheckCircle className="text-green-500" size={20}/> : <MdBlock className="text-gray-300" size={20}/>}
                </button>
              </td>
              <td className="py-4 text-left">
                <p className="font-black text-gray-800 uppercase leading-tight">{g.name}</p>
                <p className="text-[9px] text-gray-400 uppercase">{g.description}</p>
              </td>
              <td className="py-4">
                <div className="flex justify-center gap-4">
                    <button onClick={() => startEdit(g)} className="text-blue-500 hover:text-blue-700"><MdEdit size={18}/></button>
                    <button onClick={() => deleteGroup(g.id)} className="text-gray-300 hover:text-red-500"><MdDelete size={18}/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}