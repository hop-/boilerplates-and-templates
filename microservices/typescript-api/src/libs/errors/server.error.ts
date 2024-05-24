export interface IError {
  type: string;
  message: string;
  details: unknown;
}

export class ServerError extends Error {
  public readonly statusCode: number;

  public readonly errors: IError[];

  constructor(
    message: string = 'Something went wrong',
    statusCode: number = 501,
    errors: IError[] = [{
      type: 'internal-server-error',
      message: 'Something went wrong',
      details: undefined,
    }],
  ) {
    super(message || 'Something went wrong');
    this.errors = errors;
    this.statusCode = statusCode;
  }
}
