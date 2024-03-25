const { connect } = require('../connect.js');
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





};



// //find product
// getProductById: async (req, res) => {
//   try {
//     const db = await connect();
//     if (!db) {
//       return res
//         .status(500)
//         .json({ error: "Error de conexión a la base de datos" });
//     }
//     const collection = db.collection("product");
//     if (!collection) {
//       return res
//         .status(500)
//         .json({ error: "La colección de productos no existe" });
//     }
//     const { productId } = req.params;
//     if (!ObjectId.isValid(productId)) {
//       return res.status(400).json({ error: "ID de producto inválido" });
//     }
//     const cursor = await collection
//       .find({ _id: new ObjectId(productId) })
//       .toArray();
//     if (cursor.length === 0) {
//       return res.status(404).json({ error: "Producto no encontrado" });
//     }
//     console.log("🚀 ~ app.get ~ cursor:", cursor);
//     res.json(cursor);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Error en el servidor" });
//   }
// };


// put("/products/:productId", async (req, res) => {
//   try {
//     const db = await connect();
//     if (!db) {
//       return res.status(500).json({ error: "Error de conexión a la base de datos" });
//     }
    
//     const collection = db.collection("product");
//     const {productId}=req.params;
//     if (!ObjectId.isValid(productId)) {
//       return res.status(400).json({ error: "ID de producto inválido" });
//     }

//     const { name, price, image, type } = req.body;
//     if (!name || !price || !image || !type) {
//       return res.status(400).json({ error: "Todos los campos son requeridos" });
//     }

//     if (typeof price !== 'number' || price <= 0) {
//       return res.status(400).json({ error: "El precio debe ser un número positivo" });
//     }

//     const cursor = await collection.updateOne({_id:new ObjectId(productId)},{$set:{ name, price, image, type}});
//     if (cursor.modifiedCount === 0) {
//       return res.status(404).json({ error: "Producto no encontrado" });
//     }
    
//     console.log("🚀 ~ app.get ~ cursor:", cursor)
//     res.json(cursor);
//   } catch (error) {
//     console.error("Error al obtener los usuarios:", error);
//     res.status(500).json({ error: "Error en el servidor al obtener los usuarios" });
//   }
// });
