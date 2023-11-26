import { randomUUID } from 'crypto';
import { Entity } from './entity';
import { Change } from '../interfaces/change.interface';
import { Email } from '../value-objects/email.value-object';
import {
  Membership,
  MembershipStatus,
} from '../value-objects/membership.value-object';
import { Events } from '../events/events';
import {
  MemberNameUpdatedEvent,
  type MemberSignedUpEvent,
} from '../events/member.events';
import { Loan } from './loan.entity';
import { Book } from './book.entity';

export type SignupMemberProps = {
  name: string;
  email: Email;
};

export class Member extends Entity {
  public readonly name: string;
  public readonly email: Email;
  public readonly membership: Membership;

  public when(change: Change): void {
    switch (change.type) {
      case 'member-signed-up':
        const memberSignedUp = change as unknown as MemberSignedUpEvent;
        this.assign({
          name: memberSignedUp.data.name,
          email: new Email(memberSignedUp.data.email.value),
          membership: new Membership({
            startDate: new Date(memberSignedUp.data.membership.startDate),
            status: memberSignedUp.data.membership.status,
          }),
        });
        break;
      case 'member-name-updated':
        const memberNameUpdatedEvent =
          change as unknown as MemberNameUpdatedEvent;
        this.assign({
          name: memberNameUpdatedEvent.data.newName,
        });
    }
  }

  public updateName(newName: string) {
    const nameUpdatedEvent = Events.member.memberNameUpdated({
      newName,
      id: this.id,
      occurredOn: new Date().toISOString(),
    });

    this.apply(nameUpdatedEvent);
  }

  public borrow(bookId: string, loanDate: Date, dueDate: Date) {
    return Loan.create({
      bookId: bookId,
      dueDate,
      memberId: this.id,
      startDate: loanDate,
    });
  }

  public static signup(props: SignupMemberProps) {
    const newMember = new Member();
    const membership = new Membership({
      startDate: new Date(),
      status: MembershipStatus.Active,
    });
    const signupEvent = Events.member.memberSignedUp({
      ...props,
      id: randomUUID(),
      membership,
      occurredOn: new Date().toISOString(),
    });

    newMember.apply(signupEvent);

    return newMember;
  }
}
