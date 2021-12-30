import mongoose from "mongoose";
import { DB_URI } from "../config/secrets";

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

export default {
  connect: (callback) =>
    mongoose
      .connect(DB_URI, dbOptions)
      .then(() => {
        console.log("Database successfully connected.");
        if (callback) callback();
      })
      .catch(() => console.log("The connection with the database could not be established.")),
  close: mongoose.connection.close(),
};
