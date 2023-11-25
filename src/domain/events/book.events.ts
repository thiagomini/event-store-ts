import { JSONEventType, jsonEvent } from '@eventstore/db-client';
import { type BookStatus, type RegisterBookProps } from '../book.entity';

export type BookRegisteredEventProps = RegisterBookProps & {
  id: string;
  occurredOn: Date;
  status: BookStatus;
};

export type BookRegisteredEvent = JSONEventType<
  'book-registered',
  BookRegisteredEventProps
>;

export const book = {
  bookRegistered(props: BookRegisteredEventProps): BookRegisteredEvent {
    return jsonEvent<BookRegisteredEvent>({
      type: 'book-registered',
      data: props,
    });
  },
};
