import { useContext, useState } from "react";
import { MdArrowBack, MdRefresh, MdEdit, MdDelete, MdTrendingUp, MdClose, MdRadioButtonChecked } from "react-icons/md";
import { motion } from "framer-motion";
import StockContext from "../../../contexts/VideoCreater/Stock/StockContext";

export default function SingleStockArea({ onBack }) {
  const { groups, stocks, addStock, updateStock, deleteStock, toggleStockActive, fetchStocks } = useContext(StockContext);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", marketCode: "", stockName: "", active: true, groupId: "" });

  const reset = () => { setEditingId(null); setFormData({ name: "", marketCode: "", stockName: "", active: true, groupId: "" }); };

  const handleSubmit = async () => {
    if (!formData.groupId) return;
    if (editingId) {
      const success = await updateStock(editingId, formData);
      if (success) reset();
    } else {
      addStock(formData);
      reset();
    }
  };

  const startEdit = (s) => { setEditingId(s.id); setFormData({ ...s }); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 shadow-md mt-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button onClick={onBack} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-xs font-black transition">
          <MdArrowBack size={18} /> BACK
        </button>
        <div className="text-right flex items-center gap-4">
          <button onClick={() => fetchStocks()} className="text-gray-400 hover:text-black"><MdRefresh size={22}/></button>
          <div>
            <h2 className="text-sm font-black text-gray-700 uppercase">Market Tickers</h2>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Asset Manager</span>
          </div>
        </div>
      </div>

      <div className={`mb-8 p-5 border-2 rounded-xl grid grid-cols-1 md:grid-cols-5 gap-3 transition-colors ${editingId ? 'border-orange-200 bg-orange-50/30' : 'bg-gray-50 border-gray-100'}`}>
        <select className="border rounded px-3 py-2 text-xs font-bold bg-white"
          value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})}>
          <option value="">Choose Group...</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name.toUpperCase()}</option>)}
        </select>
        <input type="text" placeholder="Ticker" className="border rounded px-3 py-2 text-xs font-bold uppercase"
          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="text" placeholder="Market Code" className="border rounded px-3 py-2 text-xs uppercase"
          value={formData.marketCode} onChange={e => setFormData({...formData, marketCode: e.target.value})} />
        <input type="text" placeholder="Stock Name" className="border rounded px-3 py-2 text-xs"
          value={formData.stockName} onChange={e => setFormData({...formData, stockName: e.target.value})} />
        <div className="flex gap-1">
          <button onClick={handleSubmit} className={`flex-1 rounded-lg text-[9px] font-black uppercase transition text-white ${editingId ? 'bg-orange-600' : 'bg-black'}`}>
            {editingId ? "Update" : "Add Asset"}
          </button>
          {editingId && <button onClick={reset} className="bg-red-500 text-white p-2 rounded-lg"><MdClose size={18}/></button>}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase text-gray-400 border-b">
            <th className="py-3 text-left">Asset</th>
            <th className="py-3 text-left">Market</th>
            <th className="py-3">Group</th>
            <th className="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(s => {
            const group = groups.find(g => g.id === s.groupId);
            return (
              <tr key={s.id} className="hover:bg-gray-50 border-b border-gray-50">
                <td className="py-4">
                  <button className="flex items-center gap-2" onClick={() => toggleStockActive(s.id, !s.active)}>
                    <MdRadioButtonChecked className={s.active ? "text-green-500" : "text-gray-200"} size={18}/>
                    <span className="font-black text-gray-800 uppercase">{s.name}</span>
                  </button>
                </td>
                <td className="py-4 text-xs font-bold text-gray-500 uppercase">{s.marketCode}</td>
                <td className="py-4 text-center">
                  <span className="text-[9px] font-black px-2 py-1 bg-gray-100 rounded text-gray-500">{group ? group.name : "N/A"}</span>
                </td>
                <td className="py-4">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => startEdit(s)} className="text-blue-500 hover:text-blue-700"><MdEdit size={16}/></button>
                    <button onClick={() => deleteStock(s.id)} className="text-gray-300 hover:text-red-500"><MdDelete size={16}/></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}