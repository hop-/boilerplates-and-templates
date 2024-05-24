import { HttpStatusCodes } from '../constants/http-status-codes.enum';
import { ServerError } from './server.error';

const message = 'Forbidden';

export class ForbiddenError extends ServerError {
  constructor() {
    super(message, HttpStatusCodes.Forbidden, [{
      type: 'forbidden',
      message,
      details: undefined,
    }]);
  }
}
