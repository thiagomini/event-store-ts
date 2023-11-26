import { jsonEvent, type JSONEventType } from '@eventstore/db-client';
import { CreateLoanProps } from '../loan.entity';

export type LoanCreatedEventProps = CreateLoanProps & {
  id: string;
  occurredOn: string;
};

export type LoanCreatedEvent = JSONEventType<
  'loan-created',
  LoanCreatedEventProps
>;

export type LoanEndedEventProps = {
  id: string;
  endDate: string;
  occurredOn: string;
};

export type LoanEndedEvent = JSONEventType<'loan-ended', LoanEndedEventProps>;

export const loan = {
  loanCreated(props: LoanCreatedEventProps) {
    return jsonEvent<LoanCreatedEvent>({
      type: 'loan-created',
      data: props,
    });
  },
  loanEnded(props: LoanEndedEventProps) {
    return jsonEvent<LoanEndedEvent>({
      type: 'loan-ended',
      data: props,
    });
  },
};
