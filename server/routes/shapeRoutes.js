const express = require("express");
const router = express.Router();

const {
  createShape,
  getShapes,
  updateShape,
  deleteShape,
} = require("../controllers/shapeController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createShape);
router.get("/:whiteboardId", authMiddleware, getShapes);
router.put("/:shapeId", authMiddleware, updateShape);
router.delete("/:shapeId", authMiddleware, deleteShape);

module.exports = router;