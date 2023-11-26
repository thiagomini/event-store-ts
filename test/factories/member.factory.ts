import {
  Member,
  SignupMemberProps,
} from '../../src/domain/entities/member.entity';
import { Email } from '../../src/domain/value-objects/email.value-object';

export class MemberFactory {
  public build(props: Partial<SignupMemberProps> = {}) {
    const defaultSignupMemberProps: SignupMemberProps = {
      email: new Email('john@doe.com'),
      name: 'John Doe',
    };
    return Member.signup({
      ...defaultSignupMemberProps,
      ...props,
    });
  }
}
