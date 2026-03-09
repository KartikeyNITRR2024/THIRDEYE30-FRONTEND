import { useContext, useState, useMemo } from "react";
import { 
  MdArrowBack, MdRefresh, MdDelete, MdEdit, MdClose, 
  MdAdd, MdCampaign, MdToggleOn, MdToggleOff, MdSearch, MdSettingsInputComponent, MdColorLens
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import AdvertisementContext from "../../../contexts/VideoCreater/Advertisement/AdvertisementContext";

export default function AdvertisementGroupArea({ onBack }) {
  const { adList, fetchAds, addAd, updateAd, deleteAd, toggleAdStatus } = useContext(AdvertisementContext);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", description: "",
    isIntroAdvertismentPresent: false, introAdvertismentMultimediaKey: "", introAdvertismentSize: 0,
    isBadgeAdvertismentPresent: false, badgeAdvertismentMultimediaKey: "", badgeAdvertismentSize: 0,
    badgeAdvertismentBackgroundColor: "#ffffff", badgeAdvertismentBackgroundWidthPercent: "100",
    isContentAdvertismentPresent: false
  });

  const filteredAds = useMemo(() => {
    return adList.filter(ad => ad.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [adList, searchTerm]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "", description: "",
      isIntroAdvertismentPresent: false, introAdvertismentMultimediaKey: "", introAdvertismentSize: 0,
      isBadgeAdvertismentPresent: false, badgeAdvertismentMultimediaKey: "", badgeAdvertismentSize: 0,
      badgeAdvertismentBackgroundColor: "#ffffff", badgeAdvertismentBackgroundWidthPercent: "100",
      isContentAdvertismentPresent: false
    });
    setIsModalOpen(false);
  };

  const handleAction = async () => {
    if (!formData.name) return;
    const success = editingId ? await updateAd(editingId, formData) : await addAd(formData);
    if (success) resetForm();
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 text-slate-800">
      
      {/* HEADER */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
              <MdArrowBack size={20} />
            </button>
            <h2 className="text-sm font-black uppercase">Ad Configurations</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => fetchAds()} className="p-2.5 rounded-lg text-slate-400 border border-slate-200 hover:text-slate-900 bg-white shadow-sm">
              <MdRefresh size={20} />
            </button>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest shadow-md">
              <MdAdd size={18} /> Create New
            </button>
          </div>
        </div>
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search configurations..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-indigo-500" />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAds.map((ad) => (
          <motion.div layout key={ad.id} className={`bg-white p-5 rounded-2xl border ${ad.active ? 'border-indigo-100 ring-1 ring-indigo-50 shadow-md' : 'border-slate-100 opacity-75'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="min-w-0">
                <h4 className="font-black text-xs uppercase truncate">{ad.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{ad.description}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggleAdStatus(ad.id, ad.active)} className={`p-1.5 rounded-lg transition ${ad.active ? 'text-indigo-600' : 'text-slate-300'}`}>
                  {ad.active ? <MdToggleOn size={24} /> : <MdToggleOff size={24} />}
                </button>
                <button onClick={() => { setEditingId(ad.id); setFormData(ad); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><MdEdit size={18} /></button>
                <button onClick={() => deleteAd(ad.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><MdDelete size={18} /></button>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {ad.isIntroAdvertismentPresent && <span className="text-[8px] px-2 py-0.5 bg-amber-50 text-amber-600 font-black rounded-full border border-amber-100 uppercase">Intro</span>}
              {ad.isBadgeAdvertismentPresent && <span className="text-[8px] px-2 py-0.5 bg-blue-50 text-blue-600 font-black rounded-full border border-blue-100 uppercase">Badge</span>}
              {ad.isContentAdvertismentPresent && <span className="text-[8px] px-2 py-0.5 bg-purple-50 text-purple-600 font-black rounded-full border border-purple-100 uppercase">Content</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl my-auto"
            >
              <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white"><MdCampaign size={20} /></div>
                  <h3 className="text-xs font-black uppercase tracking-widest">{editingId ? 'Edit Ad' : 'New Ad Configuration'}</h3>
                </div>
                <button onClick={resetForm} className="text-slate-400 hover:text-rose-500"><MdClose size={24} /></button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* General Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Configuration Name</label>
                    <input type="text" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-600"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Description</label>
                    <input type="text" className="w-full border-2 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-600"
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Intro Ad Toggle & Details */}
                <div className={`p-4 rounded-xl border-2 transition-all ${formData.isIntroAdvertismentPresent ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <MdSettingsInputComponent className="text-amber-500"/>
                        <span className="text-[10px] font-black uppercase">Intro Advertisement</span>
                    </div>
                    <button onClick={() => setFormData({...formData, isIntroAdvertismentPresent: !formData.isIntroAdvertismentPresent})}>
                        {formData.isIntroAdvertismentPresent ? <MdToggleOn size={30} className="text-amber-500"/> : <MdToggleOff size={30} className="text-slate-300"/>}
                    </button>
                  </div>
                  {formData.isIntroAdvertismentPresent && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Multimedia Key (UUID)</label>
                        <input type="text" className="w-full border bg-white rounded-lg px-3 py-2 text-[10px]"
                          value={formData.introAdvertismentMultimediaKey} onChange={e => setFormData({...formData, introAdvertismentMultimediaKey: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Logo Size (KB)</label>
                        <input type="number" className="w-full border bg-white rounded-lg px-3 py-2 text-[10px]"
                          value={formData.introAdvertismentSize} onChange={e => setFormData({...formData, introAdvertismentSize: e.target.value})} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Badge Ad Toggle & Details */}
                <div className={`p-4 rounded-xl border-2 transition-all ${formData.isBadgeAdvertismentPresent ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <MdColorLens className="text-blue-500"/>
                        <span className="text-[10px] font-black uppercase">Badge / Overly Advertisement</span>
                    </div>
                    <button onClick={() => setFormData({...formData, isBadgeAdvertismentPresent: !formData.isBadgeAdvertismentPresent})}>
                        {formData.isBadgeAdvertismentPresent ? <MdToggleOn size={30} className="text-blue-500"/> : <MdToggleOff size={30} className="text-slate-300"/>}
                    </button>
                  </div>
                  {formData.isBadgeAdvertismentPresent && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Multimedia Key</label>
                                <input type="text" className="w-full border bg-white rounded-lg px-3 py-2 text-[10px]"
                                value={formData.badgeAdvertismentMultimediaKey} onChange={e => setFormData({...formData, badgeAdvertismentMultimediaKey: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Size (KB)</label>
                                <input type="number" className="w-full border bg-white rounded-lg px-3 py-2 text-[10px]"
                                value={formData.badgeAdvertismentSize} onChange={e => setFormData({...formData, badgeAdvertismentSize: e.target.value})} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Background Color (Hex)</label>
                                <input type="text" className="w-full border bg-white rounded-lg px-3 py-2 text-[10px]"
                                value={formData.badgeAdvertismentBackgroundColor} onChange={e => setFormData({...formData, badgeAdvertismentBackgroundColor: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase">Width Percent (%)</label>
                                <input type="text" className="w-full border bg-white rounded-lg px-3 py-2 text-[10px]"
                                value={formData.badgeAdvertismentBackgroundWidthPercent} onChange={e => setFormData({...formData, badgeAdvertismentBackgroundWidthPercent: e.target.value})} />
                            </div>
                        </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t flex gap-3">
                <button onClick={resetForm} className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                <button onClick={handleAction} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition">
                  {editingId ? 'Update Config' : 'Save Configuration'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}