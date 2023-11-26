import {
  Book,
  BookGenre,
  RegisterBookProps,
} from '../../src/domain/entities/book.entity';

export class BookFactory {
  public build(props: Partial<RegisterBookProps> = {}) {
    const defaultRegisterBookProps: RegisterBookProps = {
      title: 'The Hobbit',
      author: 'J. R. R. Tolkien',
      genre: BookGenre.Fantasy,
      isbn: '978-3-16-148410-0',
      publishDate: new Date('1954-07-29'),
    };
    return Book.register({
      ...defaultRegisterBookProps,
      ...props,
    });
  }
}
