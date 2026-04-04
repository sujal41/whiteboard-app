const mongoose = require("mongoose");

const WhiteboardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Board",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔥 Indexes for performance
WhiteboardSchema.index({ owner: 1 });
WhiteboardSchema.index({ collaborators: 1 });

module.exports = mongoose.model("Whiteboard", WhiteboardSchema);