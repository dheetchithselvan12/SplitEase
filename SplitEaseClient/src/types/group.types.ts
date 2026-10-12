import type { Expense } from './expense.types';

export interface Group {
  groupId: number;
  name: string;
  description?: string;
  createdBy: number;
  memberCount?: number;
  createdAt?: string;
}

export interface GroupMember {
  groupMemberId: number;
  groupId: number;
  userId: number;
  name: string;
  mobile: string;
  joinedAt: string;
}

export interface GroupDetails extends Group {
  members: GroupMember[];
  recentExpenses: Expense[];
}

export interface CreateGroupData {
  name: string;
  description: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface AddMemberRequest {
  mobile: string;
  userId?: number;
}

export interface GroupState {
  groups: Group[];
  currentGroup: GroupDetails | null;
  loading: boolean;
  error: string | null;
}