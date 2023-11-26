import test, { describe } from 'node:test';
import { Member } from '../../src/domain/entities/member.entity';
import { Email } from '../../src/domain/value-objects/email.value-object';
import {
  Book,
  BookGenre,
  BookStatus,
} from '../../src/domain/entities/book.entity';
import { LoanService } from '../../src/domain/services/loan.service';
import assert from 'node:assert/strict';

describe('Loan Service', () => {
  test('Lends a book to a member', () => {
    // Arrange
    const aMember = Member.signup({
      email: new Email('john@doe.com'),
      name: 'John Doe',
    });
    const aBook = Book.register({
      title: 'The Lord of the Rings',
      author: 'J. R. R. Tolkien',
      genre: BookGenre.Fantasy,
      isbn: '978-3-16-148410-0',
      publishDate: new Date('1954-07-29'),
    });
    const loanService = new LoanService();

    // Act
    const startDate = new Date();
    const dueDate = addDays(startDate, 7);
    const loan = loanService.lendBookToMember({
      book: aBook,
      dueDate,
      startDate,
      member: aMember,
    });

    // Assert
    assert.equal(loan.memberId, aMember.id);
    assert.equal(loan.bookId, aBook.id);
    assert.deepEqual(loan.startDate, startDate);
    assert.deepEqual(loan.dueDate, dueDate);
    assert.equal(loan.endDate, undefined);

    assert.equal(aBook.status, BookStatus.Borrowed);
    assert.equal(aBook.changes.length, 2);
    assert.equal(aBook.lastChange().type, 'book-borrowed');
  });
});

function addDays(loanDate: Date, days: number) {
  return new Date(loanDate.getTime() + days * 24 * 60 * 60 * 1000);
}
