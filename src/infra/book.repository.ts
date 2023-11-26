import { FORWARDS, START } from '@eventstore/db-client';
import { Book } from '../domain/book.entity';
import { Change } from '../domain/interfaces/change.interface';
import { Repository } from './entity.repository';

export class BookRepository extends Repository<Book, 'book'> {
  protected readonly streamBaseName = 'book';

  public async entityById(id: string) {
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
}
