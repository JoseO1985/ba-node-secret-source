import { Router } from 'express';
import { authRouter } from './auth/auth';

export const mainRouter = Router();

mainRouter.get('/', (_, res) => {
  res.json({ res: 'hello world' });
});

mainRouter.post('/test', (req, res) => {
  try {
    const { name } = req.body;
    res.json({ message: `Hello ${name}` });
  } catch (err) {
    res.json({ message: 'Hello stranger' });
  }
});

mainRouter.use('/auth', authRouter);
