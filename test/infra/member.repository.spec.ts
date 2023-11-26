import test, { after, describe } from 'node:test';
import { eventStoreClient } from '../../src/infra/event-store.client';
import assert from 'node:assert/strict';
import { Member } from '../../src/domain/member.entity';
import { Email } from '../../src/domain/email.value-object';
import { MemberRepository } from '../../src/infra/member.repository';

describe('Member Repository', () => {
  after(async () => {
    await eventStoreClient.dispose();
  });

  test('saves a new Member', async () => {
    // Arrange
    const aMember = Member.signup({
      name: 'John',
      email: new Email('john@doe.com'),
    });

    const repository = new MemberRepository(eventStoreClient);

    // Act
    const response = await repository.save(aMember);

    // Assert
    assert.ok(response.success);
  });

  test('finds an existing member', async () => {
    // Arrange
    const aMember = Member.signup({
      name: 'John',
      email: new Email('john@doe.com'),
    });
    const repository = new MemberRepository(eventStoreClient);
    await repository.save(aMember);

    // Act
    const memberLoaded = await repository.memberById(aMember.id);

    // Assert
    assert.deepEqual(memberLoaded.id, aMember.id);
    assert.deepEqual(memberLoaded.name, aMember.name);
    assert.deepEqual(memberLoaded.email, aMember.email);
    assert.deepEqual(memberLoaded.membership, aMember.membership);
  });
});
