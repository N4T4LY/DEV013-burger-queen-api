const { connect } = require('../connect.js');
const { ObjectId } = require("mongodb");
const { isAdmin, isAuthenticated } = require('../middleware/auth.js');

module.exports = {
  // Ver los productos
  getProducts: async (req, res, next) => {
    try {
      
      if (!isAuthenticated(req)) {
        return res.status(401).json({ error: "is not authenticated" });
      }

     
      const db = await connect();
      if (!db) {
        return res.status(500).json({ error: "Database connection error" });
      }

      
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
     
      const { name, price, image, type } = req.body;
  
    
      if (!isAdmin(req)) {
        return res.status(403).json({ error: "You are not authorized to create products" });
      }
  
      if (!name || !price || !image || !type) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      
      if (typeof price !== "number" || price <= 0) {
        return res.status(400).json({ error: "The price must be a positive number" });
      }
  
     
      const db = await connect();
      const collection = db.collection("product");
  
      // Verificar si el producto ya existe
      // const existingProduct = await collection.findOne({ name: name });
      // if (existingProduct) {
      //   return res.status(400).json({ error: "El producto ya existe en la BD" });
      // }
  
      
      const currentDate = new Date().toLocaleString();
  
     
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

  getProductById: async (req, res) => {
    try {
      const db = await connect();
      const collection = db.collection("product");
      const { productId } = req.params;
      let product;
  
      // Verificar si el productId es un ObjectId válido
      try {
        const objectId = new ObjectId(productId);
        console.log("PRODUCT", objectId);
        product = await collection.findOne({ _id: objectId });
      } catch (error) {
        // Si hay un error al convertir el productId a ObjectId, devuelve 404
        return res.status(404).json({ error: "Product not found" });
      }
  
      if (!product) {
        // Si no se encuentra el producto, devuelve 404
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.json(product);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "There was an error on the server" });
    }
  },
  putProductById: async (req, res) => {
    try {
      const db = await connect();
      const collection = db.collection("product");
      const { productId } = req.params;
  
      // Verificar si el usuario es administrador
      const admin = isAdmin(req);
      if (!admin) {
        return res.status(403).json({ error: "You are not authorized to do this" });
      }
  
      let product;
  
      try {
        const objectId = new ObjectId(productId);
        console.log("PRODUCT", objectId);
        product = await collection.findOne({ _id: objectId });
      } catch (error) {
        // Si hay un error al convertir el productId a ObjectId, devuelve 404
        return res.status(404).json({ error: "Product not found" });
      }
  
      if (!product) {
        // Si no se encuentra el producto, devuelve 404
        return res.status(404).json({ error: "Product not found" });
      }
  
      const { price } = req.body;
  
      // Si el precio se proporciona en el cuerpo de la solicitud, actualizar el producto
      if (price !== undefined) {
        // Validar precio (número y positivo)
        if (typeof price !== 'number' || price <= 0) {
          return res.status(400).json({ error: "The price must be a positive number" });
        }
  
        // Actualizar el precio del producto en la base de datos
        await collection.updateOne(
          { _id: new ObjectId(productId) },
          { $set: { price } }
        );
  
        // Devolver estado 200 para indicar que la actualización fue exitosa
        return res.status(200).json({ msg: "Successfully updated product" });
      }
  
      // Si no se proporciona un precio en el cuerpo de la solicitud, no se realiza ninguna actualización
      res.json({ msg: "No updates performed" });
  
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "There was an error on the server" });
    }
  },
  

// Eliminar producto por ID
deleteProduct: async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    

    // Conectar a la base de datos
    const db = await connect();
    const collection = db.collection("product");

    const { productId } = req.params;

    // Validar formato de ID de producto
    // if (!ObjectId.isValid(productId)) {
    //   return res.status(400).json({ error: "ID invalid" });
    // }
    
    const admin = isAdmin(req);
    if (!admin) {
      return res.status(403).json({ error: "You are not authorized to do this" });
    }


  let product;

  try {
    const objectId = new ObjectId(productId);
    console.log("PRODUCT", objectId);
    product = await collection.findOne({ _id: objectId });
  } catch (error) {
    // Si hay un error al convertir el productId a ObjectId, devuelve 404
    return res.status(404).json({ error: "Product not found" });
  }


    // Eliminar el producto
    const cursor = await collection.deleteOne({ _id: new ObjectId(productId) });

   

    // Producto eliminado exitosamente
    res.json({ msg: "Successfully deleted product" });
  } catch (error) {
  
    res.status(500).json({ error: "You are not authorized to do this" });
  }
}
};