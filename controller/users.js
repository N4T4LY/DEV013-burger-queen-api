const { ObjectId } = require("mongodb");
const { connect } = require("../connect");
const bcrypt = require("bcrypt");
const { decode } = require("jsonwebtoken");
const { isAdmin } = require("../middleware/auth");
module.exports = {
  //list user
  getUsers: async (req, res, next) => {
    // TODO: Implement the necessary function to fetch the `users` collection or table
    try {
      let { page, limit, sort, asc } = req.query;
      if (!page) page = 1;
      if (!limit) limit = 1;

      const skip = (page - 1) * 10;
      const db = await connect();
      const collection = db.collection("user");
      const cursor = await collection
        .find({})
        .sort({ sort: asc })
        .skip(skip)
        .limit(limit)
        .toArray();
      res.json(cursor);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      res
        .status(500)
        .json({ error: "Error en el servidor al obtener los usuarios" });
    }
  },

  //find user
  getUserById: async (req, res) => {
    try {
      const db = await connect();
      const collection = db.collection("user");
      const { userId } = req.params;

    
      const isEmail = validarEmail(userId);
      const isValidObjectId = ObjectId.isValid(userId);

      let user;
      if (isEmail) {
        user = await collection.findOne({ email: userId });
      } else if (isValidObjectId) {
        user = await collection.findOne({ _id: new ObjectId(userId) });
      } else {
        return res.status(400).json({ error: "Invalid user" });
      }
      // const loggedInUserId = req.uid.toString();
      // const isAdmin = req.role === "admin";

      // if (!isAdmin && uid !== loggedInUserId || uid !== req.email) {
      //   return res
      //     .status(403)
      //     .json({ error: "You are not authorized to access this user" });
      // }

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      

      const isAdmin = req.isAdmin;
      const loggedInUserId = req.uid;

      console.log("isAdmin:", isAdmin);
      console.log("loggedInUserId:", loggedInUserId);
      console.log("requestedUserId:", user._id.toString());

      if (user._id.toString() !== loggedInUserId && !isAdmin) {
        return res
          .status(403)
          .json({ error: "You are not authorized to access this user" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

 
};

function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}
// const isOwnerOrAdmin = (req, userId) => {
//  // const isAdmin = req.isAdmin;
//   const loggedInUserId = req.uid.toString();
//   const requestedUserId = userId.toString();

//   return requestedUserId === loggedInUserId || req.isAdmin;
// };

// const validatePermissions = (req, user) => {
//   const loggedInUserId = req.uid.toString();

//
//   if (user._id.toString() !== loggedInUserId && !req.isAdmin) {
//     return false;
//   }

//   return true;
// };
