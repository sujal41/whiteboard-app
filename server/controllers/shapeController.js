const Shape = require("../models/Shape");
const whiteboardController = require("./whiteboardController");

// 🔹 CREATE SHAPE
exports.createShape = async (req, res) => {
  try {
    const boardId = req.body.whiteboardId;
    const userId = req.user.id;
    console.log(" create shape: ",boardId,userId);

    // check if this board exists or not and user is owner or collaborator
    const board = await whiteboardController.getWhiteboardByIdFromDb(boardId, userId);
    if(!board){
      return res.status(401).json({
        message: "You don't have access to this board Or This Board has been removed!",
        code: "REDIRECT_DASHBOARD"
      })
    }

    const shape = await Shape.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({ shape });
  } catch (err) {
    // res.status(500).json({ message: err.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};

// 🔹 GET SHAPES BY WHITEBOARD
exports.getShapes = async (req, res) => {
  try {
    const { whiteboardId } = req.params;
    const userId = req.user.id;

    console.log("get shapes: ",whiteboardId)

    // check if the user is owner or collaborator or not in this whiteboard
    const board = await whiteboardController.getWhiteboardByIdFromDb(whiteboardId,userId);

    if (!board) {
      return res.status(404).json({ message: "Whiteboard doesn't exists OR you don't have access to it !" });
    }

    const shapes = await Shape.find({ whiteboardId });

    res.status(200).json({ shapes });
  } catch (err) {
    // res.status(500).json({ message: err.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};

// 🔹 UPDATE SHAPE ON WHITEBOARD
exports.updateShape = async (req, res) => {
  try {
    const { shapeId } = req.params;

    const userId = req.user.id;
    console.log("this ",shapeId)
    
    // find shape and extract boardId, check if user is owner or collaborator
    const shape = await Shape.findOne({ shapeId });
    if(!shape){
      return res.status(404).json({ message: "Shape doesn't exists to update !" });
    }
    // check if the user is owner or collaborator or not in this whiteboard
    const board = await whiteboardController
                    .getWhiteboardByIdFromDb(
                      shape.whiteboardId, userId
                    );

    if (!board) {
      return res.status(404).json({ message: "Whiteboard doesn't exists OR you don't have access to it !" });
    }


    // all good, update shape

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
    // res.status(500).json({ message: err.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};

// 🔹 DELETE SHAPE ON WHITEBOARD
exports.deleteShape = async (req, res) => {
  try {
    const { shapeId } = req.params;
    const userId = req.user.id;

    console.log("this ",shapeId)
    
    // find shape and extract boardId, check if user is owner or collaborator
    const shape = await Shape.findOne({ shapeId });
    if(!shape){
      return res.status(404).json({ message: "Shape doesn't exists to update !" });
    }
    // check if the user is owner or collaborator or not in this whiteboard
    const board = await whiteboardController
                    .getWhiteboardByIdFromDb(
                      shape.whiteboardId, userId
                    );

    if (!board) {
      return res.status(404).json({ message: "Whiteboard doesn't exists OR you don't have access to it !" });
    }

    // all good, delete shape now
    const deleted = await Shape.findOneAndDelete({ shapeId });

    if (!deleted) {
      return res.status(404).json({ message: "Shape not found" });
    }

    res.status(200).json({ message: "Shape deleted" });
  } catch (err) {
    // res.status(500).json({ message: err.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};