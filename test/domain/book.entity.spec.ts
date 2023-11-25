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

  test('book info is updated', () => {
    // Arrange
    const aBook = Book.register({
      title: 'The Hobbit',
      author: 'J. R. R. Tolkien',
      isbn: '9780006754024',
      publishDate: new Date('1997-09-01'),
      genre: BookGenre.Fantasy,
    });

    // Act
    aBook.updateInfo({
      title: 'Harry Potter and the Philosophical Stone',
      author: 'J. K. Rowling',
      isbn: '9788532523051',
      publishDate: new Date('2020-04-01'),
    });

    // Assert
    assert.equal(aBook.title, 'Harry Potter and the Philosophical Stone');
    assert.equal(aBook.author, 'J. K. Rowling');
    assert.equal(aBook.isbn, '9788532523051');
    assert.deepEqual(aBook.publishDate, new Date('2020-04-01'));
    assert.equal(aBook.genre, BookGenre.Fantasy);
    assert.equal(aBook.status, BookStatus.Available);
    assert.equal(aBook.changes.length, 2);
    assert.equal(aBook.changes[1].type, 'book-updated');
  });
});
