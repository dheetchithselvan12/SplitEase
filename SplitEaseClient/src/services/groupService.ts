import api, { unwrapApiArray, unwrapApiObject } from './api';
import type { AddMemberRequest, CreateGroupRequest, Group, GroupDetails } from '../types/group.types';

const unwrapGroupPayload = (payload: any): { group: any; members: any[]; recentExpenses: any[] } => {
  const wrapper = unwrapApiObject(payload);
  const root = wrapper.data ?? wrapper.Data ?? wrapper.result ?? wrapper.Result ?? wrapper;
  const group = root?.groupDetail ?? root?.GroupDetail ?? root?.group ?? root?.Group ?? root ?? {};
  const members = Array.isArray(root?.groupMembers)
    ? root.groupMembers
    : Array.isArray(root?.GroupMembers)
      ? root.GroupMembers
      : Array.isArray(group?.members)
        ? group.members
        : Array.isArray(group?.Members)
          ? group.Members
          : [];

  const recentExpenses = Array.isArray(root?.recentExpenses)
    ? root.recentExpenses
    : Array.isArray(root?.RecentExpenses)
      ? root.RecentExpenses
      : [];

  return { group, members, recentExpenses };
};

const normalizeGroup = (payload: any): GroupDetails => {
  const { group, members, recentExpenses } = unwrapGroupPayload(payload);

  const normalized = {
    groupId: group.groupId ?? group.GroupId ?? 0,
    name: group.name ?? group.Name ?? group.groupName ?? group.GroupName ?? 'Group',
    description: group.description ?? group.Description ?? '',
    createdBy: group.createdBy ?? group.CreatedBy ?? 0,
    memberCount: group.memberCount ?? group.MemberCount ?? members.length ?? 0,
    createdAt: group.createdAt ?? group.CreatedAt ?? '',
    members,
    recentExpenses,
  };

  return normalized as GroupDetails;
};

export const groupService = {
  getGroups: async (): Promise<Group[]> => {
    const response = await api.get('/Group/ViewInit');
    const payload = unwrapApiArray(response.data);

    return payload.map((group: any) => ({
      groupId: group.groupId ?? group.GroupId ?? 0,
      name: group.name ?? group.Name ?? group.groupName ?? group.GroupName ?? 'Group',
      description: group.description ?? group.Description ?? '',
      createdBy: group.createdBy ?? group.CreatedBy ?? 0,
      memberCount: group.memberCount ?? group.MemberCount ?? 0,
      createdAt: group.createdAt ?? group.CreatedAt ?? '',
    }));
  },

  getGroupById: async (id: number): Promise<GroupDetails> => {
    const response = await api.get(`/Group/PageInit/${id}`);
    const payload = unwrapApiObject(response.data);

    return normalizeGroup(payload);
  },

  createGroup: async (data: CreateGroupRequest): Promise<Group> => {
    const response = await api.post('/Group/Create', {
      Group: {
        Name: data.name,
        Description: data.description ?? '',
      },
    });
    const payload = unwrapApiObject(response.data);
    return (payload?.group ?? payload?.Group ?? payload?.data ?? payload?.Data ?? payload?.result ?? payload?.Result ?? payload) as Group;
  },

  addMember: async (groupId: number, data: AddMemberRequest): Promise<any> => {
    const response = await api.post('/Group/AddMember', {
      Member: {
        GroupId: groupId,
        Mobile: data.mobile,
      },
    });
    const payload = unwrapApiObject(response.data);

    if (payload && payload.isSuccess === false) {
      throw new Error(payload.message || 'Failed to add member');
    }

    return payload?.group ?? payload?.Group ?? payload?.data ?? payload?.Data ?? payload?.result ?? payload?.Result ?? payload;
  },

  deleteGroup: async (groupId: number): Promise<void> => {
    await api.delete(`/Group/Delete/${groupId}`);
  },
};