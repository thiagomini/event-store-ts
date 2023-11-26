import { EventData, JSONEventType, JSONType } from '@eventstore/db-client';

export type Change<
  T extends string = string,
  Data extends { occurredOn: string } = { occurredOn: string } & Record<
    string,
    unknown
  >,
> = EventData<JSONEventType<T, Data>>;
