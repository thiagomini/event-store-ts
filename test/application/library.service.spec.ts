import test, { after, describe } from 'node:test';
import { BookFactory } from '../factories/book.factory';
import { MemberFactory } from '../factories/member.factory';
import { BookRepository } from '../../src/infra/book.repository';
import { eventStoreClient } from '../../src/infra/event-store.client';
import { MemberRepository } from '../../src/infra/member.repository';
import { LibraryService } from '../../src/application/library.service';
import assert from 'node:assert/strict';
import { LoanService } from '../../src/domain/services/loan.service';
import { LoanRepository } from '../../src/infra/loan.repository';
import { BookStatus } from '../../src/domain/entities/book.entity';

describe('Library Service', () => {
  const bookRepository = new BookRepository(eventStoreClient);
  const bookFactory = new BookFactory(bookRepository);
  const memberRepository = new MemberRepository(eventStoreClient);
  const memberFactory = new MemberFactory(memberRepository);
  const loanRepository = new LoanRepository(eventStoreClient);
  const loanService = new LoanService();
  const libraryService = new LibraryService(
    loanService,
    bookRepository,
    memberRepository,
    loanRepository,
  );

  after(async () => {
    await eventStoreClient.dispose();
  });

  test('Cannot lend a non existent book', async () => {
    // Arrange
    const member = await memberFactory.create();
    const startDate = new Date();
    const dueDate = new Date();

    // Act
    const loanPromise = libraryService.lendBookToMember({
      bookId: 'non-existent-id',
      dueDate,
      startDate,
      memberId: member.id,
    });

    // Assert
    await assert.rejects(
      loanPromise,
      new Error('book-non-existent-id not found'),
    );
  });

  test('Lends a book to a member', async () => {
    // Arrange
    const book = await bookFactory.create();
    const member = await memberFactory.create();
    const startDate = new Date();
    const dueDate = new Date();

    // Act
    const loan = await libraryService.lendBookToMember({
      bookId: book.id,
      dueDate,
      startDate,
      memberId: member.id,
    });

    // Assert
    assert.equal(loan.memberId, member.id);
    assert.equal(loan.bookId, book.id);
    assert.equal(loan.endDate, undefined);

    const loadedLoan = await loanRepository.entityById(loan.id);
    assert.ok(loadedLoan);
    assert.deepEqual(loadedLoan.id, loan.id);
    assert.deepEqual(loadedLoan.bookId, loan.bookId);
    assert.deepEqual(loadedLoan.memberId, loan.memberId);
    assert.deepEqual(loadedLoan.startDate, loan.startDate);
    assert.deepEqual(loadedLoan.dueDate, loan.dueDate);
  });

  test('Returns a borrowed book', async () => {
    // Arrange
    const book = await bookFactory.create();
    const member = await memberFactory.create();
    const startDate = new Date();
    const dueDate = new Date();
    const loan = await libraryService.lendBookToMember({
      bookId: book.id,
      dueDate,
      startDate,
      memberId: member.id,
    });
    const endDate = new Date();

    // Act
    const loadedLoan = await libraryService.returnBook({
      loanId: loan.id,
      endDate,
    });

    // Assert
    assert.deepEqual(loadedLoan.endDate, endDate);
    assert.equal(loadedLoan.lastChange().type, 'loan-closed');
  });

  test('When it lends a book the book is borrowed', async () => {
    // Arrange
    const book = await bookFactory.create();
    const member = await memberFactory.create();
    const startDate = new Date();
    const dueDate = new Date();

    // Act
    const loan = await libraryService.lendBookToMember({
      bookId: book.id,
      dueDate,
      startDate,
      memberId: member.id,
    });

    // Assert
    const loadedBook = await bookRepository.entityById(loan.bookId);
    assert.ok(loadedBook);
    assert.equal(loadedBook.status, BookStatus.Borrowed);
  });
});
