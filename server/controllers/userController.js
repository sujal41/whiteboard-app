const User = require("../models/User");

// 🔹 GET ALL USERS (simple)
exports.getUsers = async (req, res) => {
  try {
    const thisUser = req.user.id;
    
  const users = await User.find({
    _id: { $ne: thisUser }
  }).select("_id name email");

    res.json({ users });
  } catch (err) {
    // res.status(500).json({ message: err.message });
    console.log(err);
    return res.status(500).json({ message: "something went wrong ! please try again later." });
  }
};