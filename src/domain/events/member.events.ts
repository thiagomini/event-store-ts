import { JSONEventType, jsonEvent } from '@eventstore/db-client';
import { type SignupMemberProps } from '../member.entity';
import { type Membership } from '../membership.value-object';

type MemberSignedUpEventProps = SignupMemberProps & {
  id: string;
  occurredOn: Date;
  membership: Membership;
};

type MemberSignedUpEvent = JSONEventType<
  'member-signed-up',
  MemberSignedUpEventProps
>;

export type MemberNameUpdatedEventProps = {
  id: string;
  occurredOn: Date;
  newName: string;
};

export type MemberNameUpdatedEvent = JSONEventType<
  'member-name-updated',
  MemberNameUpdatedEventProps
>;

export const member = {
  memberSignedUp(props: MemberSignedUpEventProps) {
    return jsonEvent<MemberSignedUpEvent>({
      type: 'member-signed-up',
      data: props,
    });
  },

  memberNameUpdated(props: MemberNameUpdatedEventProps) {
    return jsonEvent<MemberNameUpdatedEvent>({
      type: 'member-name-updated',
      data: props,
    });
  },
};
