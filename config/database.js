

const Appwrite = require('node-appwrite');



const appwriteClient = new Appwrite.Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_API_KEY);

const account = new Appwrite.Account(appwriteClient);
const databases = new Appwrite.Databases(appwriteClient);
const ID = Appwrite.ID; 

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = process.env.VITE_APPWRITE_USERS_COLLECTION_ID;

module.exports = {
  account,
  databases,
  ID,
  DATABASE_ID,
  USERS_COLLECTION_ID
};