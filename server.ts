import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config/settings';
import morgan from 'morgan';
import fileRouter from './src/routes/file.router';
import { errorHandlerMiddleware } from './src/middleware';
const app: Express = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '6mb',
  })
);

app.use(
  bodyParser.json({
    limit: '6mb',
  })
);

/**
 * Setup CORS
 * */
app.use(cors(config.cors));

/**
 * Disable `Powered by` header
 */
app.disable('x-powered-by');

/**
 * Upload dir with files and images
 */
app.use(config.file.rootDir, express.static(__dirname + config.file.rootDir));

/**
 * Disallow indexing
 */
app.use('/robots.txt', express.static(__dirname + '/robots.txt'));

/**
 * Disable etag
 */
app.set('etag', false);

/**
 * Enable logger
 */
app.use(morgan('dev'));

app.use('/api/file', fileRouter);

/**
 * Enable error middleware
 * */
app.use(errorHandlerMiddleware);

app.listen(config.app.port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${config.app.port}`
  );
});
