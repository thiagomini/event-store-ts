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
    switch (change.type) {
      case 'member-signed-up':
        this.assign({
          name: change.data.name,
          email: new Email((change.data.email as Email).value),
          membership: new Membership({
            startDate: new Date(
              (change.data.membership as Membership).startDate,
            ),
            status: (change.data.membership as Membership).status,
          }),
        });
        break;
      case 'member-name-updated':
        this.assign({
          name: change.data.newName,
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
