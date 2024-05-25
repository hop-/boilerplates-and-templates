/* eslint-disable import/no-extraneous-dependencies */
import { NextFunction, Request, Response } from 'express';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import authMiddleware from '../../src/middlewares/auth.middleware';
import { NotAuthorizedError } from '../../src/libs/errors/not-authorized.error';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Auth middleware check api key', () => {
  const subject = authMiddleware.checkApiKey;
  context('when key is not exist', () => {
    const run = async () => subject({ headers: {} } as Request, {} as Response, {} as NextFunction);

    it('should throw an Error', async () => {
      expect(run()).to.be.rejectedWith(NotAuthorizedError);
    });
  });
});
