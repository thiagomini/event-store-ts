import { EventStoreDBClient } from '@eventstore/db-client';

export const eventStoreClient = EventStoreDBClient.connectionString`esdb+discover://localhost:2113?tls=false&keepAliveTimeout=10000&keepAliveInterval=10000`;
