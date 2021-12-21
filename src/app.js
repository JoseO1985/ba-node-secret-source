import express from 'express';
import mongoose from "mongoose";
import { json, urlencoded } from 'body-parser';
import { mainRouter } from './routes/main';
import { DB_URI, PORT } from "./config/secrets";

const app = express();

// middleware setup
app.use(urlencoded({ extended: false }));
app.use(json());

// routes setup
app.use(mainRouter);

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}

mongoose.connect(DB_URI, dbOptions)
  .then(() => {
    console.log('Database successfully connected.');
    app.listen(PORT, () => {
      console.log(`App listening on http://localhost:${PORT}`);
    });
  })
  .catch(() => console.log('The connection with the database could not be established.'));

