import { AppendResult, EventStoreDBClient } from '@eventstore/db-client';
import { Book } from '../domain/book.entity';
import { Change } from '../domain/interfaces/change.interface';

export class BookRepository {
  private readonly streamBaseName = 'book';
  constructor(public readonly eventStoreDbClient: EventStoreDBClient) {}

  public async save(book: Book): Promise<AppendResult> {
    const streamName = this.streamNameFor(book);
    return await this.eventStoreDbClient.appendToStream(
      streamName,
      book.changes as Change[],
    );
  }

  private streamNameFor(book: Book): string {
    return `${this.streamBaseName}-${book.id}`;
  }
}
