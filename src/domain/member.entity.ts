import { randomUUID } from 'crypto';
import { Entity } from './entity';
import { Change } from './interfaces/change.interface';
import { Email } from './email.value-object';
import { Membership, MembershipStatus } from './membership.value-object';
import { Events } from './events/events';

export type SignupMemberProps = {
  name: string;
  email: Email;
};

export class Member extends Entity {
  public readonly name: string;
  public readonly email: Email;
  public readonly membership: Membership;

  public when(change: Change): void {
    this.assign(change.data);
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
      occurredOn: new Date(),
    });

    newMember.apply(signupEvent);

    return newMember;
  }
}
