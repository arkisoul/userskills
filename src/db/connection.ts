import { MongoClient, Db } from 'mongodb';

import { config } from '../config';
import { logger } from '../middleware';
import { User } from '../models';

const url = config.MONGO_URL;
const dbName = config.DB_NAME;
const USER_COLLECTION = 'users';

/* export const db = (async (): Promise<Db> => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                logger.error(`Could not connect to the database ${err.message}`);
                reject(`Could not connect to the database ${err.message}`);
            }
            logger.info(`Successfully connected to the database`);

            const db = client.db(dbName);
            resolve(db);
        })
    })
})(); */

class MongoDb {
  public db!: Db;
  private url: string;
  private dbname: string;

  constructor(url: string, dbname: string) {
    this.url = url;
    this.dbname = dbname;
  }

  async connect() {
    await (async (): Promise<null> => {
      return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
          if (err) {
            logger.error(`Could not connect to the database ${err.message}`);
            reject(`Could not connect to the database ${err.message}`);
          }
          logger.info(`Successfully connected to the database`);

          this.db = client.db(dbName);
          resolve(null);
        });
      });
    })();
  }

  async createUserCollectionIndex() {
    const userIndex = await this.db.collection<User>(USER_COLLECTION).createIndex(
      {
        username: 1
      },
      {
        unique: true,
        sparse: true
      }
    );
    logger.info(`Successfully created index ${userIndex}`);
  }
}

export const mongodb = new MongoDb(url, dbName);
