import { AppendResult, EventStoreDBClient } from '@eventstore/db-client';
import { Entity } from '../domain/entities/entity';
import { Change } from '../domain/interfaces/change.interface';

export abstract class Repository<T extends Entity, Name extends string> {
  protected readonly streamBaseName: Name;
  constructor(protected readonly eventStoreDbClient: EventStoreDBClient) {}
  async save(entity: T): Promise<AppendResult> {
    const streamName = this.streamNameFor(entity);
    return await this.eventStoreDbClient.appendToStream(
      streamName,
      entity.changes as Change[],
    );
  }
  abstract entityById(id: string): Promise<T>;
  protected streamNameFor(entityOrId: T | string) {
    const id = entityOrId instanceof Entity ? entityOrId.id : entityOrId;
    return `${this.streamBaseName}-${id}`;
  }
}
