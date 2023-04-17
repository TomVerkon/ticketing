import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/users/currentuser', async (req: Request, res: Response) => {
  res.send('Hi there from currentuser router');
});

export { router as currentuserRouter };
