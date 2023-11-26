import { FORWARDS, START } from '@eventstore/db-client';
import { Change } from '../domain/interfaces/change.interface';
import { Member } from '../domain/member.entity';
import { Repository } from './entity.repository';

export class MemberRepository extends Repository<Member, 'member'> {
  protected readonly streamBaseName = 'member';

  public async entityById(id: string): Promise<Member> {
    const streamName = this.streamNameFor(id);
    const eventsStream = this.eventStoreDbClient.readStream(streamName, {
      fromRevision: START,
      direction: FORWARDS,
    });
    const member = new Member();
    for await (const { event } of eventsStream) {
      member.when(event as unknown as Change);
    }

    return member;
  }
}
