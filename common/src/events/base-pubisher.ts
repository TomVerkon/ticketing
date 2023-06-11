import { Message, Stan } from 'node-nats-streaming'
import { Subjects } from './subjects'
import { loggingMessages } from '../utils/log-messages'
import { consoleLog } from '../utils/log-console'

require('dotenv').config()

interface Event {
  subject: Subjects
  data: any
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject']
  protected client: Stan

  constructor(client: Stan) {
    this.client = client
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), err => {
        if (err) {
          return reject(err)
        }
        if (loggingMessages()) consoleLog('Message published to subject:', this.subject)
        resolve()
      })
    })
  }
}
