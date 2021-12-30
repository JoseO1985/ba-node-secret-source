import { Router } from 'express';
import { authRouter } from './auth/auth';
import { licenseRouter } from './license/license';

export const mainRouter = Router();

mainRouter.get('/', (_, res) => {
  res.json({ res: 'hello world' });
});

mainRouter.use('/auth', authRouter);
mainRouter.use('/licenses', licenseRouter);
