import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { Member } from '../../src/domain/member.entity';
import { Email } from '../../src/domain/email.value-object';
import { MembershipStatus } from '../../src/domain/membership.value-object';

describe('Member Entity', () => {
  test('A new member is signed up', () => {
    // Act
    const aMember = Member.signup({
      name: 'John',
      email: new Email('john@doe.com'),
    });

    // Assert
    assert.equal(aMember.name, 'John');
    assert.equal(aMember.email.value, 'john@doe.com');
    assert.ok(aMember.membership.startDate instanceof Date);
    assert.equal(aMember.membership.status, MembershipStatus.Active);
  });
});
