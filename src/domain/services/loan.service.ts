import { Book } from '../entities/book.entity';
import { Member } from '../entities/member.entity';

export type LoanBookToMemberCommand = {
  book: Book;
  startDate: Date;
  dueDate: Date;
  member: Member;
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
}
