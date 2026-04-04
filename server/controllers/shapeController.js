const Shape = require("../models/Shape");

// 🔹 CREATE SHAPE
exports.createShape = async (req, res) => {
  try {
    const shape = await Shape.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({ shape });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 GET SHAPES BY WHITEBOARD
exports.getShapes = async (req, res) => {
  try {
    const { whiteboardId } = req.params;

    const shapes = await Shape.find({ whiteboardId });

    res.status(200).json({ shapes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 UPDATE SHAPE ON WHITEBOARD
exports.updateShape = async (req, res) => {
  try {
    const { shapeId } = req.params;

    console.log("this ",shapeId)
    const updated = await Shape.findOneAndUpdate(
      { shapeId },
      {
        ...req.body,
        lastUpdatedBy: req.user.id,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Shape not found" });
    }

    res.status(200).json({ shape: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 DELETE SHAPE ON WHITEBOARD
exports.deleteShape = async (req, res) => {
  try {
    const { shapeId } = req.params;

    const deleted = await Shape.findOneAndDelete({ shapeId });

    if (!deleted) {
      return res.status(404).json({ message: "Shape not found" });
    }

    res.status(200).json({ message: "Shape deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};