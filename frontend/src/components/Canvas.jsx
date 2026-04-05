import { Stage, Layer, Rect, Circle, Transformer, Line } from "react-konva";
import { useRef, useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import socket from "../socket";
import { WhiteBoardContext } from "../context/WhiteBoardContext";

export default function Canvas({
  shapes,
  setShapes,
  tool,
  selectedId,
  setSelectedId,
    updateShape, // ✅ from parent
}) {
  const shapeRef = useRef();
  const trRef = useRef();

  const navigate = useNavigate();

  const { board } = useContext(WhiteBoardContext);

  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);

  const { id } = useParams();

  // 🔥 Attach transformer
  useEffect(() => {
    if (selectedId && shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.rotateEnabled(true);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  useEffect(() => {
    socket.emit("join-board", id);
    }, [id]);

  // 🖱️ START DRAW
  const handleMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (!clickedOnEmpty) return;

    const pos = e.target.getStage().getPointerPosition();

    setIsDrawing(true);

    const base = {
      shapeId: Date.now().toString(),
      whiteboardId: id,
      type: tool,
    };

    if (tool === "line") {
      setNewShape({
        ...base,
        points: [pos.x, pos.y, pos.x, pos.y],
        stroke: "#FFFFFF",
        strokeWidth: 3,
        rotation: 0
      });
    } else {
      setNewShape({
        ...base,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        radius: 0,
        fill: "blue",
        rotation: 0,
      });
    }

    setSelectedId(null);
  };

  // 🖱️ DRAWING
  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const pos = e.target.getStage().getPointerPosition();

    setNewShape((prev) => {
      if (!prev) return prev;

      if (prev.type === "line") {
        return {
          ...prev,
          points: [prev.points[0], prev.points[1], pos.x, pos.y],
        };
      }

      if (prev.type === "circle") {
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        return { ...prev, radius: Math.sqrt(dx * dx + dy * dy) };
      }

      return {
        ...prev,
        // rotate: prev.rotate,
        width: pos.x - prev.x,
        height: pos.y - prev.y,
      };
    });
  };

  // 🖱️ END DRAW
  const handleMouseUp = async () => {
    setIsDrawing(false);

    if (!newShape) return;

  const finalShape = {
    ...newShape,
    shapeId: newShape.shapeId,
    whiteboardId: id,
  };

  setShapes((prev) => [...prev, finalShape]);
  setNewShape(null);


    try {
      await API.post("/shapes", finalShape );
    } catch (err) {
      console.error(err.response?.data || err.message);
      if(err?.response?.data?.code === "REDIRECT_DASHBOARD") {
        alert(err?.response?.data?.message);
        // navigate to dashboard , this user don't have access to this board
        navigate("/dashboard");
      }else{
        alert(err?.response?.data?.message);
      }
    }

    // 🔥 SOCKET EMIT (HERE)
    socket.emit("shape:create", {
        boardId: id,
        shape: finalShape,
    });
  };


  // NAV ~58px + CONTROLS ROW ~50px = 108px chrome
  const CHROME = 108;
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: Math.max(300, window.innerHeight - CHROME),
  });
 
  useEffect(() => {
    const update = () =>
      setSize({
        width: window.innerWidth,
        height: Math.max(300, window.innerHeight - CHROME),
      });
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
 
  return (
    <div
      className="w-full h-full touch-none"
      style={{ touchAction: "none" }}
    >
      <Stage
        width={size.width}
        height={size.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
 
          {shapes.map((shape) => {
            const commonProps = {
              draggable: true,
              ref: selectedId === shape.shapeId ? shapeRef : null,
              onClick: (e) => { e.cancelBubble = true; setSelectedId(shape.shapeId); },
              onTap: (e) => { e.cancelBubble = true; setSelectedId(shape.shapeId); },
              onDragEnd: (e) => {
                updateShape({ ...shape, x: e.target.x(), y: e.target.y() });
              },
              onTransformEnd: (e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const updated = {
                  ...shape,
                  x: node.x(),
                  y: node.y(),
                  width: shape.width ? Math.max(5, shape.width * scaleX) : undefined,
                  height: shape.height ? Math.max(5, shape.height * scaleY) : undefined,
                  radius: shape.radius ? shape.radius * scaleX : undefined,
                  rotation: node.rotation(),
                };
                node.scaleX(1);
                node.scaleY(1);
                updateShape(updated);
              },
            };
 
            if (shape.type === "rect") return (
              <Rect key={shape.shapeId}
                x={shape.x} y={shape.y}
                width={shape.width} height={shape.height}
                fill={shape.fill} rotation={shape.rotation || 0}
                {...commonProps}
              />
            );
 
            if (shape.type === "circle") return (
              <Circle key={shape.shapeId}
                x={shape.x} y={shape.y}
                radius={shape.radius} fill={shape.fill}
                rotation={shape.rotation || 0}
                {...commonProps}
              />
            );
 
            if (shape.type === "line") return (
              <Line key={shape.shapeId}
                points={shape.points}
                stroke={shape.stroke || "#FFFFFF"}
                rotation={shape.rotation || 0}
                strokeWidth={shape.strokeWidth || 3}
                {...commonProps}
                onDragEnd={(e) => {
                  const node = e.target;
                  const dx = node.x(), dy = node.y();
                  const newPoints = shape.points.map((p, i) => i % 2 === 0 ? p + dx : p + dy);
                  node.position({ x: 0, y: 0 });
                  updateShape({ ...shape, points: newPoints });
                }}
              />
            );
 
            return null;
          })}
 
          {/* Preview */}
          {newShape && (
            newShape.type === "line" ? (
              <Line {...newShape} stroke={newShape.stroke || "#FFFFFF"} />
            ) : newShape.type === "circle" ? (
              <Circle x={newShape.x} y={newShape.y} radius={newShape.radius} fill={newShape.fill} />
            ) : (
              <Rect {...newShape} />
            )
          )}
 
          {selectedId && <Transformer ref={trRef} />}
 
        </Layer>
      </Stage>
    </div>
  );
}