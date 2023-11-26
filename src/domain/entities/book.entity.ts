import { randomUUID } from 'crypto';
import { Entity } from './entity';
import { Change } from '../interfaces/change.interface';
import { Events } from '../events/events';
import {
  BookBorrowedEvent,
  BookRegisteredEvent,
  BookReturnedEvent,
} from '../events/book.events';

export enum BookStatus {
  Available = 'Available',
  Borrowed = 'Borrowed',
}

export enum BookGenre {
  Fantasy = 'Fantasy',
}

export type RegisterBookProps = {
  title: string;
  author: string;
  isbn: string;
  publishDate: Date;
  genre: BookGenre;
};

export type UpdateBookInfoProps = Partial<RegisterBookProps>;

export class Book extends Entity {
  public readonly title: string;
  public readonly author: string;
  public readonly isbn: string;
  public readonly publishDate: Date;
  public readonly genre: BookGenre;
  public readonly status: BookStatus;

  public when(change: Change): void {
    switch (change.type) {
      case 'book-registered':
        const bookRegistered = change as unknown as BookRegisteredEvent;
        this.assign({
          id: bookRegistered.data.id,
          title: bookRegistered.data.title,
          author: bookRegistered.data.author,
          isbn: bookRegistered.data.isbn,
          publishDate: new Date(bookRegistered.data.publishDate),
          genre: bookRegistered.data.genre,
          status: bookRegistered.data.status,
        });
        break;
      case 'book-borrowed':
        const bookBorrowed = change as unknown as BookBorrowedEvent;
        this.assign({
          status: bookBorrowed.data.newStatus,
        });
        break;

      case 'book-returned':
        const bookReturned = change as unknown as BookReturnedEvent;
        this.assign({
          status: bookReturned.data.newStatus,
        });
        break;
      default:
        this.assign(change.data);
        break;
    }
  }

  public updateInfo(updateProps: UpdateBookInfoProps) {
    const updatedBookEvent = Events.book.bookUpdated({
      ...updateProps,
      id: this.id,
      occurredOn: new Date().toISOString(),
    });
    this.apply(updatedBookEvent);
  }

  public borrow() {
    const borrowedEvent = Events.book.bookBorrowed({
      id: this.id,
      occurredOn: new Date().toISOString(),
      newStatus: BookStatus.Borrowed,
    });
    this.apply(borrowedEvent);
  }

  public return() {
    const returnedEvent = Events.book.bookReturned({
      id: this.id,
      occurredOn: new Date().toISOString(),
      newStatus: BookStatus.Available,
    });
    this.apply(returnedEvent);
  }

  public static register(props: RegisterBookProps) {
    const newId = randomUUID();
    const newBook = new Book();
    const registeredEvent = Events.book.bookRegistered({
      id: newId,
      occurredOn: new Date().toISOString(),
      ...props,
      status: BookStatus.Available,
    });

    newBook.apply(registeredEvent);

    return newBook;
  }
}
