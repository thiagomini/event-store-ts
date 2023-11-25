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
    assert.equal(aMember.changes.length, 1);
    assert.equal(aMember.changes[0].type, 'member-signed-up');
  });

  test('A member updates its name', () => {
    // Arrange
    const aMember = Member.signup({
      name: 'John',
      email: new Email('john@doe.com'),
    });

    // Act
    aMember.updateName('Jane');

    // Assert
    assert.equal(aMember.name, 'Jane');
    assert.equal(aMember.email.value, 'john@doe.com');
    assert.ok(aMember.membership.startDate instanceof Date);
    assert.equal(aMember.membership.status, MembershipStatus.Active);
    assert.equal(aMember.changes.length, 2);
    assert.equal(aMember.changes[1].type, 'member-name-updated');
  });
});
