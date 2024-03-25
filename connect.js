const config = require('./config');
//importo MongoClient 
const {MongoClient}=require('mongodb');

// eslint-disable-next-line no-unused-vars
const { dbUrl } = config;
//creo el cliente 
const client = new MongoClient(dbUrl)
async function connect() {
  // TODO: Database Connection
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db("bqDatabase");
    return db;
  }catch(error){
    console.log("🚀 ~ connect ~ error:", error)
    
  }
}

module.exports = { connect };
