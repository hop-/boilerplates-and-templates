import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
// Init configurations
import config from 'config';
// Configure to handle async errors in express
import 'express-async-errors';
import * as cors from 'cors';
import * as express from 'express';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { RegisterRoutes } from './routes/routes';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import { NotFoundError } from './libs/errors/not-found.error';
import { Application } from './libs/classes/application.class';

import pgpService from './services/pgp.service';
import pgtService from './services/pgt.service';
import mongoDbService from './services/mongo-db.service';
import mongoService from './services/mongo.service';
import kafkaService from './services/kafka.service';

const port = config.get<number>('app.port');
const httpsEnabled = config.get<boolean>('app.https.enabled');
const httpsCertPath = config.get<string>('app.https.certificatePath');
const httpsKeyPath = config.get<string>('app.https.keyPath');
const cwd = process.cwd();

function getHttpsOptions() {
  return {
    key: fs.readFileSync(path.join(cwd, httpsKeyPath), 'utf8'),
    cert: fs.readFileSync(path.join(cwd, httpsCertPath), 'utf8'),
  };
}

class App extends Application {
  constructor() {
    super([
      pgpService,
      pgtService,
      mongoDbService,
      mongoService,
      kafkaService,
      // TODO: Add more services
    ]);
  }

  // eslint-disable-next-line class-methods-use-this
  protected async runApp(): Promise<void> {
    const app = express();
    // Configure app
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());

    // Initialize routes
    RegisterRoutes(app);

    // Not found on all other routes
    app.all('*', async (req: express.Request) => {
      console.error('Request Path', req.path);

      throw new NotFoundError();
    });

    // Error handling
    app.use(errorHandlerMiddleware.errorHandler);

    // Init server
    const server = httpsEnabled
      ? https.createServer(getHttpsOptions(), app)
      : http.createServer(app);

    // Start server
    server.listen(port, () => {
      console.info(`${httpsEnabled ? 'Secure' : 'Not secure'} app listening on port ${port}`);
    });
  }
}

export default new App();
