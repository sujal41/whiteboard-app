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
  
  // no need here s passed from parent directly
    // const deleteShape = () => {
    //   setShapes((prev) => prev.filter((s) => s.id !== selectedId));
    //   setSelectedId(null);
    // };

    const changeColor = (color) => {
      if (!selectedId) return;

      const selectedShape = shapes.find(
        (s) => s.shapeId === selectedId
      );

      if (!selectedShape) return;

      let updated;

      if (selectedShape.type === "line") {
        updated = {
          ...selectedShape,
          stroke: color,
        };
      } else {
        updated = {
          ...selectedShape,
          fill: color,
        };
      }

      updateShape(updated); // 🔥 THIS IS KEY
    };

  return (
    <div className="flex flex-wrap gap-3 mb-4 items-center">
      
      {/* Tools */}
      <button
        onClick={() => setTool("rect")}
        className={`px-4 py-2 rounded ${
          tool === "rect" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Rectangle
      </button>

      <button
        onClick={() => setTool("circle")}
        className={`px-4 py-2 rounded ${
          tool === "circle" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Circle
      </button>

      <button
        onClick={() => setTool("line")}
        className={`px-4 py-2 rounded ${
            tool === "line" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        >
        Line
        </button>

      {/* Color Picker */}
      {selectedId && (
        <div className="flex gap-2 ml-4">
          <div onClick={() => changeColor("red")} className="w-6 h-6 bg-red-500 rounded cursor-pointer" />
          <div onClick={() => changeColor("blue")} className="w-6 h-6 bg-blue-500 rounded cursor-pointer" />
          <div onClick={() => changeColor("green")} className="w-6 h-6 bg-green-500 rounded cursor-pointer" />
        </div>
      )}

      {/* Delete */}
      {selectedId && (
        <button
          onClick={() => deleteShape(selectedId)}
          disabled={!selectedId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete
        </button>
      )}
    </div>
  );
}