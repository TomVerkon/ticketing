import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, currentUser, errorHandler } from '@tverkon-ticketing/common';

declare global {
  namespace express {
    interface Request {
      session: object;
    }
  }
}

const app = express();
app.set('trust proxy', true);
app.use(json());
// secure is being manipulated because needs to be false when running tests
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' ? true : false,
  })
);

app.use(currentUser);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
