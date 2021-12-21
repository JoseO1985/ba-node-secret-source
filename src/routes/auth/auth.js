import { Router } from 'express';
import User from "../../models/User";
import Password from "../../services/Password/Password";
import Token from "../../services/Token/Token";

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('Missing data');

    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const hashedPassword = Password.hashPassword(password);
    if (!Password.compare(password, hashedPassword)) throw new Error('Invalid password');

    const token = Token.generateToken(user.id);
    res.status(200).json({ token, userId: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) throw new Error("Missing data");

    const hashedPassword = Password.hashPassword(password);
    await User.create({ username, email, password: hashedPassword });

    res.status(201).json();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
})

