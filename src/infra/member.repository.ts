import {
  AppendResult,
  EventStoreDBClient,
  FORWARDS,
  START,
} from '@eventstore/db-client';
import { Member } from '../domain/member.entity';
import { Change } from '../domain/interfaces/change.interface';

export class MemberRepository {
  private readonly streamBaseName = 'member';
  constructor(private readonly eventStoreDbClient: EventStoreDBClient) {}

  public async save(member: Member): Promise<AppendResult> {
    const streamName = this.streamNameFor(member);
    return await this.eventStoreDbClient.appendToStream(
      streamName,
      member.changes as Change[],
    );
  }

  public async memberById(id: string): Promise<Member> {
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

  streamNameFor(memberOrId: Member | string) {
    const id = memberOrId instanceof Member ? memberOrId.id : memberOrId;
    return `${this.streamBaseName}-${id}`;
  }
}
