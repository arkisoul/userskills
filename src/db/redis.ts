import redis from 'redis';

import { logger } from '../middleware';

const client = redis.createClient();
const REDIS_TTL = 30 * 60;

client.on('error', (error) => {
  logger.error(`Error! ${error.message}`);
});

export const redisGet = async (key: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject(`Error! ${err.message}`);
      }
      resolve(reply);
    });
  });
};

export const redisSet = async (key: string, value: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.set(key, value, (err, reply) => {
      if (err) {
        reject(`Error! ${err.message}`);
      }
      client.expire(key, REDIS_TTL);
      resolve(reply);
    });
  });
};

export const redisDelete = async (key: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    client.del(key, (err, result) => {
      if (err) {
        reject(`Error! ${err.message}`);
      }
      resolve(result);
    });
  });
};
