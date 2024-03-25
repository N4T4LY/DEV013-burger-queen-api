const { connect } = require('../connect.js');
const {ObjectId}=require("mongodb")
module.exports = {
  //see products
  getProducts: async (req, res, next) => {
    try {
      const db = await connect();
      if (!db) {
        return res
          .status(500)
          .json({ error: "Error de conexión a la base de datos" });
      }
      const collection = db.collection("product");
      const cursor = await collection.find({}).toArray();
      res.json(cursor);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  },

  //create product

postProducts: async (req, res) => {
  try {
    const { name, price, image, type } = req.body;
    if (!name || !price || !image || !type) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    if (typeof price !== "number" || price <= 0) {
      return res
        .status(400)
        .json({ error: "El precio debe ser un número positivo" });
    }

    
    const db = await connect();
    const collection = db.collection("product");
    const existingProduct = await collection.findOne({name:name});
    if(existingProduct){
      return res.status(400).json({error: "El producto ya existe en la BD"})
    }
    
    const date=new Date();
    const currentDate=date.toLocaleString()

    const result = await collection.insertOne({
      name: name,
      price: price,
      image: image,
      type: type,
      dateEntry: currentDate,
    });
    res.json({result, msg: "se creo correctamente" });
  } catch (error) {
    console.error("Error ", error);
    res.status(500).json({ error: "Error en el servidor " });
  }
},

//find product
getProductById: async (req, res) => {
  try {
    const db = await connect();
    const collection = db.collection("product");
    const { productId } = req.params;
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "ID de producto inválido" });
    }
    const cursor = await collection
      .find({ _id:new ObjectId(productId) })
      .toArray();
    if (cursor.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    console.log("🚀 ~ app.get ~ cursor:", cursor);
    res.json(cursor);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
},

//set product
putProductById: async (req, res) => {
  try {
    const db = await connect();
   

    const collection = db.collection("product");
    const {productId}=req.params;
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "ID de producto inválido" });
    }

    const { name, price, image, type } = req.body;
    if (!name || !price || !image || !type) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: "El precio debe ser un número positivo" });
    }

    const cursor = await collection.updateOne({_id:new ObjectId(productId)},{$set:{ name, price, image, type}});
    if (cursor.modifiedCount === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    console.log("🚀 ~ app.get ~ cursor:", cursor)
    res.json(cursor);
  } catch (error) {
    console.error("Error al conectar los productos:", error);
    res.status(500).json({ error: "Error" });
  }
},

deleteProduct: async (req, res) => {
  try {
    const db = await connect();
    const collection = db.collection("product");
    
    const {productId}=req.params;
    const cursor = await collection.deleteOne({_id:new ObjectId(productId)});
    if (cursor.deletedCount === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    console.log("🚀 ~ app.get ~ cursor:", cursor)
    res.json({ msg: "Producto eliminado correctamente" });
  } catch (error) {
    
    console.error("Error al eliminar el producto:", error);
  res.status(500).json({ error: "Error en el servidor al eliminar el producto" });
  }
},



};






