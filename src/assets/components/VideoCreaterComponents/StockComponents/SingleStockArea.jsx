import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdTrendingUp, 
  MdClose, MdRadioButtonChecked, MdFiberManualRecord, MdPublic, MdFolderShared 
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import StockContext from "../../../contexts/VideoCreater/Stock/StockContext";

export default function SingleStockArea({ onBack }) {
  const { groups, stocks, addStock, updateStock, deleteStock, toggleStockActive, fetchStocks } = useContext(StockContext);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", marketCode: "", stockName: "", active: true, groupId: "" });

  const reset = () => { setEditingId(null); setFormData({ name: "", marketCode: "", stockName: "", active: true, groupId: "" }); };

  const handleSubmit = async () => {
    if (!formData.groupId || !formData.name) return;
    const success = editingId ? await updateStock(editingId, formData) : await addStock(formData);
    if (success) reset();
  };

  const startEdit = (s) => { 
    setEditingId(s.id); 
    setFormData({ ...s }); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button onClick={onBack} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-black text-[10px] font-black transition-all uppercase tracking-widest shadow-md active:scale-95">
          <MdArrowBack size={18} /> BACK
        </button>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Market Tickers</h2>
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[2px]">Asset Inventory</span>
          </div>
          <button onClick={() => fetchStocks()} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
            <MdRefresh size={22} />
          </button>
        </div>
      </div>

      {/* REGISTRATION PANEL */}
      <div className={`mb-8 p-6 border-2 rounded-2xl transition-all shadow-sm ${editingId ? 'border-amber-400 bg-amber-50/20' : 'bg-slate-50/50 border-slate-200 border-dashed'}`}>
        <div className="flex items-center gap-2 mb-5">
            <MdTrendingUp className={editingId ? "text-amber-500" : "text-slate-400"} size={20}/>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {editingId ? "Modify Ticker Specifications" : "Register New Financial Asset"}
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Parent Group</label>
            <div className="relative">
                <MdFolderShared className="absolute left-3 top-3 text-slate-400" size={14}/>
                <select className="w-full border-2 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold bg-white outline-none focus:border-slate-800 transition-all appearance-none"
                  value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})}>
                  <option value="">Choose...</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name.toUpperCase()}</option>)}
                </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Ticker Symbol</label>
            <input type="text" placeholder="e.g. NVDA" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase outline-none focus:border-slate-800 transition-all bg-white"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Market Exchange</label>
            <div className="relative">
                <MdPublic className="absolute left-3 top-3 text-slate-400" size={14}/>
                <input type="text" placeholder="e.g. NASDAQ" className="w-full border-2 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold uppercase outline-none focus:border-slate-800 transition-all bg-white"
                  value={formData.marketCode} onChange={e => setFormData({...formData, marketCode: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Entity Name</label>
            <input type="text" placeholder="e.g. NVIDIA Corp" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-slate-800 transition-all bg-white"
              value={formData.stockName} onChange={e => setFormData({...formData, stockName: e.target.value})} />
          </div>

          <div className="flex items-end gap-2">
            <button onClick={handleSubmit} 
              disabled={!formData.groupId || !formData.name}
              className={`flex-1 h-[42px] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 
              ${(!formData.groupId || !formData.name) ? 'bg-slate-200 text-slate-400' : editingId ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
              {editingId ? "Update" : "Add Asset"}
            </button>
            {editingId && (
              <button onClick={reset} className="bg-rose-500 text-white h-[42px] px-3 rounded-xl hover:bg-rose-600 transition-all">
                <MdClose size={20}/>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TICKER TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-[10px] font-black uppercase text-slate-400 bg-slate-50/50 tracking-wider">
              <th className="py-4 px-6 text-left">Asset / Ticker</th>
              <th className="py-4 px-4 text-left">Exchange</th>
              <th className="py-4 px-4 text-center">Category</th>
              <th className="py-4 px-6 text-right w-32">Utility</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(s => {
              const group = groups.find(g => g.id === s.groupId);
              return (
                <tr key={s.id} className={`group border-b border-slate-50 last:border-0 hover:bg-amber-50/20 transition-colors ${editingId === s.id ? 'bg-amber-50/40' : ''}`}>
                  <td className="py-4 px-6 text-left">
                    <button className="flex items-center gap-3 group/btn" onClick={() => toggleStockActive(s.id, !s.active)}>
                      <div className="relative">
                        <MdRadioButtonChecked className={s.active ? "text-emerald-500" : "text-slate-200"} size={20}/>
                        {s.active && <motion.div layoutId={`active-${s.id}`} className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-black text-slate-800 uppercase text-xs tracking-tight leading-none mb-0.5">{s.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase truncate max-w-[150px]">{s.stockName || "Unnamed Entity"}</span>
                      </div>
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 text-slate-600 font-black text-[9px] uppercase border border-slate-200">
                        <MdPublic size={10}/> {s.marketCode || "GLOBAL"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-[10px] font-black px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm">
                        {group ? group.name.toUpperCase() : "UNASSIGNED"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(s)} className="p-2.5 text-blue-500 hover:bg-white rounded-xl transition-all"><MdEdit size={16}/></button>
                      <button onClick={() => deleteStock(s.id)} className="p-2.5 text-slate-300 hover:text-rose-500 transition-colors"><MdDelete size={18}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {stocks.length === 0 && (
          <div className="py-20 text-center text-slate-300">
              <MdTrendingUp size={48} className="mx-auto mb-2 opacity-20"/>
              <p className="text-[10px] font-black uppercase tracking-[3px]">Market Index Empty</p>
          </div>
      )}
    </motion.div>
  );
}