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
        this.assign({
          id: change.data.id,
          title: change.data.title,
          author: change.data.author,
          isbn: change.data.isbn,
          publishDate: new Date(change.data.publishDate as string),
          genre: change.data.genre,
          status: change.data.status,
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
