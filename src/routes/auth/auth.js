import { Router } from 'express';
import User from '../../models/User';
import Password from '../../services/Password/Password';
import Token from '../../services/Token/Token';
import EmailValidator from '../../services/Validation/EmailValidator';
import joi from 'joi';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password } = req.body;
    /*if (!email || !password) throw new Error('Missing data');
    if (!EmailValidator.isValid(email)) throw new Error('Invalid email');*/

    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const hashedPassword = Password.hashPassword(password);
    if (!Password.compare(password, hashedPassword)) throw new Error('Invalid password');

    const token = Token.generateToken(user.id, user.role);
    res.status(200).json({ token, userId: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if ((!username || !email || !password, !role)) throw new Error('Missing data');
    if (!EmailValidator.isValid(email)) throw new Error('Invalid email');

    const hashedPassword = Password.hashPassword(password);
    const user = await User.create({ username, email, password: hashedPassword, role });

    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const validate = (user) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  return schema.validate(user);
};
