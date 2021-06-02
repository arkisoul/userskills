import http from 'http';

import { config } from '../config';
import { logger } from '../middleware';
import { mongodb } from '../db';
import { userRoutes } from '../routes';

const server = http.createServer((req, res) => {
  userRoutes(req, res);
});

server.listen(config.PORT, async () => {
  await mongodb.connect();
  mongodb.createUserCollectionIndex();
  logger.info(`Server started listening at port ${config.PORT}`);
});
