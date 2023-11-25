import { JSONEventType } from '@eventstore/db-client';

export type Change<
  T extends string = string,
  Data extends { occurredOn: Date } = { occurredOn: Date } & Record<string, unknown>,
> = JSONEventType<T, Data>;
