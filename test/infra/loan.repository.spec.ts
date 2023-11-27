import assert from 'node:assert/strict';
import { after, describe, test } from 'node:test';
import { LoanRepository } from '../../src/infra/loan.repository';
import { eventStoreClient } from '../../src/infra/event-store.client';
import { Loan } from '../../src/domain/entities/loan.entity';

describe('Loan Repository', () => {
  after(async () => {
    await eventStoreClient.dispose();
  });

  test('saves a new loan', async () => {
    // Arrange
    const aLoan = Loan.create({
      bookId: '1',
      memberId: '1',
      startDate: new Date(),
      dueDate: new Date(),
    });
    const repository = new LoanRepository(eventStoreClient);

    // Act
    const response = await repository.save(aLoan);

    // Assert
    assert.ok(response.success);
  });

  test('returns a loan by id', async () => {
    // Arrange
    const aLoan = Loan.create({
      bookId: '1',
      memberId: '1',
      startDate: new Date(),
      dueDate: new Date(),
    });
    const repository = new LoanRepository(eventStoreClient);
    await repository.save(aLoan);

    // Act
    const loanLoaded = await repository.entityById(aLoan.id);

    // Assert
    assert.deepEqual(loanLoaded.id, aLoan.id);
    assert.deepEqual(loanLoaded.bookId, aLoan.bookId);
    assert.deepEqual(loanLoaded.memberId, aLoan.memberId);
    assert.deepEqual(loanLoaded.startDate, aLoan.startDate);
    assert.deepEqual(loanLoaded.dueDate, aLoan.dueDate);
  });

  test('throws an error when loan is not found', async () => {
    // Arrange
    const repository = new LoanRepository(eventStoreClient);

    // Act
    const promise = repository.entityById('non-existent-id');

    // Assert
    await assert.rejects(promise, new Error('loan-non-existent-id not found'));
  });

  test('updates a loan', async () => {
    // Arrange
    const aLoan = Loan.create({
      bookId: '1',
      memberId: '1',
      startDate: new Date(),
      dueDate: new Date(),
    });
    const repository = new LoanRepository(eventStoreClient);
    await repository.save(aLoan);
    const loanLoaded = await repository.entityById(aLoan.id);
    loanLoaded.close(new Date());

    // Act
    const response = await repository.save(loanLoaded);

    // Assert
    assert.ok(response.success);
    assert.ok(loanLoaded.endDate);
  });
});
