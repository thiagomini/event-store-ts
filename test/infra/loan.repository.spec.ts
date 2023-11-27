import assert from 'node:assert';
import { after, describe, test } from 'node:test';
import { LoanRepository } from '../../src/infra/loan.repository';
import { eventStoreClient } from '../../src/infra/event-store.client';
import { Loan } from '../../src/domain/entities/loan.entity';

describe('Loan Repository', () => {
  after(async () => {
    await eventStoreClient.dispose();
  });

  test('saves a new book', async () => {
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
});
