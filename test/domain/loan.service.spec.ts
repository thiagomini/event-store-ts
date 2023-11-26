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
import { MemberFactory } from '../factories/member.factory';
import { BookFactory } from '../factories/book.factory';
import { Loan } from '../../src/domain/entities/loan.entity';

describe('Loan Service', () => {
  const memberFactory = new MemberFactory();
  const bookFactory = new BookFactory();

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

  test('Cannot lend an unavailable book', () => {
    // Arrange
    const aMember = memberFactory.build();
    const aBook = bookFactory.build({
      status: BookStatus.Borrowed,
    });
    const loanService = new LoanService();

    // Act
    const startDate = new Date();
    const dueDate = addDays(startDate, 7);
    const invalidOperation = () =>
      loanService.lendBookToMember({
        book: aBook,
        dueDate,
        startDate,
        member: aMember,
      });

    // Assert
    assert.throws(invalidOperation, new Error('The book is not available'));
  });

  test('Returns a book from a member', () => {
    // Arrange
    const aMember = memberFactory.build();
    const aBook = bookFactory.build();
    const loanService = new LoanService();
    const loan = loanService.lendBookToMember({
      book: aBook,
      dueDate: addDays(new Date(), 7),
      startDate: new Date(),
      member: aMember,
    });

    // Act
    const endDate = new Date();
    loanService.returnBook({
      loan,
      book: aBook,
      endDate,
    });

    // Assert
    assert.equal(loan.memberId, aMember.id);
    assert.equal(loan.bookId, aBook.id);
    assert.deepEqual(loan.endDate, endDate);

    assert.equal(aBook.status, BookStatus.Available);
    assert.equal(aBook.changes.length, 3);
    assert.equal(aBook.lastChange().type, 'book-returned');
  });

  test('Cannot return a book that is available', () => {
    // Arrange
    const aMember = memberFactory.build();
    const aBook = bookFactory.build();
    const loanService = new LoanService();
    const loan = Loan.create({
      bookId: aBook.id,
      dueDate: addDays(new Date(), 7),
      memberId: aMember.id,
      startDate: new Date(),
    });
    // Act
    const endDate = new Date();
    const invalidOperation = () =>
      loanService.returnBook({
        loan,
        book: aBook,
        endDate,
      });

    // Assert
    assert.throws(invalidOperation, new Error('Book is already available'));
  });
});

function addDays(loanDate: Date, days: number) {
  return new Date(loanDate.getTime() + days * 24 * 60 * 60 * 1000);
}
