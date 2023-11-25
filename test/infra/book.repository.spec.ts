import test, { after, describe } from 'node:test';
import { Book, BookGenre } from '../../src/domain/book.entity';
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
});
