import type { GroupDetails } from '../../types/group.types';

interface Props {
  group: GroupDetails;
  onAddExpense: () => void;
}

const GroupHeader = ({ group, onAddExpense }: Props) => {
  const safeMembers = Array.isArray(group.members) ? group.members : [];

  return (
    <div className="card mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
            {group.description && (
              <p className="text-gray-500 text-sm mt-1">{group.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {safeMembers.length} members
            </p>
          </div>
        </div>
        <button onClick={onAddExpense} className="btn-primary flex items-center gap-2">
          <i className="pi pi-plus" />
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default GroupHeader;