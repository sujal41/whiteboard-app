const mongoose = require("mongoose");

const ShapeSchema = new mongoose.Schema(
  {
    // 🔥 UNIQUE SHAPE ID (frontend UUID)
    shapeId: {
      type: String,
      required: true,
    },

    // 🔥 LINK TO WHITEBOARD
    whiteboardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Whiteboard",
      required: true,
      index: true,
    },

    type: {
    type: String,
    enum: ["rect", "circle", "line"],
    required: true,
    },
    points: [Number], // [x1, y1, x2, y2]  for line support

    x: Number,
    y: Number,

    width: Number,
    height: Number,
    radius: Number,
    rotation:  {
      type: Number,
      default: 0,
    },

    fill: {
      type: String,
      default: "#000000",
    },

    stroke: {
      type: String,
      default: "#000000",
    },

    strokeWidth: {
      type: Number,
      default: 3,
    },

    // 👤 WHO CREATED
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✏️ LAST UPDATED
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { 
    collection: "shape",
    timestamps: true 
}
);

// 🔥 Critical indexes for performance
// ShapeSchema.index({ whiteboardId: 1 });
// ShapeSchema.index({ shapeId: 1 });
ShapeSchema.index({ whiteboardId: 1, shapeId: 1 });

module.exports = mongoose.model("Shape", ShapeSchema);