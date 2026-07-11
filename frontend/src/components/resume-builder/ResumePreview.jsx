import { useState } from "react";
import ModernATS from "./templates/ModernATS";

export default function ResumePreview({ data }) {
  const [zoom, setZoom] = useState(85); // Default visual zoom level

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 h-[calc(100vh-180px)] flex flex-col overflow-hidden font-sans">
      {/* Dynamic Interactive Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-zinc-300" />
          <div className="h-4 w-[1px] bg-zinc-200 mx-1" />
          <p className="text-sm font-medium text-zinc-600">ATS Document Canvas</p>
        </div>

        {/* Zoom Engine & PDF Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-lg p-0.5">
            <button 
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="px-2 py-1 text-xs font-semibold text-zinc-600 hover:bg-white rounded transition-all shadow-none hover:shadow-sm select-none"
            >
              -
            </button>
            <span className="text-xs font-medium text-zinc-500 min-w-[45px] text-center select-none">
              {zoom}%
            </span>
            <button 
              onClick={() => setZoom(Math.min(120, zoom + 10))}
              className="px-2 py-1 text-xs font-semibold text-zinc-600 hover:bg-white rounded transition-all shadow-none hover:shadow-sm select-none"
            >
              +
            </button>
          </div>

        </div>
      </div>

      {/* Blueprint Canvas Viewport */}
      <div 
        className="flex-1 overflow-auto bg-zinc-100/60 rounded-xl flex justify-center items-start p-6"
        style={{
          backgroundImage: "radial-gradient(#e4e4e7 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }}
      >
        <div
          style={{ transform: `scale(${zoom / 100})` }}
          className="
            bg-white 
            shadow-[0_16px_40px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] 
            w-[794px] 
            min-h-[1123px] 
            origin-top 
            transition-transform 
            duration-200 
            ease-out
            border 
            border-zinc-200/50
          "
        >
          <ModernATS data={data} />
        </div>
      </div>
    </div>
  );
}