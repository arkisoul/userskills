import {IncomingMessage, ServerResponse} from 'http';
import {promisify} from 'util';

import {User} from '../models';
import {createUser, getUser, Username, redisGet, redisSet, updateUser, deleteUser} from '../db';
import { logger } from '../middleware';

export const createUserskills = async (req: IncomingMessage, res: ServerResponse, body: User[]) => {
    const users = await createUser(body);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Users created successfully', users }));
}

export const getUserskills = async (req: IncomingMessage, res: ServerResponse, param: Username) => {
    let user;
    const redisKey: string = `UserSkills-${param.username}`
    user = await redisGet(redisKey);
    if(user) {
        user = JSON.parse(user);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, message: 'Users created successfully', user }));
        return;
    }
    user = await getUser(param);
    const reply = await redisSet(redisKey, JSON.stringify(user));
    logger.info(`Redis set reply ${reply}`);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Users created successfully', user }));
}

export const updateUserskills = async (req: IncomingMessage, res: ServerResponse, body: User[]) => {
    const promises = body.map(async (user) => updateUser(user));
    await Promise.all(promises);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Users updated successfully' }));
}

export const deleteUserskills = async (req: IncomingMessage, res: ServerResponse, param: Username[]) => {
    const promises = param.map(async (username) => deleteUser(username));
    await Promise.all(promises);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Users updated successfully' }));
}
