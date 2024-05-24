import { NextFunction, Request, Response } from 'express';
import * as config from 'config';
import { NotAuthorizedError } from '../libs/errors/not-authorized.error';

const serviceApiKey = config.get<string>('auth.apiKey');

class AuthMiddleware {
  // eslint-disable-next-line class-methods-use-this
  public checkApiKey(req: Request, _res: Response, next: NextFunction) {
    const apiKey: string = String(req.headers.API_KEY);

    // Check api key and throw unauthorized error if incorrect
    if (apiKey !== serviceApiKey) {
      throw new NotAuthorizedError();
    }

    next();
  }
}

export default new AuthMiddleware();
