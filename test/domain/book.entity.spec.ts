import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { Book, BookGenre, BookStatus } from '../../src/domain/book.entity';

describe('BookEntity', () => {
  test('a new book is registered', () => {
    // Act
    const aBook = Book.register({
      title: 'The Hobbit',
      author: 'J. R. R. Tolkien',
      isbn: '9780006754024',
      publishDate: new Date('1997-09-01'),
      genre: BookGenre.Fantasy,
    });

    // Assert
    assert.equal(aBook.title, 'The Hobbit');
    assert.equal(aBook.author, 'J. R. R. Tolkien');
    assert.equal(aBook.isbn, '9780006754024');
    assert.deepEqual(aBook.publishDate, new Date('1997-09-01'));
    assert.equal(aBook.genre, 'Fantasy');
    assert.equal(aBook.changes.length, 1);
    assert.equal(aBook.changes[0].type, 'book-registered');
    assert.equal(aBook.status, BookStatus.Available);
  });
});
