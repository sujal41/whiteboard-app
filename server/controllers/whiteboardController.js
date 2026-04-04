const Whiteboard = require("../models/Whiteboard");
const Shape = require("../models/Shape");

// 🔹 CREATE WHITEBOARD
exports.createWhiteboard = async (req, res) => {
  try {
    const { title } = req.body;

    const board = await Whiteboard.create({
      title: title || "Untitled Board",
      owner: req.user.id, // 🔐 from auth middleware
      collaborators: [],
    });

    res.status(201).json({
      message: "Whiteboard created",
      board,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET USER WHITEBOARDS
exports.getWhiteboards = async (req, res) => {
  try {
    const userId = req.user.id;

    const boards = await Whiteboard.find({
      // $or: [
        // { owner: userId },
        // { collaborators: userId },
      // ],
              owner: userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      boards,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET INVITED WHITEBOARDS
exports.getInvitedWhiteboards = async (req, res) => {
  try {
    const userId = req.user.id;

    const boards = await Whiteboard.find({
        collaborators: userId ,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      boards,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET SINGLE WHITEBOARD
exports.getWhiteboardById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await Whiteboard.findOne({
      _id: id,
      $or: [
        { owner: userId },
        { collaborators: userId },
      ],
    }).populate("collaborators", "name email");

    if (!board) {
      return res.status(404).json({ message: "Whiteboard not found" });
    }

    res.status(200).json({ board });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 CREATE SHAPE
exports.createShape = async (req, res) => {
  try {
    const shape = await Shape.create({
      ...req.body,
      user: req.user.id,
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

    const shapes = await Shape.find({ whiteboard: whiteboardId });

    res.status(200).json({ shapes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCollaborator = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { userId } = req.body;

    const board = await Whiteboard.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // avoid duplicates
    if (board.collaborators.includes(userId)) {
      return res.status(400).json({ message: "User already added" });
    }

    board.collaborators.push(userId);
    await board.save();

    res.json({ message: "User invited", board });


    res.json({ board });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};