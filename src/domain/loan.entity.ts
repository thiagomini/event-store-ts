import { randomUUID } from 'crypto';
import { Entity } from './entity';
import { Change } from './interfaces/change.interface';
import { Events } from './events/events';
import { LoanClosedEvent, type LoanCreatedEvent } from './events/loan.events';

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
      case 'loan-closed':
        const loanEndedEvent = change as unknown as LoanClosedEvent;
        this.assign({
          endDate: new Date(loanEndedEvent.data.endDate),
        });
        break;
    }
  }

  public close(endDate: Date) {
    if (this.endDate) {
      throw new Error('Loan already closed');
    }

    if (endDate < this.startDate) {
      throw new Error('Loan cannot be closed before the start date');
    }

    this.apply(
      Events.loan.loanClosed({
        id: this.id,
        endDate: endDate.toISOString(),
        occurredOn: new Date().toISOString(),
      }),
    );
  }

  public isExpiredAt(date: Date): boolean {
    return date > this.dueDate;
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
