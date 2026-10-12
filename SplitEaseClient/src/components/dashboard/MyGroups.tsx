import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';
import EmptyState from '../common/EmptyState';

const MyGroups = () => {
  const navigate = useNavigate();
  const { groups } = useAppSelector((state) => state.groups);

  if (groups.length === 0) {
    return (
      <div className="card ">
        <h3 className="font-semibold text-gray-900 mb-4">My Groups</h3>
        <EmptyState
          icon="pi pi-users"
          title="No groups yet"
          description="Create a group to start splitting expenses"
          actionLabel="Create Group"
          onAction={() => navigate('/groups')}
        />
      </div>
    );
  }

  return (
    <div className="card ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">My Groups</h3>
        <button
          onClick={() => navigate('/groups')}
          className="text-sm text-primary-600 hover:underline"
        >
          View all
        </button>
      </div>

      <div className="space-y-3">
        {groups.slice(0, 5).map((group) => (
          <button
            key={group.groupId}
            onClick={() => navigate(`/groups/${group.groupId}`)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {group.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{group.name}</p>
                <p className="text-xs text-gray-500">
                  {group.memberCount || 0} members
                </p>
              </div>
            </div>
            <i className="pi pi-chevron-right text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyGroups;