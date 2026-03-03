import { useContext, useState } from "react";
import { 
  MdArrowBack, MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked, 
  MdClose, MdImage, MdTransform, MdSlowMotionVideo, MdRotateRight,
  MdSpeed, MdOpenInFull
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import NewsImageContext from "../../../contexts/VideoCreater/NewsImage/NewsImageContext";

export default function NewsImageArea({ onBack }) {
  const { newsImages, createNewsImage, updateNewsImage, deleteNewsImage, activateNewsImage } = useContext(NewsImageContext);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    name: "",
    description: "",
    active: false,
    enterFrom: "RIGHT",
    exitTo: "LEFT",
    transitionT: 0.5,
    marginScale: 1.0,
    animationMode: "STATIC",
    zoomIntensity: 1.2,
    isSpinEnabled: false,
    spinSpeed: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const reset = () => { 
    setEditingId(null); 
    setFormData(initialForm); 
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...initialForm, ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    const payload = {
      ...formData,
      transitionT: parseFloat(formData.transitionT),
      marginScale: parseFloat(formData.marginScale),
      zoomIntensity: parseFloat(formData.zoomIntensity),
      spinSpeed: parseInt(formData.spinSpeed)
    };
    const success = editingId ? await updateNewsImage(editingId, payload) : await createNewsImage(payload);
    if (success) reset();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-4 md:p-6 shadow-md mt-6 border border-gray-100">
      
      {/* TOP NAVIGATION */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button onClick={onBack} className="bg-gray-100 px-4 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 hover:bg-gray-200 transition active:scale-95 uppercase">
          <MdArrowBack size={16}/> BACK TO DASHBOARD
        </button>
        <div className="text-right">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-tight">News Image FX Manager</h2>
          <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Transition & Motion Control</span>
        </div>
      </div>

      {/* FX COMPOSITION PANEL */}
      <div className={`mb-8 p-6 rounded-2xl border-2 transition-all shadow-sm ${editingId ? 'border-green-400 bg-green-50/10' : 'bg-slate-50/50 border-slate-200 border-dashed'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] flex items-center gap-2">
                <MdSlowMotionVideo size={18} className={editingId ? "text-green-500" : "text-slate-400"}/>
                {editingId ? "Modify Kinematics Profile" : "Create New Animation Style"}
            </h3>
            {editingId && (
                <button onClick={reset} className="text-rose-500 flex items-center gap-1 text-[9px] font-black hover:underline uppercase">
                    <MdClose /> Discard Changes
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GROUP 1: IDENTITY & KINEMATICS */}
          <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Profile Name</label>
                <input type="text" placeholder="e.g., Dynamic Sidebar Slide" className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-green-500 transition shadow-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">FX Description</label>
                <textarea placeholder="Usage notes..." className="w-full border-2 rounded-xl px-3 py-2 text-[10px] h-16 shadow-sm outline-none focus:border-green-500 transition resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            
            <div className="p-4 bg-white rounded-xl border shadow-sm">
               <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1"><MdOpenInFull/> Margin Scale</label>
                  <span className="text-[10px] font-mono font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">{formData.marginScale}x</span>
               </div>
               <input type="range" min="0.5" max="2.0" step="0.1" className="w-full accent-green-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" value={formData.marginScale} onChange={e => setFormData({...formData, marginScale: e.target.value})} />
            </div>
          </div>

          {/* GROUP 2: TRANSITION PATHS */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest"><MdTransform/> Vector Paths</h3>
            <div className="p-5 bg-white rounded-2xl border shadow-sm space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 block uppercase">Enter From</label>
                        <select className="w-full border-2 p-2.5 text-[10px] font-black rounded-lg bg-slate-50 outline-none focus:border-green-500" value={formData.enterFrom} onChange={e => setFormData({...formData, enterFrom: e.target.value})}>
                            <option value="LEFT">LEFT</option><option value="RIGHT">RIGHT</option><option value="TOP">TOP</option><option value="BOTTOM">BOTTOM</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 block uppercase">Exit To</label>
                        <select className="w-full border-2 p-2.5 text-[10px] font-black rounded-lg bg-slate-50 outline-none focus:border-green-500" value={formData.exitTo} onChange={e => setFormData({...formData, exitTo: e.target.value})}>
                            <option value="LEFT">LEFT</option><option value="RIGHT">RIGHT</option><option value="TOP">TOP</option><option value="BOTTOM">BOTTOM</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 block mb-1 uppercase">Transition Duration (Seconds)</label>
                    <div className="relative">
                        <input type="number" step="0.1" className="w-full border-2 rounded-xl p-2.5 text-xs font-black outline-none focus:border-green-500" value={formData.transitionT} onChange={e => setFormData({...formData, transitionT: e.target.value})} />
                        <MdSpeed className="absolute right-3 top-3 text-gray-300" size={16}/>
                    </div>
                </div>
            </div>
          </div>

          {/* GROUP 3: ANIMATION & SPIN */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest"><MdSlowMotionVideo/> Behavior FX</h3>
            <div className="p-5 bg-white rounded-2xl border shadow-sm space-y-4">
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 block mb-1 uppercase">Motion Mode</label>
                    <select className="w-full border-2 p-2.5 text-[10px] font-black rounded-lg bg-green-50/30 outline-none focus:border-green-500" value={formData.animationMode} onChange={e => setFormData({...formData, animationMode: e.target.value})}>
                        <option value="STATIC">STATIC</option><option value="ZOOM_IN">ZOOM IN</option><option value="ZOOM_OUT">ZOOM OUT</option>
                    </select>
                </div>
                {formData.animationMode !== "STATIC" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 block mb-1 uppercase">Zoom Magnitude</label>
                      <input type="number" step="0.1" className="w-full border-2 rounded-xl p-2.5 text-xs font-black outline-none focus:border-green-500 bg-white" value={formData.zoomIntensity} onChange={e => setFormData({...formData, zoomIntensity: e.target.value})} />
                  </motion.div>
                )}
                <div className="pt-3 border-t flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-600 flex items-center gap-2 uppercase"><MdRotateRight className="text-amber-500"/> Constant Spin</span>
                    <input type="checkbox" className="w-4 h-4 accent-amber-500" checked={formData.isSpinEnabled} onChange={e => setFormData({...formData, isSpinEnabled: e.target.checked})} />
                </div>
                {formData.isSpinEnabled && (
                    <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <input type="number" placeholder="Spin RPM / Speed" className="w-full border-2 rounded-xl p-2.5 text-xs font-black bg-amber-50/30 border-amber-100 outline-none focus:border-amber-400" value={formData.spinSpeed} onChange={e => setFormData({...formData, spinSpeed: e.target.value})} />
                    </motion.div>
                )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button onClick={handleSubmit} className="w-full bg-black text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[3px] hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]">
            {editingId ? "Update Kinematics Profile" : "Deploy Image Style"}
          </button>
        </div>
      </div>

      {/* REPOSITORY TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 uppercase border-b bg-slate-50/50">
              <th className="p-4 text-center w-20">Live</th>
              <th className="p-4 text-left">Motion Profile</th>
              <th className="p-4 text-center">Translation Path</th>
              <th className="p-4 text-center">Behavior</th>
              <th className="p-4 text-right">Utility</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
                {newsImages.map(item => (
                <motion.tr 
                    key={item.id} 
                    layout
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${item.active ? 'bg-green-50/30' : ''}`}
                >
                    <td className="p-4 text-center">
                    <button onClick={() => activateNewsImage(item.id)} className="transition-transform active:scale-125">
                        {item.active ? <MdCheckCircle className="text-green-500" size={26}/> : <MdRadioButtonUnchecked className="text-slate-200" size={26}/>}
                    </button>
                    </td>
                    <td className="p-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{item.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter truncate max-w-[200px]">{item.description || "System Standard"}</span>
                    </div>
                    </td>
                    <td className="p-4">
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                <span className="text-[9px] font-black text-slate-600">{item.enterFrom}</span>
                                <MdTransform size={10} className="text-slate-400"/>
                                <span className="text-[9px] font-black text-slate-600">{item.exitTo}</span>
                            </div>
                            <span className="text-[8px] font-mono font-bold text-slate-400">{item.transitionT}s Duration</span>
                        </div>
                    </td>
                    <td className="p-4">
                        <div className="flex justify-center gap-2">
                            <span className={`px-2 py-1 rounded text-[8px] font-black border ${item.animationMode === 'STATIC' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                {item.animationMode}
                            </span>
                            {item.isSpinEnabled && (
                                <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-100 text-[8px] font-black flex items-center gap-1">
                                    <MdRotateRight size={10}/> SPIN
                                </span>
                            )}
                        </div>
                    </td>
                    <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                            <button onClick={() => handleEdit(item)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-blue-100">
                                <MdEdit size={18}/>
                            </button>
                            <button onClick={() => deleteNewsImage(item.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors">
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
    </motion.div>
  );
}