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
