export type LendBookToMemberCommand = {
  bookId: string;
  memberId: string;
  startDate: Date;
  dueDate: Date;
};
