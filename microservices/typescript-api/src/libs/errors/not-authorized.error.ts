import { HttpStatusCodes } from '../constants/http-status-codes.enum';
import { ServerError } from './server.error';

const message = 'Not authorized';

export class NotAuthorizedError extends ServerError {
  constructor() {
    super(message, HttpStatusCodes.Unauthorized, [{
      type: 'not-authorized',
      message,
      details: undefined,
    }]);
  }
}
