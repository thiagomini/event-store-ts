import { Loan } from '../domain/entities/loan.entity';
import { LoanService } from '../domain/services/loan.service';
import { BookRepository } from '../infra/book.repository';
import { LoanRepository } from '../infra/loan.repository';
import { MemberRepository } from '../infra/member.repository';
import { LendBookToMemberCommand } from './commands/lend-book-to-member.command';
import { ReturnBookCommand } from './commands/return-book.command';

export class LibraryService {
  constructor(
    private readonly loanService: LoanService,
    private readonly bookRepository: BookRepository,
    private readonly memberRepository: MemberRepository,
    private readonly loanRepository: LoanRepository,
  ) {}

  async lendBookToMember(command: LendBookToMemberCommand): Promise<Loan> {
    const book = await this.bookRepository.entityById(command.bookId);
    const member = await this.memberRepository.entityById(command.memberId);
    const loan = this.loanService.lendBookToMember({
      book,
      member,
      startDate: command.startDate,
      dueDate: command.dueDate,
    });
    await this.loanRepository.save(loan);
    await this.bookRepository.save(book);

    return loan;
  }

  async returnBook(command: ReturnBookCommand): Promise<Loan> {
    const loan = await this.loanRepository.entityById(command.loanId);
    const book = await this.bookRepository.entityById(loan.bookId);
    this.loanService.returnBook({
      loan,
      endDate: command.endDate,
      book,
    });
    await this.loanRepository.save(loan);
    await this.bookRepository.save(book);
    return loan;
  }
}
