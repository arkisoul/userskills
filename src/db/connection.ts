import {MongoClient, Db} from 'mongodb';

import {config} from '../config';
import {logger} from '../middleware';

const url = config.MONGO_URL;
const dbName = config.DB_NAME;

type dbConnect = {
    db: Db,
    client: MongoClient
}

export const db = async (): Promise<dbConnect> => {
    return new Promise((resolve, reject)  => {
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
            if(err) {
                logger.error(`Could not connect to the database ${err.message}`);
                reject(`Could not connect to the database ${err.message}`);
            }
            logger.info(`Successfully connected to the database`);
        
            const db = client.db(dbName);
            resolve({db, client});
        })
    })
}