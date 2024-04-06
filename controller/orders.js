const { connect } = require('../connect.js');
const { ObjectId } = require("mongodb");
const { isAdmin, isAuthenticated } = require('../middleware/auth.js');

module.exports = {
 //list orders
  getOrders: async (req, res, next) => {
    try {
        const db = await connect();
        if (!db) {
          return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }
        const collection = db.collection("order");
        if (!collection) {
          return res.status(500).json({ error: "La colección de órdenes no existe" });
        }
  
        const cursor = await collection.find({}).toArray();
        res.json(cursor);
      } catch (error) {
       console.error("Error al obtener las órdenes:", error);
      res.status(500).json({ error: "Error en el servidor al obtener las órdenes" });
      }
  },

  
  // create orders
  postOrders: async (req, res) => {
    try {
        const { userId, client, products, status, dateEntry } = req.body; // Corregido: client en lugar de cliente
        if (!userId || !client || !products || !status || !dateEntry) {
          return res.status(400).json({ error: "Todos los campos son requeridos" });
        }
  
        if (!Array.isArray(products) || products.length === 0) {
          return res.status(400).json({ error: "La lista de productos no puede estar vacía" });
        }
  
        for (const product of products) {
          if (!product.qty || !product.product) {
            return res.status(400).json({ error: "Cada producto debe tener una cantidad y un producto asociado" });
          }
        }
  
  
        const db = await connect();
        if (!db) {
          return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }
  
        const collection = db.collection("order"); // Corregido: "order" en lugar de "orders"
        if (!collection) {
          return res.status(500).json({ error: "La colección de órdenes no existe" });
        }
  
        const result1 = await collection.insertOne({
          userId: userId,
          client: client, // Corregido: client en lugar de cliente
          products: products,
          status: status,
         
        });
        res.status(201).json({ msg: "Orden creada correctamente" }); // Corregido: mensaje de respuesta
      } catch (error) {
        console.error("Error al crear la orden:", error);
      res.status(500).json({ error: "Error en el servidor al crear la orden" });
      }
   
  },

   // find order
   getOrderById: async (req, res) => {
    try{
        const db= await connect();
        if (!db) {
          return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }
  
        const collection = db.collection("order");
        if (!collection) {
          return res.status(500).json({ error: "La colección de órdenes no existe" });
        }
  
        const {orderId}=req.params;
        if (!ObjectId.isValid(orderId)) {
          return res.status(400).json({ error: "ID de orden inválido" });
        }
  
        const cursor = await collection.find({_id:new ObjectId(orderId)}).toArray();
        if (!collection) {
          return res.status(500).json({ error: "La colección de órdenes no existe" });
        }
  
        console.log("🚀 ~ app.get ~ cursor:", cursor)
        res.json(cursor);
      }catch (error){
        console.error("Error al obtener la orden:", error);
      res.status(500).json({ error: "Error en el servidor al obtener la orden" });
        
      }
   
  },

  //insert order
  putOrderById: async (req, res) => {
    try{
        const db = await connect();
        if (!db) {
          return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }
  
        const collection = db.collection("order");
        if (!collection) {
          return res.status(500).json({ error: "La colección de órdenes no existe" });
        }
  
        const {orderId}=req.params;
        if (!ObjectId.isValid(orderId)) {
          return res.status(400).json({ error: "ID de orden inválido" });
        }
  
        const { userId, client, products, status }=req.body;
        if (!userId && !client && !products && !status) {
          return res.status(400).json({ error: "Al menos uno de los campos a actualizar es requerido" });
        }
  
        const cursor = await collection.updateOne({_id:new ObjectId(orderId)},{$set:{ userId, client, products, status}});
        if (cursor.modifiedCount === 0) {
          return res.status(404).json({ error: "Orden no encontrada" });
        }
  
        console.log("🚀 ~ app.put ~ cursor:", cursor)
        res.json(cursor);
      } catch (error){
        console.error("Error al actualizar la orden:", error);
        res.status(500).json({ error: "Error en el servidor al actualizar la orden" });
        
  
      }
   
  },

// delete order
deleteOrder: async (req, res) => {
    try {
        const db = await connect();
        if (!db) {
          return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }
  
        const collection = db.collection("order");
        if (!collection) {
          return res.status(500).json({ error: "La colección de órdenes no existe" });
        }
  
        const {orderId}=req.params;
        if (!ObjectId.isValid(orderId)) {
          return res.status(400).json({ error: "ID de orden inválido" });
        }
  
        const cursor = await collection.deleteOne({_id:new ObjectId(orderId)});
        if (cursor.deletedCount === 0) {
          return res.status(404).json({ error: "Orden no encontrada" });
        }
  
        console.log("🚀 ~ app.get ~ cursor:", cursor)
        res.json(cursor);
      } catch (error) {
        console.error("Error al eliminar la orden:", error);
      res.status(500).json({ error: "Error en el servidor al eliminar la orden" });
      }
 
}
};