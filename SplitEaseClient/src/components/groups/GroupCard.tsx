import { useNavigate } from 'react-router-dom';
import type { Group } from '../../types/group.types';
import { formatDate } from '../../utils/formatDate';

interface Props {
  group: Group;
  onView?: (group: Group) => void;
  onDelete?: (group: Group) => void;
}

const GroupCard = ({ group, onView, onDelete }: Props) => {
  const navigate = useNavigate();

  const handleCardClick = () => navigate(`/groups/${group.groupId}`);

  const handleView = (event: React.MouseEvent) => {
    event.stopPropagation();
    onView?.(group);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete?.(group);
  };

  return (
    <div
      onClick={handleCardClick}
      className="card cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
          {group.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs text-gray-400">
          {group.createdAt ? formatDate(group.createdAt) : ''}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{group.name}</h3>
      {group.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {group.description}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <i className="pi pi-users" />
          <span>{group.memberCount || 0} members</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-primary-600 hover:underline"
            onClick={handleView}
          >
            View
          </button>
          <button
            type="button"
            className="text-red-500 hover:underline"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;