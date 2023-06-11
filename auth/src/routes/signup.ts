import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { validateRequest, BadRequestError } from '@tverkon-ticketing/common'
import { User } from '../model/user'
import { StatusCode } from '@tverkon-ticketing/common'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').trim().isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 8, max: 20 }).withMessage('Pwd must be between 8 and 20 chars inclusive'),
  ],
  validateRequest,

  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('email in use!', 'email')
    }
    const user = User.build({ email, password })

    await user.save()

    // generate jwt and store in session object
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    )

    req.session = { jwt: userJwt }

    res.status(StatusCode.Created).send(user)
  }
)

export { router as signupRouter }
