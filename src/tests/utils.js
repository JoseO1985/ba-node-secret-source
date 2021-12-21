import express from 'express';
import { urlencoded, json } from 'body-parser';

export const getTestableApi = (baseUrl, router) => {
  const app = express();
  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(baseUrl, router);
  return app;
};
