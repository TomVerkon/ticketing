import { Publisher, Subjects, ExpirationCompleteEvent } from "@tverkon-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
