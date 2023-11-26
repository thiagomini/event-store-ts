import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { Member } from '../../src/domain/entities/member.entity';
import { Email } from '../../src/domain/value-objects/email.value-object';
import { MembershipStatus } from '../../src/domain/value-objects/membership.value-object';
import { Book, BookGenre } from '../../src/domain/entities/book.entity';

describe('Member Entity', () => {
  test('A new member is signed up', () => {
    // Act
    const aMember = Member.signup({
      name: 'John',
      email: new Email('john@doe.com'),
    });

    // Assert
    assert.equal(aMember.name, 'John');
    assert.equal(aMember.email.value, 'john@doe.com');
    assert.ok(aMember.membership.startDate instanceof Date);
    assert.equal(aMember.membership.status, MembershipStatus.Active);
    assert.equal(aMember.changes.length, 1);
    assert.equal(aMember.changes[0].type, 'member-signed-up');
  });

  test('A member updates its name', () => {
    // Arrange
    const aMember = Member.signup({
      name: 'John',
      email: new Email('john@doe.com'),
    });

    // Act
    aMember.updateName('Jane');

    // Assert
    assert.equal(aMember.name, 'Jane');
    assert.equal(aMember.email.value, 'john@doe.com');
    assert.ok(aMember.membership.startDate instanceof Date);
    assert.equal(aMember.membership.status, MembershipStatus.Active);
    assert.equal(aMember.changes.length, 2);
    assert.equal(aMember.changes[1].type, 'member-name-updated');
  });

  test('A member borrows a book', () => {
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

    // Act
    const loanDate = new Date();
    const dueDate = addDays(loanDate, 7);
    const loan = aMember.borrow(aBook, loanDate, dueDate);

    // Assert
    assert.equal(loan.memberId, aMember.id);
    assert.equal(loan.bookId, aBook.id);
    assert.deepEqual(loan.startDate, loanDate);
    assert.deepEqual(loan.dueDate, dueDate);
    assert.equal(loan.endDate, undefined);
  });
});

function addDays(loanDate: Date, days: number) {
  return new Date(loanDate.getTime() + days * 24 * 60 * 60 * 1000);
}

