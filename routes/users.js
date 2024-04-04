const bcrypt = require('bcrypt');

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getUsers,deleteUserById,getUserById, postUsers,putUser
} = require('../controller/users');
const { Collection } = require('mongodb');
const { connect } = require('../connect');

const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }

  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    role: "admin",
  };

    const db= await connect()
    const collection = db.collection("user");
    const existingAdmin= await collection.findOne({
    email:adminUser.email,
    })
    console.log(adminUser.email)

    if(!existingAdmin){
      const insertAdmin = await collection.insertOne(adminUser);
      console.log(adminUser.email)
    }

  
  // TODO: Create admin user

    // First, check if adminUser already exists in the database
   
  // If it doesn't exist, it needs to be saved



  next();
};

module.exports = (app, next) => {

  app.get('/users',requireAdmin , getUsers);
  app.delete('/users/:userId',requireAuth, deleteUserById);
  app.get('/users/:userId', requireAuth,getUserById);
  app.post('/users', requireAdmin,postUsers);
  app.put('/users/:userId', requireAuth, putUser);

 

   initAdminUser(app, next);
};
