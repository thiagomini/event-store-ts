import { randomUUID } from 'crypto';
import { Entity } from './entity';
import { Change } from './interfaces/change.interface';
import { Events } from './events/events';

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
        this.assign(change.data);
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
      occurredOn: new Date(),
    });
    this.apply(updatedBookEvent);
  }

  public static register(props: RegisterBookProps) {
    const newId = randomUUID();
    const newBook = new Book();
    const registeredEvent = Events.book.bookRegistered({
      id: newId,
      occurredOn: new Date(),
      ...props,
      status: BookStatus.Available,
    });

    newBook.apply(registeredEvent);

    return newBook;
  }
}
