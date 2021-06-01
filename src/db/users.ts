import { mongodb } from './connection';
import { redisDelete, redisSet } from './redis';
import { User } from '../models';

const USER_COLLECTION = 'users';

export type Username = {
    username: string
}

export const createUser = async (users: User[]): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        const userCollection = mongodb.db.collection<User>(USER_COLLECTION);
        userCollection.insertMany(users, (err, result) => {
            if (err) {
                reject(`Error! inserting users in db ${err.message}`)
            }
            if(result) {
                resolve(result.ops);
            } else {
                reject(`Error! Can't create users`);
            }
        })
    })
}

export const getUser = async (username: Username): Promise<User> => {
    return new Promise((resolve, reject) => {
        const userCollection = mongodb.db.collection<User>(USER_COLLECTION);
        userCollection.findOne(username, (err, result) => {
            if (err) {
                reject(`Could not find the user with username ${username}. Error! ${err.message}`)
            }
            resolve(result);
        })
    })
}

export const deleteUser = async (username: Username): Promise<number | undefined> => {
    return new Promise((resolve, reject) => {
        const userCollection = mongodb.db.collection<User>(USER_COLLECTION);
        userCollection.deleteOne(username, async (err, result) => {
            if (err) {
                reject(`Error! ${err.message}`)
            }
            const redisKey: string = `UserSkills-${username.username}`
            await redisDelete(redisKey);
            resolve(result.deletedCount);
        });
    })
}

export const updateUser = async (user: User): Promise<number> => {
    return new Promise((resolve, reject) => {
        const userCollection = mongodb.db.collection<User>(USER_COLLECTION);
        userCollection.updateOne({ username: user.username }, { $set: user }, async (err, result) => {
            if (err) {
                reject(`Error! ${err.message}`)
            }
            const redisKey: string = `UserSkills-${user.username}`
            await redisSet(redisKey, JSON.stringify(user));
            resolve(result.modifiedCount)
        })
    })
}