import { randomUUID } from 'crypto';
import { Entity } from './entity';
import { Change } from './interfaces/change.interface';
import { Events } from './events/events';
import { type LoanCreatedEvent } from './events/loan.events';

export type CreateLoanProps = {
  memberId: string;
  bookId: string;
  startDate: Date;
  dueDate: Date;
};

export class Loan extends Entity {
  public readonly memberId: string;
  public readonly bookId: string;
  public readonly startDate: Date;
  public readonly dueDate: Date;
  public readonly endDate?: Date;

  public when(change: Change): void {
    switch (change.type) {
      case 'loan-created':
        const loanCreatedEvent = change as unknown as LoanCreatedEvent;
        this.assign({
          id: loanCreatedEvent.data.id,
          memberId: loanCreatedEvent.data.memberId,
          bookId: loanCreatedEvent.data.bookId,
          startDate: new Date(loanCreatedEvent.data.startDate),
          dueDate: new Date(loanCreatedEvent.data.dueDate),
        });
        break;
    }
  }

  public static create(props: CreateLoanProps) {
    const loanCreatedEvent = Events.loan.loanCreated({
      ...props,
      id: randomUUID(),
      occurredOn: new Date().toISOString(),
    });
    const newLoan = new Loan();
    newLoan.apply(loanCreatedEvent);
    return newLoan;
  }
}
