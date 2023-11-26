import { Book } from '../entities/book.entity';
import { Loan } from '../entities/loan.entity';
import { Member } from '../entities/member.entity';

export type LoanBookToMemberCommand = {
  book: Book;
  startDate: Date;
  dueDate: Date;
  member: Member;
};

export type ReturnBookCommand = {
  loan: Loan;
  book: Book;
  endDate: Date;
};
export class LoanService {
  public lendBookToMember({
    book,
    dueDate,
    member,
    startDate,
  }: LoanBookToMemberCommand) {
    const loan = member.borrow(book.id, startDate, dueDate);
    book.borrow();
    return loan;
  }

  public returnBook({ loan, book, endDate }: ReturnBookCommand) {
    loan.close(endDate);
    book.return();
  }
}
