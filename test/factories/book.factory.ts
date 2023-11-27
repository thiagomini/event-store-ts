import {
  Book,
  BookGenre,
  RegisterBookProps,
} from '../../src/domain/entities/book.entity';
import { BookRepository } from '../../src/infra/book.repository';
import { eventStoreClient } from '../../src/infra/event-store.client';

export class BookFactory {
  constructor(private bookRepository?: BookRepository) {}

  public build(props: Partial<Book> = {}) {
    const defaultRegisterBookProps: RegisterBookProps = {
      title: 'The Hobbit',
      author: 'J. R. R. Tolkien',
      genre: BookGenre.Fantasy,
      isbn: '978-3-16-148410-0',
      publishDate: new Date('1954-07-29'),
    };
    const book = Book.register(defaultRegisterBookProps);
    Object.assign(book, props);
    return book;
  }

  public async create(props: Partial<Book> = {}): Promise<Book> {
    if (!this.bookRepository) {
      this.bookRepository = new BookRepository(eventStoreClient);
    }
    const book = this.build(props);
    await this.bookRepository.save(book);
    return book;
  }
}
