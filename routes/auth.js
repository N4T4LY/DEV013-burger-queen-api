const jwt = require("jsonwebtoken");
const config = require("../config");
const { connect } = require("../connect");
const bcrypt = require("bcrypt");
const { secret } = config;

module.exports = (app, nextMain) => {
  app.post("/login", async (req, resp, next) => {
    try {
      const { email, password } = req.body;

      // Validar si se proporcionó el email y la contraseña
      if (!email || !password) {
        return resp.status(400).json({ error: "Email and password are required" });
      }

      const db = await connect();
      const collection = db.collection("user");
      const user = await collection.findOne({ email });

      // Validar si se encontró un usuario con el email proporcionado
      if (!user) {
        return resp.status(404).json({ error: "Credentials don't match" });
      }

      // Comparar la contraseña ingresada con la contraseña del usuario
      const compare = await bcrypt.compare(password, user.password);

      // Validar si las credenciales son correctas
      if (!compare) {
        return resp.status(404).json({ error: "Credentials don't match" });
      }

      // Generar un nuevo token de autenticación
      const { _id, role } = user;
      const accessToken = jwt.sign({ _id: _id.toString(), role }, secret, { expiresIn: '1h' });

      // Enviar el token de autenticación como respuesta
      return resp.status(200).json({ ok: "User authenticated", accessToken });
    } catch (error) {
      console.log("Error", error);
      return resp.status(500).json({ error: "Internal Server Error" });
    }
  });

  return nextMain();
};