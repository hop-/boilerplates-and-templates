import * as repl from 'repl';
import { IService } from '../interfaces/service.interface';

export abstract class Application {
  // TODO: use dependencies when ordering services
  private mServices: IService[];

  private mIsInitilized: boolean = false;

  private mTerminationTryCount: number;

  private mTerminationTryCountRemains: number;

  constructor(services: IService[], terminationTryCount: number = 3) {
    this.mServices = services;
    this.mTerminationTryCount = terminationTryCount;
    this.mTerminationTryCountRemains = terminationTryCount;

    // Stop all services on signals
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        this.mTerminationTryCountRemains--;

        if (this.mTerminationTryCount === this.mTerminationTryCountRemains + 1) {
          console.log(`Received ${signal}. Shutting down gracefully`);
          await this.stop();
          process.exit();
        } else if (this.mTerminationTryCountRemains !== 0) {
          console.log(`Terminate ${this.mTerminationTryCountRemains} more and it will termiante immediately`);
        } else {
          process.exit(1);
        }
      });
    });

    // Stop all services on events
    const errorTypes = ['unhandledRejection', 'uncaughtException'];
    errorTypes.forEach((type) => {
      process.on(type, async (err) => {
        console.log(`Catched ${type} event. Graceful shutting down`);
        console.log(err);

        await this.stop();

        process.exit(1);
      });
    });
  }

  protected async init() {
    if (this.mIsInitilized) {
      throw new Error('App can be started once');
    }

    // Starting services by the order
    for (const service of this.mServices) {
      // eslint-disable-next-line no-await-in-loop
      await service.start();
    }

    this.mIsInitilized = true;
  }

  public async start() {
    // Initialize
    await this.init();

    await this.runApp();
  }

  public async startCli() {
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    const tsnode = require('ts-node');
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    const ts = require('typescript');

    // Initialize
    await this.init();

    // Configure typescript REPL
    const replService = tsnode.createRepl();
    const service = tsnode.create({ ...replService.evalAwarePartialHost, transpileOnly: true });
    service.ts = ts;
    replService.setService(service);

    // Start typescript REPL
    const r = repl.start({
      prompt: '[] > ',
      useColors: true,
      ignoreUndefined: true,
      eval: replService.nodeEval,
    });

    // Setup REPL context
    Object.assign(r.context, {/* add context here */});

    r.on('exit', () => {
      console.log('Bye...');
    });
  }

  protected async stop() {
    // Stopping services by the reverse order
    for (let i = this.mServices.length - 1; i < 0; i++) {
      // eslint-disable-next-line no-await-in-loop
      await this.mServices[i].stop();
    }
    console.log('Stopped successfully');
  }

  protected abstract runApp(): Promise<void>;
}
