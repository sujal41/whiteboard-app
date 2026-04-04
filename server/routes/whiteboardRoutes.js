const express = require("express");
const router = express.Router();

const { createWhiteboard, getWhiteboards, getWhiteboardById, addCollaborator, getInvitedWhiteboards, removeCollaborator } = require("../controllers/whiteboardController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔐 Protected route
router.post("/create", authMiddleware, createWhiteboard);
router.get("/", authMiddleware, getWhiteboards);
router.get("/invited", authMiddleware, getInvitedWhiteboards);
router.get("/:id", authMiddleware, getWhiteboardById);
router.post("/:boardId/invite", authMiddleware, addCollaborator);
router.post("/remove-collaborator", authMiddleware, removeCollaborator);


module.exports = router;