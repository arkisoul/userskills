import {IncomingMessage, ServerResponse} from 'http';

import {createUserskills, deleteUserskills, getUserskills, updateUserskills} from '../controllers';
import { logger } from '../middleware';
import { Username } from '../db';

const USER_ROUTE = '/userskills'

export const userRoutes = (req: IncomingMessage, res: ServerResponse) => {
    const {url, method} = req;
    logger.info(url);

    if(method === 'POST' && url === USER_ROUTE) {
        let body: any = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);
            const users = body.Userskills;
            logger.info(`POST request received ${users}`);
            createUserskills(req, res, users);
        });
    }

    if(method === 'GET' && url && url.split('?')[0] === USER_ROUTE) {
        const queryString = url.split('?')[1];
        const [key, value] = queryString.split('=');
        const data: Username = {'username': value}
        logger.info(`GET request received ${data}`);
        getUserskills(req, res, data);
    }

    if(method === 'PUT' && url === USER_ROUTE) {
        let body: any = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);
            const users = body.Userskills;
            logger.info(`PUT request received ${users}`);
            updateUserskills(req, res, users);
        });
    }

    if(method === 'DELETE' && url === USER_ROUTE) {
        let body: any = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);
            logger.info(`DELETE request received ${body}`);
            deleteUserskills(req, res, body);
        });
    }

}