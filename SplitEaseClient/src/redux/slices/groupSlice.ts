import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { groupService } from '../../services/groupService';
import type { AddMemberRequest, CreateGroupRequest, GroupState } from '../../types/group.types';

const initialState: GroupState = {
  groups: [],
  currentGroup: null,
  loading: false,
  error: null,
};

export const fetchGroups = createAsyncThunk(
  'groups/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await groupService.getGroups();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch groups');
    }
  }
);

export const fetchGroupById = createAsyncThunk(
  'groups/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await groupService.getGroupById(id);
      return res
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch group');
    }
  }
);

export const createGroup = createAsyncThunk(
  'groups/create',
  async (data: CreateGroupRequest, { rejectWithValue }) => {
    try {
      return await groupService.createGroup(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create group');
    }
  }
);

export const addMember = createAsyncThunk(
  'groups/addMember',
  async ({ groupId, data }: { groupId: number; data: AddMemberRequest }, { rejectWithValue }) => {
    try {
      return await groupService.addMember(groupId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add member');
    }
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;      
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGroupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGroup = action.payload;
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        const createdGroup = ((action.payload as any)?.data ?? action.payload) as any;
        if (createdGroup && createdGroup.groupId) {
          state.groups.unshift(createdGroup);
        }
      })
      .addCase(addMember.fulfilled, (state, action) => {
        const newMember = ((action.payload as any)?.data ?? action.payload) as any;

        if (!newMember || !state.currentGroup) {
          return;
        }

        const existing = state.currentGroup.members ?? [];
        const duplicate = existing.some(
          (member) => member.userId === newMember.userId || member.mobile === newMember.mobile
        );

        if (!duplicate) {
          state.currentGroup.members = [
            ...existing,
            {
              groupMemberId: newMember.userId,
              groupId: state.currentGroup.groupId,
              userId: newMember.userId,
              name: newMember.name,
              mobile: newMember.mobile,
              joinedAt: new Date().toISOString(),
            },
          ];
        }
      });
  },
});

export const { clearCurrentGroup, clearError } = groupSlice.actions;
export default groupSlice.reducer;