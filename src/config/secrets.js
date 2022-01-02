import { config } from 'dotenv';

config();

export const { NODE_ENV, DB_URI, PORT, JWT_SECRET, BANON_EMAIL, USER_EMAIL, USER_PASSWORD } = process.env;
