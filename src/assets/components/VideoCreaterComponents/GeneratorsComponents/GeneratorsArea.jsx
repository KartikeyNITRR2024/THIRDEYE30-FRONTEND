import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GeneratorsContext from "../../../contexts/VideoCreater/Generators/GeneratorsContext";
import { MdArrowBack, MdRefresh, MdOpenInNew, MdSettingsInputComponent, MdCloudDone, MdCloudOff } from "react-icons/md";

export default function GeneratorsArea({ onBack }) {
  const { generatorsUrls } = useContext(GeneratorsContext);

  const activeServices = generatorsUrls?.filter((s) => s.active === true).length || 0;

  return (
    <div className="relative min-h-screen bg-slate-50/50 p-3 md:p-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition text-slate-600">
            <MdArrowBack size={20} />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-700 uppercase leading-none mb-1">Microservices</h2>
            <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest leading-none">Generator Endpoint Registry</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full shadow-lg">
          <div className={`w-2 h-2 rounded-full ${activeServices > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {activeServices} Services Online
          </span>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generatorsUrls?.map((checker) => {
          const isDisabled = !checker.active;

          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={checker.id}
              className={`group relative overflow-hidden bg-white p-5 rounded-2xl border transition-all shadow-sm ${
                isDisabled ? 'opacity-60 grayscale' : 'hover:shadow-md hover:border-indigo-200'
              }`}
            >
              {/* Status Bar */}
              <div className={`absolute top-0 left-0 w-full h-1 ${isDisabled ? 'bg-slate-200' : 'bg-indigo-500'}`}></div>

              <div className="flex justify-between items-start mb-6">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                  <MdSettingsInputComponent size={24} />
                </div>
                {isDisabled ? (
                   <MdCloudOff className="text-slate-300" size={20} />
                ) : (
                   <MdCloudDone className="text-emerald-500" size={20} />
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">
                  {checker.type}
                </h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  External Generator Node
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 border-t pt-4">
                {checker.isRunning ? (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                    <MdRefresh size={16} className="animate-spin" />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Processing</span>
                  </div>
                ) : (
                  <div className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-full ${
                    isDisabled ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {isDisabled ? 'Offline' : 'Ready'}
                  </div>
                )}

                <button
                  disabled={isDisabled}
                  onClick={() => !isDisabled && window.open(checker.url, "_blank")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                    isDisabled 
                      ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                      : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-md'
                  }`}
                >
                  Launch <MdOpenInNew size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* EMPTY REPOSITORY */}
      {(!generatorsUrls || generatorsUrls.length === 0) && (
        <div className="py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdCloudOff size={32} className="text-slate-300"/>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">No Microservices Detected</p>
        </div>
      )}
    </div>
  );
}