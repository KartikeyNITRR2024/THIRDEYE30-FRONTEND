import { useContext, useState } from "react";
import { 
  MdArrowBack, MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked, 
  MdClose, MdImage, MdTransform, MdSlowMotionVideo, MdRotateRight,
  MdSpeed, MdOpenInFull, MdAdd, MdStyle, MdMovieFilter
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import NewsImageContext from "../../../contexts/VideoCreater/NewsImage/NewsImageContext";

export default function NewsImageArea({ onBack }) {
  const { newsImages, createNewsImage, updateNewsImage, deleteNewsImage, activateNewsImage } = useContext(NewsImageContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Requirement: All starting variables must be null (Standardizing with Java DTO)
  const initialForm = {
    name: "",
    description: "",
    active: false,
    enterFrom: null,
    exitTo: null,
    transitionT: null,
    marginScale: null,
    animationMode: null,
    zoomIntensity: null,
    isSpinEnabled: false,
    spinSpeed: null
  };

  const [formData, setFormData] = useState(initialForm);

  // Clear Form Logic
  const resetForm = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
        alert("Profile name is required");
        return;
    }

    // Payload Mapping with strict type conversion for Java DTO
    const payload = {
      ...formData,
      enterFrom: formData.enterFrom || "RIGHT",
      exitTo: formData.exitTo || "LEFT",
      transitionT: parseFloat(formData.transitionT ?? 0.5),
      marginScale: parseFloat(formData.marginScale ?? 1.0),
      animationMode: formData.animationMode || "STATIC",
      zoomIntensity: parseFloat(formData.zoomIntensity ?? 1.2),
      spinSpeed: parseInt(formData.spinSpeed ?? 0)
    };

    const success = editingId ? await updateNewsImage(editingId, payload) : await createNewsImage(payload);
    if (success) resetForm();
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6">
      
      {/* TOP HEADER BAR (VideoArea Style) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div>
                <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">News Image FX Console</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{newsImages.length} KINEMATIC PROFILES</span>
                </div>
            </div>
        </div>
        
        <button 
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-black text-[10px] font-black transition uppercase tracking-widest shadow-md active:scale-95"
        >
            <MdAdd size={18} /> New FX Profile
        </button>
      </div>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
              {/* MODAL HEADER */}
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${editingId ? 'bg-green-600 text-white' : 'bg-slate-800 text-white'}`}>
                        {editingId ? <MdMovieFilter size={20} /> : <MdAdd size={20} />}
                    </div>
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
                        {editingId ? "Modify Kinematics Profile" : "Create New FX Profile"}
                    </h3>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition">
                    <MdClose size={24} />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* COL 1: IDENTITY & SCALE */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-green-600 flex items-center gap-2 uppercase"><MdImage size={16}/> Identity</h3>
                    <input type="text" placeholder="Profile Name" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-green-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <textarea placeholder="Description..." className="w-full border-2 rounded-xl px-4 py-2 text-[10px] h-20 resize-none outline-none focus:border-green-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    
                    <div className="p-4 bg-slate-50 rounded-xl border space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Margin Scale</label>
                            <span className="text-[10px] font-mono text-green-600 font-bold">{formData.marginScale ?? 1.0}x</span>
                        </div>
                        <input type="range" min="0.5" max="2.0" step="0.1" className="w-full accent-slate-800" value={formData.marginScale ?? 1.0} onChange={e => setFormData({...formData, marginScale: e.target.value})} />
                    </div>
                  </div>

                  {/* COL 2: VECTOR PATHS */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-green-600 flex items-center gap-2 uppercase"><MdTransform size={16}/> Vector Paths</h3>
                    <div className="p-4 bg-slate-50 rounded-xl border space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase">Enter From</label>
                                <select className="w-full border-2 rounded-lg p-2 text-[10px] font-bold" value={formData.enterFrom || ""} onChange={e => setFormData({...formData, enterFrom: e.target.value})}>
                                    <option value="">Select...</option>
                                    <option value="LEFT">LEFT</option><option value="RIGHT">RIGHT</option><option value="TOP">TOP</option><option value="BOTTOM">BOTTOM</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase">Exit To</label>
                                <select className="w-full border-2 rounded-lg p-2 text-[10px] font-bold" value={formData.exitTo || ""} onChange={e => setFormData({...formData, exitTo: e.target.value})}>
                                    <option value="">Select...</option>
                                    <option value="LEFT">LEFT</option><option value="RIGHT">RIGHT</option><option value="TOP">TOP</option><option value="BOTTOM">BOTTOM</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 pt-2 border-t">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Transition Duration (s)</label>
                            <div className="relative">
                                <input type="number" step="0.1" className="w-full border-2 rounded-lg p-2 text-xs font-bold" value={formData.transitionT ?? ""} onChange={e => setFormData({...formData, transitionT: e.target.value})} />
                                <MdSpeed className="absolute right-2 top-2.5 text-slate-300" />
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* COL 3: BEHAVIOR & SPIN */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-green-600 flex items-center gap-2 uppercase"><MdSlowMotionVideo size={16}/> Behavior FX</h3>
                    <div className="p-4 bg-slate-50 rounded-xl border space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase">Animation Mode</label>
                            <select className="w-full border-2 rounded-lg p-2 text-[10px] font-bold" value={formData.animationMode || ""} onChange={e => setFormData({...formData, animationMode: e.target.value})}>
                                <option value="">Select...</option>
                                <option value="STATIC">STATIC</option><option value="ZOOM_IN">ZOOM IN</option><option value="ZOOM_OUT">ZOOM OUT</option>
                            </select>
                        </div>
                        {formData.animationMode && formData.animationMode !== "STATIC" && (
                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase">Zoom Intensity</label>
                                <input type="number" step="0.1" className="border-2 rounded-lg p-2 text-xs font-bold" value={formData.zoomIntensity ?? ""} onChange={e => setFormData({...formData, zoomIntensity: e.target.value})} />
                            </div>
                        )}
                        <div className="pt-3 border-t">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[8px] font-black text-slate-400 uppercase flex items-center gap-1"><MdRotateRight/> Constant Spin</label>
                                <input type="checkbox" className="w-4 h-4 accent-green-600" checked={formData.isSpinEnabled} onChange={e => setFormData({...formData, isSpinEnabled: e.target.checked})} />
                            </div>
                            {formData.isSpinEnabled && (
                                <input type="number" placeholder="Spin Speed" className="w-full border-2 rounded-lg p-2 text-xs font-bold" value={formData.spinSpeed ?? ""} onChange={e => setFormData({...formData, spinSpeed: e.target.value})} />
                            )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-6 bg-white border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400 hover:bg-slate-50 transition">Cancel</button>
                <button 
                    onClick={handleSubmit} 
                    className="flex-[2] py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[2px] hover:bg-green-700 transition-all shadow-lg active:scale-95">
                    {editingId ? "Update Kinematics" : "Save FX Profile"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GRID LIST (VideoArea Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {newsImages.map((item) => (
          <motion.div layout key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${item.active ? 'bg-green-500' : 'bg-slate-200'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[150px]">
                  <h4 className="font-black text-slate-800 uppercase text-xs mb-1 truncate">{item.name}</h4>
                  <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
                     <span className="bg-slate-100 px-1 rounded uppercase">{item.enterFrom}</span>
                     <span>➔</span>
                     <span className="bg-slate-100 px-1 rounded uppercase">{item.exitTo}</span>
                  </div>
              </div>
              <div className="flex gap-1">
                  <button onClick={() => activateNewsImage(item.id)} className="p-2 hover:bg-green-50 rounded-lg transition text-green-500">
                    {item.active ? <MdCheckCircle size={20}/> : <MdRadioButtonUnchecked className="text-slate-200" size={20}/>}
                  </button>
                  <button onClick={() => startEdit(item)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"><MdEdit size={18}/></button>
                  <button onClick={() => deleteNewsImage(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition"><MdDelete size={18}/></button>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 mt-4 pt-4 border-t border-slate-50">
               <span className="flex items-center gap-1">{item.animationMode}</span>
               <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.transitionT}s Path</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}