import { jsonEvent, type JSONEventType } from '@eventstore/db-client';
import { CreateLoanProps } from '../entities/loan.entity';

export type LoanCreatedEventProps = CreateLoanProps & {
  id: string;
  occurredOn: string;
};

export type LoanCreatedEvent = JSONEventType<
  'loan-created',
  LoanCreatedEventProps
>;

export type LoanClosedEventProps = {
  id: string;
  endDate: string;
  occurredOn: string;
};

export type LoanClosedEvent = JSONEventType<
  'loan-closed',
  LoanClosedEventProps
>;

export const loan = {
  loanCreated(props: LoanCreatedEventProps) {
    return jsonEvent<LoanCreatedEvent>({
      type: 'loan-created',
      data: props,
    });
  },
  loanClosed(props: LoanClosedEventProps) {
    return jsonEvent<LoanClosedEvent>({
      type: 'loan-closed',
      data: props,
    });
  },
};
