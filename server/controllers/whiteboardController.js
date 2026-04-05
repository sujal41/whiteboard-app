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
    // res.status(500).json({ message: error.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};

// 🔹 RENAME WHITEBOARD NAME
exports.renameWhiteboardTitle = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const { title } = req.body;
    const userId = req.user.id;

    console.log(boardId, title, userId);

    // 🔒 Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title cannot be empty",
      });
    }

      // 🔍 Find & update (only if user is owner)
    const updatedBoard = await Whiteboard.findOneAndUpdate(
      {
        _id: boardId,
        owner: userId, // ✅ ensures only owner can rename
      },
      {
        title: title.trim(),
      },
      {
        new: true, // return updated doc
      }
    );

    // ❌ Board not found or not allowed
    if (!updatedBoard) {
      return res.status(404).json({
        message: "Board not found or unauthorized",
      });
    }

    // see if whiteboard exists 
    // update it useing findoneand updated

    return res.status(200).json({
      message: "board title rename successfully"
    });
  } catch (error) {
    // res.status(500).json({ message: error.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
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
    // res.status(500).json({ message: error.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};

// 🔹 GET INVITED WHITEBOARDS
exports.getInvitedWhiteboards = async (req, res) => {
  try {
    const userId = req.user.id;

    const boards = await Whiteboard.find({
        collaborators: userId ,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      boards,
    });
  } catch (error) {
    // return res.status(500).json({ message: error.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};

// 🔹 GET SINGLE WHITEBOARD
exports.getWhiteboardById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await this.getWhiteboardByIdFromDb(id, userId);

    if (!board) {
      return res.status(404).json({ message: "Whiteboard not found" });
    }

    res.status(200).json({ board });
  } catch (error) {
    // res.status(500).json({ message: error.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};

exports.getWhiteboardByIdFromDb = async( id, userId ) => {
  const board = await Whiteboard.findOne({
      _id: id,
      $or: [
        { owner: userId },
        { collaborators: userId },
      ],
    })
    .populate("collaborators", "name email")
    .populate("owner", "name email");

  return board;
}

// 🔹 CREATE SHAPE
// exports.createShape = async (req, res) => {
//   try {
//     const shape = await Shape.create({
//       ...req.body,
//       user: req.user.id,
//     });

//     res.status(201).json({ shape });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🔹 GET SHAPES BY WHITEBOARD
// exports.getShapes = async (req, res) => {
//   try {
//     const { whiteboardId } = req.params;

//     const shapes = await Shape.find({ whiteboard: whiteboardId });

//     res.status(200).json({ shapes });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.addCollaborator = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { userId } = req.body;

    const board = await Whiteboard.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // check if this user is owner or not, then only allow to add others
    console.log("compare: ",board.owner, " - ", req.user.id)
    if(board.owner.toString() !== req.user.id){
      return res.status(401).json({ message: "Only Owner can add other users !" });
    }

    // avoid duplicates
    if (board.collaborators.includes(userId)) {
      return res.status(400).json({ message: "User already added" });
    }

    board.collaborators.push(userId);
    await board.save();

    // 🔥 SEND SOCKET NOTIFICATION
    const io = global.io;

    io.to(userId).emit("notification", {
      type: "INVITE",
      boardId: board._id,
      boardTitle: board.title,
      message: `You were invited to ${board.title}`,
    });

    return res.json({ message: "User invited", board });

  } catch (err) {
    // res.status(500).json({ message: err.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};

exports.removeCollaborator = async (req, res) => {
  try {
    const { boardId, userId } = req.body;

    console.log(boardId, userId)
    const board = await Whiteboard.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // check if this user is owner or not, then only allow to add others
    console.log("compare: ",board.owner, " - ", req.user.id)
    if(board.owner.toString() !== req.user.id){
      return res.status(401).json({ message: "Only Owner can remove collaborators !" });
    }

    // check if user exists in collaborators
    if (!board.collaborators.includes(userId)) {
      return res.status(400).json({ message: "User not a collaborator" });
    }

    // remove user
    board.collaborators = board.collaborators.filter(
      (id) => id.toString() !== userId
    );

    await board.save();

    // emmiting event to redirect user to dashboard if he is in the whiteboard
    const io = global.io;

    io.to(userId).emit("board:removed", {
      boardId,
      message: `You were removed from ${board.title}`,
    });


    return res.json({ message: "User removed", board });

  } catch (err) {
    // return res.status(500).json({ message: err.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};