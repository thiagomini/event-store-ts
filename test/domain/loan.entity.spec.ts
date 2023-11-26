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
  });
});
