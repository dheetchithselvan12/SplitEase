import type { GroupMember } from '../../types/group.types';

interface Props {
  members: GroupMember[];
  onAddClick: () => void;
}

const GroupMembers = ({ members, onAddClick }: Props) => {
  const safeMembers = Array.isArray(members) ? members : [];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Members ({safeMembers.length})</h3>
        <button
          onClick={onAddClick}
          className="text-sm text-primary-600 hover:underline flex items-center gap-1"
        >
          <i className="pi pi-plus text-xs" />
          Add Member
        </button>
      </div>

      <div className="space-y-2">
        {safeMembers.map((member) => (
          <div key={member.groupMemberId} className="flex items-center gap-3 py-2">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">{member.mobile}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;