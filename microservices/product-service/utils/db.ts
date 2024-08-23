
import { MongoClient } from 'mongodb';
require('dotenv').config();

const url: string = "mongodb+srv://innovia1mind:QGrBmFAlKNjmfljU@cluster1.sxkesip.mongodb.net/" || '';
const dbName = 'test';
let db: any;



const connectDB = async () => {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log('MongoDB connected');
};


export { connectDB, db };
