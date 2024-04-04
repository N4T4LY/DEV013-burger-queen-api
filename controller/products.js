const { connect } = require('../connect.js');
const { ObjectId } = require("mongodb");
const { isAdmin, isAuthenticated } = require('../middleware/auth.js');

module.exports = {
  // Ver los productos
  getProducts: async (req, res, next) => {
    try {
      // Verificar si el usuario está autenticado
      if (!isAuthenticated(req)) {
        return res.status(401).json({ error: "is not authenticated" });
      }

      // Conectar a la base de datos
      const db = await connect();
      if (!db) {
        return res.status(500).json({ error: "Database connection error" });
      }

      // Obtener la colección de productos y devolverlos
      const collection = db.collection("product");
      const cursor = await collection.find({}).toArray();
      res.json(cursor);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "there was an error on the server" });
    }
  },

  
  // Crear producto
  postProducts: async (req, res) => {
    try {
      // Obtener datos del cuerpo de la solicitud
      const { name, price, image, type } = req.body;
  
      // Validar el rol de administrador
      if (!isAdmin(req)) {
        return res.status(403).json({ error: "You are not authorized to create products" });
      }
  
      // Validar campos requeridos
      if (!name || !price || !image || !type) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Validar precio (número y positivo)
      if (typeof price !== "number" || price <= 0) {
        return res.status(400).json({ error: "The price must be a positive number" });
      }
  
      // Conectar a la base de datos
      const db = await connect();
      const collection = db.collection("product");
  
      // Verificar si el producto ya existe
      // const existingProduct = await collection.findOne({ name: name });
      // if (existingProduct) {
      //   return res.status(400).json({ error: "El producto ya existe en la BD" });
      // }
  
      // Obtener la fecha actual
      const currentDate = new Date().toLocaleString();
  
      // Insertar el nuevo producto
      const result = await collection.insertOne({
        name: name,
        price: price,
        image: image,
        type: type,
        dateEntry: currentDate,
      });
  
      // Retornar el producto creado con su ID
      res.status(200).json({ _id: result.insertedId, ...req.body, msg: "The product was created successfully." });
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: "there was an error on the server" });
    }
  },

 


};