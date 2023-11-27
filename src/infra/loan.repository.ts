import { FORWARDS, START } from '@eventstore/db-client';
import { Loan } from '../domain/entities/loan.entity';
import { Repository } from './entity.repository';
import { Change } from '../domain/interfaces/change.interface';

export class LoanRepository extends Repository<Loan, 'loan'> {
  protected readonly streamBaseName = 'loan';

  async entityById(id: string): Promise<Loan> {
    const streamName = this.streamNameFor(id);
    const eventsStream = this.eventStoreDbClient.readStream(streamName, {
      fromRevision: START,
      direction: FORWARDS,
    });
    const loan = new Loan();
    for await (const { event } of eventsStream) {
      loan.when(event as unknown as Change);
    }

    return loan;
  }
}
