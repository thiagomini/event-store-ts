import { Loan } from '../domain/entities/loan.entity';
import { Repository } from './entity.repository';

export class LoanRepository extends Repository<Loan, 'loan'> {
  entityById(id: string): Promise<Loan> {
    throw new Error('Method not implemented.');
  }
}
