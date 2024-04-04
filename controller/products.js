const { connect } = require('../connect.js');
const { ObjectId } = require("mongodb");
const { isAdmin, isAuthenticated } = require('../middleware/auth.js');

module.exports = {
  // Ver los productos
  getProducts: async (req, res, next) => {
    try {
      // Verificar si el usuario está autenticado
      if (!isAuthenticated(req)) {
        return res.status(401).json({ error: "No autenticado" });
      }

      // Conectar a la base de datos
      const db = await connect();
      if (!db) {
        return res.status(500).json({ error: "Error de conexión a la base de datos" });
      }

      // Obtener la colección de productos y devolverlos
      const collection = db.collection("product");
      const cursor = await collection.find({}).toArray();
      res.json(cursor);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  },

};