import {
  AppendResult,
  EventStoreDBClient,
  FORWARDS,
  START,
} from '@eventstore/db-client';
import { Book } from '../domain/book.entity';
import { Change } from '../domain/interfaces/change.interface';

export class BookRepository {
  private readonly streamBaseName = 'book';
  constructor(private readonly eventStoreDbClient: EventStoreDBClient) {}

  public async save(book: Book): Promise<AppendResult> {
    const streamName = this.streamNameFor(book);
    return await this.eventStoreDbClient.appendToStream(
      streamName,
      book.changes as Change[],
    );
  }

  public async bookById(id: string) {
    const bookStreamName = this.streamNameFor(id);
    const events = this.eventStoreDbClient.readStream<Change>(bookStreamName, {
      fromRevision: START,
      direction: FORWARDS,
    });
    const book = new Book();
    for await (const { event } of events) {
      book.when(event as unknown as Change);
    }

    return book;
  }

  private streamNameFor(bookOrId: Book | string): string {
    const id = bookOrId instanceof Book ? bookOrId.id : bookOrId;
    return `${this.streamBaseName}-${id}`;
  }
}
