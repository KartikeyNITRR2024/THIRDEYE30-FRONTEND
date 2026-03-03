import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdEdit, MdDelete, MdTrendingUp, 
  MdClose, MdRadioButtonChecked, MdPublic, MdFolderShared,
  MdAdd, MdCheckCircle, MdFingerprint, MdContentCopy, MdLabel
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import StockContext from "../../../contexts/VideoCreater/Stock/StockContext";

export default function SingleStockArea({ onBack }) {
  const { groups, stocks, addStock, updateStock, deleteStock, toggleStockActive, fetchStocks } = useContext(StockContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = { name: "", marketCode: "", stockName: "", active: true, groupId: "" };
  const [formData, setFormData] = useState(initialForm);

  // STANDARDIZED RESET
  const resetForm = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formData.groupId || !formData.name) return;
    const success = editingId ? await updateStock(editingId, formData) : await addStock(formData);
    if (success) resetForm();
  };

  // STATE FLUSH FOR EDITING
  const startEdit = (s) => { 
    resetForm(); 
    setTimeout(() => {
      setEditingId(s.id); 
      setFormData({ ...s }); 
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
            <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Market Tickers</h2>
            <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest leading-none">Asset Inventory & Exchange Mapping</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => fetchStocks()} className="flex-1 sm:flex-none bg-white p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition shadow-sm">
            <MdRefresh size={20} />
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-3 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
          >
            <MdAdd size={18} /> Register Asset
          </button>
        </div>
      </div>

      {/* ASSET GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((s) => {
          const group = groups.find(g => g.id === s.groupId);
          return (
            <motion.div layout key={s.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${s.active ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="max-w-[160px]">
                  <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate">{s.name}</h4>
                  <span className="text-[8px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-black uppercase truncate block w-fit">
                    {group?.name || "UNASSIGNED"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(s)} className="p-2 text-slate-300 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"><MdEdit size={16} /></button>
                  <button onClick={() => deleteStock(s.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"><MdDelete size={16} /></button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[44px] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Entity Name</span>
                    <p className="text-[10px] font-bold text-slate-600 uppercase truncate max-w-[140px]">{s.stockName || "—"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Exchange</span>
                    <p className="text-[10px] font-black text-slate-900 uppercase">{s.marketCode || "GLOBAL"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                   <button 
                    onClick={() => toggleStockActive(s.id, !s.active)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${s.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}
                   >
                     <MdRadioButtonChecked size={12}/>
                     <span className="text-[8px] font-black uppercase tracking-widest">{s.active ? 'Active' : 'Muted'}</span>
                   </button>
                   
                   <div className="flex gap-1">
                    <button 
                      onClick={() => copyToClipboard(s.id)}
                      className="flex items-center gap-1 text-[8px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-black uppercase tracking-tighter hover:bg-slate-900 hover:text-white transition"
                    >
                      <MdFingerprint size={10}/> {s.id.slice(0,8)}
                    </button>
                   </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* REGISTRATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-white shadow-lg"><MdTrendingUp size={20} /></div>
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
                    {editingId ? "Modify Asset Specifications" : "Register Financial Asset"}
                  </h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdFolderShared/> Parent Group</label>
                  <select className="w-full border-2 rounded-full px-5 py-3 text-xs font-bold bg-white focus:border-slate-800 outline-none transition appearance-none" 
                    value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})}>
                    <option value="">Select Category...</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name.toUpperCase()}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdLabel/> Ticker Symbol</label>
                  <input type="text" placeholder="e.g. AAPL" className="w-full border-2 rounded-full px-5 py-3 text-xs font-black outline-none focus:border-slate-800 transition uppercase" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><MdPublic/> Market Exchange</label>
                  <input type="text" placeholder="e.g. NASDAQ" className="w-full border-2 rounded-full px-5 py-3 text-xs font-black outline-none focus:border-slate-800 transition uppercase" 
                    value={formData.marketCode} onChange={e => setFormData({...formData, marketCode: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">Corporate Entity Name</label>
                  <input type="text" placeholder="e.g. Apple Inc." className="w-full border-2 rounded-full px-5 py-3 text-xs font-bold outline-none focus:border-slate-800 transition uppercase" 
                    value={formData.stockName} onChange={e => setFormData({...formData, stockName: e.target.value})} />
                </div>
              </div>

              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-4 rounded-full text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition tracking-[2px]">Discard</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={!formData.groupId || !formData.name}
                  className={`flex-[2] py-4 rounded-full text-[10px] font-black uppercase tracking-[2px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-900 text-white hover:bg-black'} disabled:bg-slate-100 disabled:text-slate-300`}
                >
                    <MdCheckCircle size={18}/> {editingId ? "Apply Changes" : "Deploy Ticker"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EMPTY STATE */}
      {stocks.length === 0 && (
        <div className="py-20 text-center">
            <MdTrendingUp size={48} className="mx-auto mb-4 text-slate-200"/>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">Ticker Index Empty</p>
        </div>
      )}
    </div>
  );
}