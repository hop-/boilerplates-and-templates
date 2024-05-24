import { HttpStatusCodes } from '../constants/http-status-codes.enum';
import { ServerError } from './server.error';

const message = 'Route not found';

export class NotFoundError extends ServerError {
  constructor(entity: string | undefined = undefined) {
    super(message, HttpStatusCodes.NotFound, [{
      type: 'route-not-found',
      message,
      details: {
        entity,
      },
    }]);
  }
}
