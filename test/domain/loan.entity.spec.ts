import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { Loan } from '../../src/domain/loan.entity';

describe('LoanEntity', () => {
  test('a new loan is created', () => {
    // Act
    const aLoan = Loan.create({
      bookId: '1',
      memberId: '1',
      startDate: new Date('2021-01-01'),
      dueDate: new Date('2021-01-08'),
    });

    // Assert
    assert.ok(aLoan.id);
    assert.equal(aLoan.bookId, '1');
    assert.equal(aLoan.memberId, '1');
    assert.deepEqual(aLoan.startDate, new Date('2021-01-01'));
    assert.deepEqual(aLoan.dueDate, new Date('2021-01-08'));
    assert.equal(aLoan.endDate, undefined);

    assert.equal(aLoan.changes.length, 1);
    assert.equal(aLoan.changes[0].type, 'loan-created');
  });

  test('a loan is closed', () => {
    // Arrange
    const aLoan = Loan.create({
      bookId: '1',
      memberId: '1',
      startDate: new Date('2021-01-01'),
      dueDate: new Date('2021-01-08'),
    });

    // Act
    aLoan.close(new Date('2021-01-07'));

    // Assert
    assert.deepEqual(aLoan.endDate, new Date('2021-01-07'));
    assert.equal(aLoan.changes.length, 2);
    assert.equal(aLoan.changes[1].type, 'loan-closed');
  });

  test('a loan cannot be closed twice', () => {
    // Arrange
    const aLoan = Loan.create({
      bookId: '1',
      memberId: '1',
      startDate: new Date('2021-01-01'),
      dueDate: new Date('2021-01-08'),
    });
    aLoan.close(new Date('2021-01-07'));

    // Act
    const invalidOperation = () => aLoan.close(new Date('2021-01-07'));

    // Assert
    assert.throws(invalidOperation, new Error('Loan already closed'));
  });

  test('a loan cannot be closed before the start date', () => {
    // Arrange
    const aLoan = Loan.create({
      bookId: '1',
      memberId: '1',
      startDate: new Date('2021-01-02'),
      dueDate: new Date('2021-01-09'),
    });

    // Act
    const invalidOperation = () => aLoan.close(new Date('2021-01-01'));

    // Assert
    assert.throws(
      invalidOperation,
      new Error('Loan cannot be closed before the start date'),
    );
  });

  test('a loan expires', () => {
    // Arrange
    const aLoan = Loan.create({
      bookId: '1',
      memberId: '1',
      startDate: new Date('2021-01-02'),
      dueDate: new Date('2021-01-09'),
    });

    // Act
    const result = aLoan.isExpiredAt(new Date('2021-01-10'));

    // Assert
    assert.equal(result, true);
  });
});
