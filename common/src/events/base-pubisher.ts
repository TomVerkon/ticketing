import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

require('dotenv').config();

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  protected client: Stan;
  private logMsgs = process.env.LOG_MSGS === 'true' ? true : false;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        console.log('logMsgs :', this.logMsgs);
        if (err) {
          return reject(err);
        }
        if (this.logMsgs)
          console.log('Event published to subject:', this.subject);
        resolve();
      });
    });
  }
}
