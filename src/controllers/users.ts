import { IncomingMessage, ServerResponse } from 'http';

import { User } from '../models';
import { createUser, getUser, Username, redisGet, redisSet, updateUser, deleteUser } from '../db';
import { logger } from '../middleware';

export const createUserskills = async (req: IncomingMessage, res: ServerResponse, body: User[]): Promise<void> => {
  try {
    const users = await createUser(body);
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        message: 'Users created successfully',
        users
      })
    );
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: error.message, users: [] }));
  }
};

export const getUserskills = async (req: IncomingMessage, res: ServerResponse, param: Username): Promise<void> => {
  try {
    let user;
    const redisKey = `UserSkills-${param.username}`;
    user = await redisGet(redisKey);
    if (user) {
      user = JSON.parse(user);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: 'User details', user }));
      return;
    }
    user = await getUser(param);
    const reply = await redisSet(redisKey, JSON.stringify(user));
    logger.info(`Redis set reply ${reply}`);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'User details', user }));
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: error.message, user: null }));
  }
};

export const updateUserskills = async (req: IncomingMessage, res: ServerResponse, body: User[]): Promise<void> => {
  try {
    const promises = body.map(async (user) => updateUser(user));
    await Promise.all(promises);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Users updated successfully' }));
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: error.message }));
  }
};

export const deleteUserskills = async (req: IncomingMessage, res: ServerResponse, param: Username[]): Promise<void> => {
  try {
    const promises = param.map(async (username) => deleteUser(username));
    await Promise.all(promises);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Users updated successfully' }));
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: error.message }));
  }
};
