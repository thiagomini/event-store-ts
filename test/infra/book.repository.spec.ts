import test, { after, describe } from 'node:test';
import { Book, BookGenre } from '../../src/domain/entities/book.entity';
import { BookRepository } from '../../src/infra/book.repository';
import { eventStoreClient } from '../../src/infra/event-store.client';
import assert from 'node:assert/strict';

describe('Book Repository', () => {
  after(async () => {
    await eventStoreClient.dispose();
  });

  test('saves a new book', async () => {
    // Arrange
    const aBook = Book.register({
      author: 'John Doe',
      title: 'My Book',
      genre: BookGenre.Fantasy,
      isbn: '1234567890',
      publishDate: new Date(),
    });
    const repository = new BookRepository(eventStoreClient);

    // Act
    const response = await repository.save(aBook);

    // Assert
    assert.ok(response.success);
  });

  test('finds an existing book', async () => {
    // Arrange
    const aBook = Book.register({
      author: 'John Doe',
      title: 'My Book',
      genre: BookGenre.Fantasy,
      isbn: '1234567890',
      publishDate: new Date(),
    });
    const repository = new BookRepository(eventStoreClient);
    await repository.save(aBook);

    // Act
    const bookLoaded = await repository.entityById(aBook.id);

    // Assert
    assert.deepEqual(bookLoaded.id, aBook.id);
    assert.deepEqual(bookLoaded.author, aBook.author);
    assert.deepEqual(bookLoaded.title, aBook.title);
    assert.deepEqual(bookLoaded.genre, aBook.genre);
    assert.deepEqual(bookLoaded.isbn, aBook.isbn);
    assert.deepEqual(bookLoaded.publishDate, aBook.publishDate);
    assert.deepEqual(bookLoaded.status, aBook.status);
  });

  test('throws an error when the book does not exist', async () => {
    // Arrange
    const repository = new BookRepository(eventStoreClient);
    const nonexistingId = 'non-existing-id';

    // Act
    const promise = repository.entityById(nonexistingId);

    // Assert
    await assert.rejects(promise, new Error('book-non-existing-id not found'));
  });

  test('updates an existing book', async () => {
    // Arrange
    const aBook = Book.register({
      author: 'John Doe',
      title: 'My Book',
      genre: BookGenre.Fantasy,
      isbn: '1234567890',
      publishDate: new Date(),
    });
    const repository = new BookRepository(eventStoreClient);
    await repository.save(aBook);
    const bookLoaded = await repository.entityById(aBook.id);
    bookLoaded.updateInfo({
      author: 'Jane Doe',
    });

    // Act
    await repository.save(bookLoaded);

    // Assert
    const bookLoadedAfterUpdate = await repository.entityById(bookLoaded.id);
    assert.deepEqual(bookLoadedAfterUpdate.id, aBook.id);
    assert.deepEqual(bookLoadedAfterUpdate.author, 'Jane Doe');
  });
});
