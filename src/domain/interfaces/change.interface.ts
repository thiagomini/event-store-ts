import { JSONEventType } from '@eventstore/db-client';

export type Change<
  T extends string = string,
  Data extends { occurredOn: Date } = { occurredOn: Date },
> = JSONEventType<T, Data>;
