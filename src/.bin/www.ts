import http from 'http';

import {config} from '../config';
import {logger} from '../middleware';
import { userRoutes } from '../routes';

const server = http.createServer((req, res) => {
    userRoutes(req, res);
});

server.listen(config.PORT, () => {
    logger.info(`Server started listening at port ${config.PORT}`);
});