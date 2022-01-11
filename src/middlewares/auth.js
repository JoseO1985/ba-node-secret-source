import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secrets';

export const auth = (req, res, next) => {
  try {
    const token = req.headers['auth-token'];
    if (!token) return res.status(400).send('Missing token');

    const decoded = jwt.verify(token, JWT_SECRET);
    req.decoded = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send('Invalid token');
  }
};

export const validRole = (role) => (req, res, next) => {
  try {
    if (!req.decoded || !req.decoded.role) return res.status(401).send('Unauthorized');
    if (req.decoded.role === role) return next();
    return res.status(401).send('Unauthorized');
  } catch (err) {
    console.log(err);
    res.status(401).send('Unauthorized');
  }
};

export const isPartner = validRole('partner');

export const isCyclist = validRole('cyclist');
