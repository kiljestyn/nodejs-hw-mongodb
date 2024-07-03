import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(
    express.json({
      limit: '1mb',
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );
  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);
  app.use(cookieParser());
  //   start server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

//   app.listen(PORT, (error) => {
//     if (error) process.exit(1);
//     console.log(`Server is running on port ${PORT}!`);
//   });

//   return app;
// };
