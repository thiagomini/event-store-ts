import test, { after, describe } from 'node:test';
import { BookFactory } from '../factories/book.factory';
import { MemberFactory } from '../factories/member.factory';
import { BookRepository } from '../../src/infra/book.repository';
import { eventStoreClient } from '../../src/infra/event-store.client';
import { MemberRepository } from '../../src/infra/member.repository';
import { LibraryService } from '../../src/application/library.service';
import assert from 'node:assert/strict';
import { LoanService } from '../../src/domain/services/loan.service';

describe('Library Service', () => {
  const bookRepository = new BookRepository(eventStoreClient);
  const bookFactory = new BookFactory(bookRepository);
  const memberRepository = new MemberRepository(eventStoreClient);
  const memberFactory = new MemberFactory(memberRepository);
  const loanService = new LoanService();
  const libraryService = new LibraryService(
    loanService,
    bookRepository,
    memberRepository,
  );

  after(async () => {
    await eventStoreClient.dispose();
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
  });
});
