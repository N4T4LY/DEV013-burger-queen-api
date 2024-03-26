const { ObjectId } = require("mongodb");
const { connect } = require("../connect");
const bcrypt = require('bcrypt');
module.exports = {
  //list user
  getUsers: async (req, res, next) => {
    // TODO: Implement the necessary function to fetch the `users` collection or table
    try{
      const db=await connect();
      const collection=db.collection("user");
      const cursor=await collection.find({}).toArray();
      res.json(cursor);

    }catch(error){
      console.error("Error al obtener los usuarios:",error);
      res.status(500).json({error:"Error en el servidor al obtener los usuarios"});

    }
  },

  //insert user
  postUsers: async (req, res, next)=>{
    try{
      const db = await connect();
      const collection = db.collection("user");
      const { email, password, role } = req.body;
      const saltRounds=10;
      const salt = await bcrypt.genSalt(saltRounds);
     console.log("salt",salt);
      const hashedPassword=await bcrypt.hash(password,salt);
      console.log("salt",hashedPassword);
      const cursor = await collection.insertOne({
        email:email, 
        password: hashedPassword, 
        role:role

      });
      res.json(cursor);
    }catch(error){
      console.log("🚀 ~ postUsers: ~ error:", error)
      
    }
  },

  //delete user
  deleteUserById: async (req,res, next)=>{
    try{
      const db = await connect();
      const collection =db.collection("user")
      const {userId}=req.params;
      const cursor=await collection.deleteOne({_id: new ObjectId(userId)});
    
    res.json({msg: "usuario eliminado correctamente"})

    }catch(error){
    }
   },

   //find user
   getUserById: async(req,res,next)=>{
    try {
      const db = await connect();
      const collection =db.collection("user")
      const {userId}=req.params;
      const cursor = await collection.find({_id: new ObjectId(userId)}).toArray();
      res.json(cursor)
    } catch (error) {
      res.status(500).json({error:"error"})
    }
   },

   //set user
   putUser: async(req,res,next)=>{

   }


   


  
};
