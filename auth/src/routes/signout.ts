import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/currentuser', (req: Request, res: Response) => {
  res.send('Hi there from signout router');
});

export { router as signoutRouter };
