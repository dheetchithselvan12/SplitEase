import type { GroupMember } from '../../types/group.types';

interface Props {
  members: GroupMember[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

const ParticipantSelect = ({ members, selectedIds, onChange }: Props) => {
  const safeMembers = Array.isArray(members) ? members : [];

  const toggle = (userId: number) => {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedIds, userId]);
    }
  };

  const allSelected = safeMembers.length > 0 && selectedIds.length === safeMembers.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Split Between *
        </label>
        <button
          type="button"
          onClick={() =>
            onChange(allSelected ? [] : safeMembers.map((m) => m.userId))
          }
          className="text-xs text-primary-600 hover:underline"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
        {safeMembers.map((member) => (
          <label
            key={member.userId}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(member.userId)}
              onChange={() => toggle(member.userId)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xs">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">{member.mobile}</p>
            </div>
          </label>
        ))}
      </div>

      {selectedIds.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {selectedIds.length} participant{selectedIds.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};

export default ParticipantSelect;