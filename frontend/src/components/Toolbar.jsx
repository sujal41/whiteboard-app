import { useState } from "react";
import { Pipette } from "lucide-react";


export default function Toolbar({
  tool,
  setTool,
  selectedId,
  shapes,
  setShapes,
  setSelectedId,
  updateShape,
  deleteShape
}) {

  const [customColor, setCustomColor] = useState("#4ECDC4");

  const changeColor = (color) => {
    if (!selectedId) return;

    const selectedShape = shapes.find(
      (s) => s.shapeId === selectedId
    );

    if (!selectedShape) return;

    const updated =
      selectedShape.type === "line"
        ? { ...selectedShape, stroke: color }
        : { ...selectedShape, fill: color };

    updateShape(updated);
  };

  const tools = [
    { name: "rect", label: "⬛" },
    { name: "circle", label: "⚪" },
    { name: "line", label: "📏" }
  ];

  const presetColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFE66D",
    "#1A535C",
    "#FFFFFF"
  ];

  return (
    <div className="
  flex items-center gap-2 
  p-2 rounded-xl 
  bg-white/[0.04] border border-white/[0.08] backdrop-blur-md
  overflow-x-auto scrollbar-hide
">
  
  {/* Tools */}
  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
    {tools.map((t) => (
      <button
        key={t.name}
        onClick={() => setTool(t.name)}
        className={`
          flex items-center justify-center
          px-2 sm:px-3 py-1 sm:py-1.5
          text-xs sm:text-sm
          rounded-md sm:rounded-lg
          transition-all
          ${tool === t.name
            ? "bg-[#4ECDC4] text-black"
            : "bg-white/[0.06] text-white/70"
          }
        `}
      >
        {t.label}
      </button>
    ))}
  </div>

  {/* Divider */}
  <div className="hidden sm:block w-px h-5 bg-white/[0.08]" />

  {/* Color Picker */}
  {selectedId && (
    <div className="flex items-center gap-2 flex-shrink-0">

      {/* Label (optional for desktop) */}
      <span className="hidden sm:block text-xs text-white/50">
        Color
      </span>

      {/* Preset Colors */}
      <div className="flex items-center gap-1 sm:gap-2">
        {presetColors.map((c) => (
          <div
            key={c}
            onClick={() => changeColor(c)}
            className="
              w-5 h-5 sm:w-6 sm:h-6 
              rounded cursor-pointer 
              border border-white/10
              hover:scale-110 transition
            "
            style={{ background: c }}
          />
        ))}
      </div>

      {/* Custom Color Picker with Icon */}
      <label className="relative cursor-pointer group">
        
        <div className="
          w-6 h-6 sm:w-8 sm:h-8 
          rounded-md border border-white/10 
          flex items-center justify-center
          bg-white/[0.05] hover:bg-white/[0.1] 
          transition
        ">
          <Pipette size={14} className="text-white/70" />
        </div>

        <input
          type="color"
          value={customColor}
          onChange={(e) => {
            setCustomColor(e.target.value);
            changeColor(e.target.value);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

    </div>
  )}

  {/* Divider */}
  {selectedId && <div className="hidden sm:block w-px h-5 bg-white/[0.08]" />}

  {/* Delete */}
  {selectedId && (
    <button
      onClick={() => deleteShape(selectedId)}
      className="
        flex-shrink-0
        px-2 sm:px-3 py-1 sm:py-1.5
        text-xs sm:text-sm
        rounded-md sm:rounded-lg
        bg-red-500/80 hover:bg-red-500
      "
    >
      ✕
    </button>
  )}
</div>
  );
}