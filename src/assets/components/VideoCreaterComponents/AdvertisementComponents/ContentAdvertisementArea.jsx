import { useContext, useState, useMemo } from "react";
import { 
  MdArrowBack, MdRefresh, MdDelete, MdEdit, MdClose, MdAdd, 
  MdLayers, MdToggleOn, MdToggleOff, MdSearch, MdTimer, MdVerticalAlignCenter, MdCampaign
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import ContentAdvertisementContext from "../../../contexts/VideoCreater/ContentAdvertisement/ContentAdvertisementContext";

export default function ContentAdvertisementArea({ onBack }) {
  const { 
    contentAdList, fetchContentAds, addContentAd, 
    updateContentAd, deleteContentAd, toggleStatus, 
    getParentAdName, parentAds 
  } = useContext(ContentAdvertisementContext);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = {
    name: "", description: "", startingSecond: 0, endingSecond: 10,
    contentMultimediaKey: "", height: 100, contentAdvertisementPosition: "BOTTOM", 
    advertisementId: "", active: true
  };

  const [formData, setFormData] = useState(initialForm);

  const filtered = useMemo(() => {
    return contentAdList.filter(ad => 
      ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getParentAdName(ad.advertisementId).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contentAdList, searchTerm, getParentAdName]);

  const handleAction = async () => {
    if (!formData.name || !formData.advertisementId) {
      alert("Please fill name and select a Parent Configuration");
      return;
    }
    const success = editingId ? await updateContentAd(editingId, formData) : await addContentAd(formData);
    if (success) {
      setEditingId(null);
      setIsModalOpen(false);
      setFormData(initialForm);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 text-slate-800">
      
      {/* HEADER */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <MdArrowBack size={20} />
            </button>
            <h2 className="text-sm font-black uppercase tracking-tight">Timed Video Overlays</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => fetchContentAds()} className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
                <MdRefresh size={20} />
            </button>
            <button 
                onClick={() => { setEditingId(null); setFormData(initialForm); setIsModalOpen(true); }} 
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-purple-200"
            >
              <MdAdd size={18} /> Add Overlay
            </button>
          </div>
        </div>
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search by name or parent config..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-purple-500 transition-all" />
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ad) => (
          <motion.div layout key={ad.id} className={`bg-white p-5 rounded-2xl border ${ad.active ? 'border-purple-100 shadow-md ring-1 ring-purple-50' : 'border-slate-100 opacity-70'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0">
                    <h4 className="font-black text-xs uppercase truncate">{ad.name}</h4>
                    <div className="flex items-center gap-1 text-[9px] text-indigo-600 font-bold mt-1">
                       <MdCampaign /> {getParentAdName(ad.advertisementId)}
                    </div>
                </div>
                <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggleStatus(ad.id, ad.active)} className={ad.active ? 'text-purple-600' : 'text-slate-300'}>
                    {ad.active ? <MdToggleOn size={28} /> : <MdToggleOff size={28} />}
                    </button>
                    <button onClick={() => { setEditingId(ad.id); setFormData(ad); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-purple-600"><MdEdit size={18} /></button>
                    <button onClick={() => deleteContentAd(ad.id)} className="p-2 text-slate-400 hover:text-rose-600"><MdDelete size={18} /></button>
                </div>
              </div>
              
              <div className="flex gap-2 mb-3">
                <span className="text-[8px] font-black bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full uppercase">
                    {ad.startingSecond}s - {ad.endingSecond}s
                </span>
                <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">
                    {ad.contentAdvertisementPosition}
                </span>
              </div>

              <div className="pt-3 border-t text-[8px] font-bold uppercase text-slate-400 flex justify-between">
                  <span>UUID: {ad.id.split('-')[0]}...</span>
                  <span className="text-slate-300 italic">H: {ad.height}px</span>
              </div>
          </motion.div>
          ))}
      </div>

      {/* MODAL SECTION */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                    <MdLayers className="text-purple-600" size={20} />
                    {editingId ? 'Edit Overlay' : 'New Overlay'}
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition"><MdClose size={24} /></button>
              </div>

              <div className="p-6 space-y-4">
                {/* PARENT SELECT DROPDOWN */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Parent Advertisement Configuration</label>
                  <select 
                    className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold bg-white outline-none focus:border-purple-600"
                    value={formData.advertisementId} 
                    onChange={e => setFormData({...formData, advertisementId: e.target.value})}
                  >
                    <option value="">-- Select Main Config --</option>
                    {parentAds.map(parent => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name} {parent.active ? '' : '(Inactive)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Overlay Name</label>
                  <input type="text" placeholder="e.g., Bottom Left CTA" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-purple-600"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase"><MdTimer className="inline mb-1"/> Start (Sec)</label>
                    <input type="number" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold"
                      value={formData.startingSecond} onChange={e => setFormData({...formData, startingSecond: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase"><MdTimer className="inline mb-1"/> End (Sec)</label>
                    <input type="number" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold"
                      value={formData.endingSecond} onChange={e => setFormData({...formData, endingSecond: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase"><MdVerticalAlignCenter className="inline mb-1"/> Position</label>
                    <select className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold bg-white"
                      value={formData.contentAdvertisementPosition} onChange={e => setFormData({...formData, contentAdvertisementPosition: e.target.value})}>
                      <option value="TOP">TOP</option>
                      <option value="BOTTOM">BOTTOM</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Height (px)</label>
                    <input type="number" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold"
                      value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Multimedia Key (UUID)</label>
                  <input type="text" placeholder="00000000-0000-0000-0000-000000000000" className="w-full border-2 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none focus:border-purple-600"
                    value={formData.contentMultimediaKey} onChange={e => setFormData({...formData, contentMultimediaKey: e.target.value})} />
                </div>
              </div>

              <div className="p-6 border-t flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                <button onClick={handleAction} className="flex-[2] py-3 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition">
                  {editingId ? 'Update Overlay' : 'Save Overlay'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}