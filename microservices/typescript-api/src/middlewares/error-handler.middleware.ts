import { Request, Response, NextFunction } from 'express';
import { ServerError } from '../libs/errors/server.error';

class ErrorHandlerMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  public errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line prefer-const
    let e = err;

    console.error('Error has been thrown during request processing:', e);

    // TODO: Add other error type handlers such as DB errors etc.

    // Handling other errors
    if (!(e instanceof ServerError)) {
    // 501 Something went wrong
      e = new ServerError();
    }

    res.status((e as ServerError).statusCode).send((e as ServerError).errors);
  }
}

export default new ErrorHandlerMiddleware();
