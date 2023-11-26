import { JSONEventType, jsonEvent } from '@eventstore/db-client';
import {
  type UpdateBookInfoProps,
  type BookStatus,
  type RegisterBookProps,
} from '../entities/book.entity';

export type BookRegisteredEventProps = RegisterBookProps & {
  id: string;
  occurredOn: string;
  status: BookStatus;
};

export type BookRegisteredEvent = JSONEventType<
  'book-registered',
  BookRegisteredEventProps
>;

export type BookUpdatedProps = UpdateBookInfoProps & {
  id: string;
  occurredOn: string;
};

export type BookUpdatedEvent = JSONEventType<'book-updated', BookUpdatedProps>;

export type BookBorrowedEventProps = {
  id: string;
  occurredOn: string;
  newStatus: BookStatus;
};

export type BookBorrowedEvent = JSONEventType<
  'book-borrowed',
  BookBorrowedEventProps
>;

export const book = {
  bookRegistered(props: BookRegisteredEventProps) {
    return jsonEvent<BookRegisteredEvent>({
      type: 'book-registered',
      data: props,
    });
  },

  bookUpdated(props: BookUpdatedProps) {
    return jsonEvent<BookUpdatedEvent>({
      type: 'book-updated',
      data: props,
    });
  },

  bookBorrowed(props: BookBorrowedEventProps) {
    return jsonEvent<BookBorrowedEvent>({
      type: 'book-borrowed',
      data: props,
    });
  },
};

