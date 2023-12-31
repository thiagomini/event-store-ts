import { Book } from '../entities/book.entity';
import { Loan } from '../entities/loan.entity';
import { Member } from '../entities/member.entity';

export type LoanBookToMemberCommand = {
  book: Book;
  startDate: Date;
  dueDate: Date;
  member: Member;
};

export type ReturnBookProps = {
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
    if (!book.isAvailable()) {
      throw new Error('The book is not available');
    }
    const loan = member.borrow(book.id, startDate, dueDate);
    book.borrow();
    return loan;
  }

  public returnBook({ loan, book, endDate }: ReturnBookProps) {
    if (book.isAvailable()) {
      throw new Error('Book is already available');
    }
    loan.close(endDate);
    book.return();
  }
}
