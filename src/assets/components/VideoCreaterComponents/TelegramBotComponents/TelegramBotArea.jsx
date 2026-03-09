import { useContext, useState } from "react";
import { 
  MdArrowBack, MdRefresh, MdDelete, MdSmartToy, MdClose, 
  MdToggleOn, MdToggleOff, MdKey, MdChatBubble, MdAdd, MdSettings, MdEdit
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import TelegramBotContext from "../../../contexts/VideoCreater/TelegramBot/TelegramBotContext";

export default function TelegramBotArea({ onBack }) {
  // Added updateBot to the context destructuring
  const { botList, fetchBots, addBot, updateBot, deleteBot, toggleBotStatus } = useContext(TelegramBotContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track if we are editing
  const [formData, setFormData] = useState({
    name: "", chatId: "", botToken: "", botType: "LOGS"
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", chatId: "", botToken: "", botType: "LOGS" });
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const startEdit = (bot) => {
    setEditingId(bot.id);
    setFormData({
      name: bot.name,
      chatId: bot.chatId,
      botToken: bot.botToken,
      botType: bot.botType
    });
    setIsModalOpen(true);
  };

  const handleAction = async () => {
    if (!formData.name || !formData.botToken) return;

    let success;
    if (editingId) {
      // Logic for Update
      success = await updateBot(editingId, formData);
    } else {
      // Logic for Create
      success = await addBot(formData);
    }

    if (success) {
      resetForm();
    }
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
                <h2 className="text-sm font-black uppercase leading-none mb-1">Telegram Gateway</h2>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{botList.length} CONNECTED BOTS</span>
            </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => fetchBots()} className="p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition bg-white shadow-sm">
                <MdRefresh size={20} />
            </button>
            <button onClick={openCreateModal} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 text-[10px] font-black transition uppercase tracking-widest shadow-md">
                <MdAdd size={18} /> Add Bot
            </button>
        </div>
      </div>

      {/* BOT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {botList.map((bot) => (
          <motion.div layout key={bot.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${bot.botType === 'FINAL_PRODUCT' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-black text-slate-800 uppercase text-xs mb-1">{bot.name}</h4>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${bot.botType === 'FINAL_PRODUCT' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                  {bot.botType}
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggleBotStatus(bot.id, bot.active)} className={`p-2 rounded-lg transition ${bot.active ? 'text-emerald-500 bg-emerald-50' : 'text-slate-300 bg-slate-50'}`}>
                  {bot.active ? <MdToggleOn size={24} /> : <MdToggleOff size={24} />}
                </button>
                {/* Edit Button added to match VideoArea logic */}
                <button onClick={() => startEdit(bot)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                  <MdEdit size={20} />
                </button>
                <button onClick={() => deleteBot(bot.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition">
                  <MdDelete size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                <MdChatBubble className="text-slate-300" /> <span className="uppercase tracking-tighter">Chat ID:</span> 
                <span className="text-slate-800 font-black">{bot.chatId}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                <MdKey className="text-slate-300" /> <span className="uppercase tracking-tighter">Token:</span> 
                <span className="text-slate-800 font-mono tracking-tight truncate max-w-[150px]">••••{bot.botToken?.slice(-4)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL (CREATE / UPDATE) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white ${editingId ? 'bg-amber-500' : 'bg-blue-600'}`}>
                    <MdSmartToy size={20} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest">
                    {editingId ? "Update Bot Config" : "Register New Bot"}
                  </h3>
                </div>
                <button onClick={resetForm} className="text-slate-400 hover:text-rose-500 transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Friendly Name</label>
                  <input type="text" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-blue-600 transition" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Production Alerts" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Bot Token</label>
                  <input type="password" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:border-blue-600 transition" 
                    value={formData.botToken} onChange={e => setFormData({...formData, botToken: e.target.value})} placeholder="123456:ABC-DEF..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Chat ID</label>
                    <input type="text" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-blue-600" 
                      value={formData.chatId} onChange={e => setFormData({...formData, chatId: e.target.value})} placeholder="-100..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Channel Type</label>
                    <select className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold bg-white outline-none focus:border-blue-600"
                      value={formData.botType} onChange={e => setFormData({...formData, botType: e.target.value})}>
                      <option value="LOGS">LOGS</option>
                      <option value="FINAL_PRODUCT">FINAL_PRODUCT</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                <button onClick={handleAction} className={`flex-[2] py-3 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {editingId ? "Save Changes" : "Confirm Integration"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}