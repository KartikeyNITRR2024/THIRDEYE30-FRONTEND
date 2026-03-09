import { useContext, useState, useMemo } from "react";
import { 
  MdArrowBack, MdRefresh, MdDelete, MdEdit, MdClose, 
  MdAdd, MdRecordVoiceOver, MdHistory, MdToggleOn, MdToggleOff, 
  MdMale, MdFemale, MdSearch 
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import TtsSoundContext from "../../../contexts/VideoCreater/TtsSound/TtsSoundContext";

export default function TtsSoundArea({ onBack }) {
  const { soundList, fetchSounds, addSound, updateSound, deleteSound, toggleSoundStatus } = useContext(TtsSoundContext);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "", gender: "MALE", voicePersonalities: ""
  });

  // FILTER & SORT LOGIC
  const filteredSounds = useMemo(() => {
    return [...soundList]
      .filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.voicePersonalities.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a.active === b.active) {
          return new Date(b.lastlyUsed) - new Date(a.lastlyUsed);
        }
        return a.active ? -1 : 1;
      });
  }, [soundList, searchTerm]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", gender: "MALE", voicePersonalities: "" });
    setIsModalOpen(false);
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setFormData({ name: s.name, gender: s.gender, voicePersonalities: s.voicePersonalities });
    setIsModalOpen(true);
  };

  const handleAction = async () => {
    if (!formData.name || !formData.voicePersonalities) return;
    const success = editingId ? await updateSound(editingId, formData) : await addSound(formData);
    if (success) resetForm();
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 text-slate-800">
      
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
              <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div>
              <h2 className="text-sm font-black uppercase leading-none mb-1">TTS Voice Library</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {soundList.length} VOICES CONFIGURED
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => fetchSounds()} className="p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 transition bg-white shadow-sm">
              <MdRefresh size={20} />
            </button>
            <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 text-[10px] font-black transition uppercase tracking-widest shadow-md">
              <MdAdd size={18} /> New Voice
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search voices by name or personality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSounds.map((s) => (
          <motion.div layout key={s.id} className={`bg-white p-5 rounded-2xl border transition-all duration-300 ${s.active ? 'border-slate-100 shadow-sm' : 'border-rose-100 opacity-75 grayscale-[0.3]'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate pr-2">{s.name}</h4>
                <div className="flex items-center gap-2">
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1 ${s.gender === 'MALE' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                        {s.gender === 'MALE' ? <MdMale /> : <MdFemale />} {s.gender}
                    </span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${s.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {s.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggleSoundStatus(s.id, s.active)} className={`p-2 rounded-lg transition ${s.active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-50'}`}>
                  {s.active ? <MdToggleOn size={24} /> : <MdToggleOff size={24} />}
                </button>
                <button onClick={() => startEdit(s)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition">
                  <MdEdit size={18} />
                </button>
                <button onClick={() => deleteSound(s.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition">
                  <MdDelete size={18} />
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mb-3 bg-slate-50 p-2 rounded-lg italic">
                "{s.voicePersonalities}"
            </p>

            <div className="space-y-2 border-t pt-3">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                <span className="flex items-center gap-1"><MdHistory /> Last Used:</span>
                <span className="text-slate-800">{s.lastlyUsed ? new Date(s.lastlyUsed).toLocaleDateString() : 'NEVER'}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* EMPTY STATE */}
        {filteredSounds.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
            <MdRecordVoiceOver size={48} className="mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest">No voices found</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white"><MdRecordVoiceOver size={20} /></div>
                  <h3 className="text-xs font-black uppercase tracking-widest">{editingId ? 'Edit Voice' : 'Add New Voice'}</h3>
                </div>
                <button onClick={resetForm} className="text-slate-400 hover:text-rose-500 transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Voice Name (Provider ID)</label>
                    <input type="text" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-600 transition" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. en-US-Neural-A" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Gender</label>
                        <select className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold bg-white outline-none focus:border-indigo-600"
                            value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Voice Description / Personalities</label>
                  <textarea className="w-full border-2 rounded-xl px-4 py-3 text-xs font-medium h-24 resize-none outline-none focus:border-indigo-600 transition" 
                    value={formData.voicePersonalities} onChange={e => setFormData({...formData, voicePersonalities: e.target.value})} 
                    placeholder="e.g. Calm, Professional, News Anchor style..." />
                </div>
              </div>

              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                <button onClick={handleAction} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition">
                  {editingId ? 'Update Voice' : 'Save Voice'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}