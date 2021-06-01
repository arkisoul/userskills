import {db as dbConnect} from './connection';
import {redisDelete, redisSet} from './redis';
import {User} from '../models';

const USER_COLLECTION = 'users';

export type Username = {
    username: string
}

export const createUser = async (users: User[]): Promise<User[]> => {
    const {db, client} = await dbConnect();
    return new Promise((resolve, reject) => {
        const userCollection = db.collection<User>(USER_COLLECTION);
        userCollection.insertMany(users, (err, result) => {
            if(err) {
                reject(`Error! inserting users in db ${err.message}`)
            }
            // client.close();
            resolve(result.ops);
        })
    })
}

export const getUser = async (username: Username): Promise<User> => {
    const {db, client} = await dbConnect();
    return new Promise((resolve, reject) => {
        const userCollection = db.collection<User>(USER_COLLECTION);
        userCollection.findOne(username, (err, result) => {
            if(err) {
                reject(`Could not find the user with username ${username}. Error! ${err.message}`)
            }
            // client.close();
            resolve(result);
        })
    })
}

export const deleteUser = async (username: Username): Promise<number | undefined> => {
    const {db, client} = await dbConnect();
    return new Promise((resolve, reject) => {
        const userCollection = db.collection<User>(USER_COLLECTION);
        userCollection.deleteOne(username, async (err, result) => {
            if(err) {
                reject(`Error! ${err.message}`)
            }
            const redisKey: string = `UserSkills-${username.username}`
            await redisDelete(redisKey);
            // client.close();
            resolve(result.deletedCount);
        });
    })
}

export const updateUser = async (user: User): Promise<number> => {
    const {db, client} = await dbConnect();
    return new Promise((resolve, reject) => {
        const userCollection = db.collection<User>(USER_COLLECTION);
        userCollection.updateOne({username: user.username}, {$set: user}, async (err, result) => {
            if(err) {
                reject(`Error! ${err.message}`)
            }
            const redisKey: string = `UserSkills-${user.username}`
            await redisSet(redisKey, JSON.stringify(user));
            // client.close();
            resolve(result.modifiedCount)
        })
    })
}