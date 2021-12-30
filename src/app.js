import express from 'express';
import { json, urlencoded } from 'body-parser';
import { mainRouter } from './routes/main';
import { PORT } from './config/secrets';
import db from './db/connection';

const app = express();

// middleware setup
app.use(urlencoded({ extended: false }));
app.use(json());

// routes setup
app.use(mainRouter);

const startServer = () =>
  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });

db.connect(startServer);
