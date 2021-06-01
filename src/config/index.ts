import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT ? process.env.PORT : 3000,
    NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
    MONGO_URL: process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME ? process.env.DB_NAME : 'users',
}