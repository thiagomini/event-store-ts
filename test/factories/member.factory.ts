import {
  Member,
  SignupMemberProps,
} from '../../src/domain/entities/member.entity';
import { Email } from '../../src/domain/value-objects/email.value-object';
import { eventStoreClient } from '../../src/infra/event-store.client';
import { MemberRepository } from '../../src/infra/member.repository';

export class MemberFactory {
  constructor(private memberRepository?: MemberRepository) {}

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

  public async create(props: Partial<SignupMemberProps> = {}): Promise<Member> {
    if (!this.memberRepository) {
      this.memberRepository = new MemberRepository(eventStoreClient);
    }
    const member = this.build(props);
    await this.memberRepository.save(member);
    return member;
  }
}
