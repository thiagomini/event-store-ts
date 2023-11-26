export enum MembershipStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export type CreateMembershipProps = {
  startDate: Date;
  status: MembershipStatus;
};

export class Membership {
  public readonly startDate: Date;
  public readonly status: MembershipStatus;

  constructor(props: CreateMembershipProps) {
    this.startDate = props.startDate;
    this.status = props.status;
  }
}
