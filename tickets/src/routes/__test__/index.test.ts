import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../model/ticket'
import { StatusCode } from '@tverkon-ticketing/common'

let waitMicroseconds = 20000

it(
  'can fetch a list of tickets',
  async () => {
    const titles: string[] = ['asdfghjk', 'qwertyui'] as string[]
    const prices: number[] = [20, 25] as number[]
    const userIds: string[] = ['xyzzy', 'plough'] as string[]

    for (let i = 0; i < 2; i++) {
      const title = titles[i]
      const price = prices[i]
      const userId = userIds[i]
      const ticket = Ticket.build({ title: titles[i], price: prices[i], userId: userIds[i] })
      await ticket.save()
    }

    const response = await request(app).get(`/api/tickets`).expect(StatusCode.OK)
    expect(response.body.length).toStrictEqual(2)
    // console.log(global.createMsg(expect, StatusCode.OK, response.status, response.text));
  },
  waitMicroseconds
)
