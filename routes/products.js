const { getProducts, postProducts, getProductById, putProductById, deleteProduct } = require("../controller/products");
const { requireAuth, requireAdmin } = require("../middleware/auth");

module.exports = (app, nextMain) => {
  app.get("/products", requireAuth, getProducts);
  app.post("/products", requireAdmin, postProducts);
  app.get("/products/:productId", requireAuth, getProductById);
  app.put("/products/:productId", requireAdmin, putProductById);
  app.delete("/products/:productId", requireAdmin, deleteProduct);

  nextMain();
};