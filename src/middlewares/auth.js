import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secrets';
import User from '../models/User';

export const auth = async (req, res, next) => {
  try {
    const token = req.headers['auth-token'];
    if (!token) return res.status(400).send('Missing token');

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send('Invalid token');
  }
};

export const validRole = (role) => (req, res, next) => {
  try {
    if (!req.user || !req.user.role) return res.status(401).send('Unauthorized');
    if (req.user.role === role) return next();
    return res.status(401).send('Unauthorized');
  } catch (err) {
    console.log(err);
    res.status(401).send('Unauthorized');
  }
};

export const isPartner = validRole('partner');

export const isCyclist = validRole('cyclist');
