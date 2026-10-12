import { useNavigate } from 'react-router-dom';
import type { Group, GroupMember } from '../../types/group.types';
import { formatCurrency } from '../../utils/formatCurrency';
import AvatarStack from '../common/AvatarStack';

interface Props {
  group: Group & {
    description?: string;
    members?: GroupMember[];
    myBalance?: number;
    status?: 'Active' | 'Monthly';
  };
}

const GroupCardLarge = ({ group }: Props) => {
  const navigate = useNavigate();
  const balance = group.myBalance ?? 0;
  const receive = balance >= 0;
  const status = group.status ?? 'Active';

  return (
    <div className="card flex flex-col p-5">
      {/* Top row: icon + status pill */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <i className="pi pi-briefcase text-brand-600 text-sm" />
        </div>
        <span
          className={
            status === 'Active'
              ? 'pill-success'
              : 'pill bg-gray-100 text-gray-600'
          }
        >
          <i className="pi pi-circle-fill text-[5px]" />
          {status}
        </span>
      </div>

      {/* Title + description */}
      <h3 className="font-bold text-gray-900 text-base mb-1">{group.name}</h3>
      <p className="text-xs text-surface-muted line-clamp-2 mb-4 min-h-[32px]">
        {group.description ?? 'No description provided.'}
      </p>

      {/* Member avatars + count */}
      <div className="flex items-center gap-3 mb-5">
        <AvatarStack members={group.members ?? []} max={3} />
        <span className="text-xs text-surface-muted font-medium">
          {group.memberCount ?? group.members?.length ?? 0} members
        </span>
      </div>

      {/* Balance box */}
      <div
        className={`rounded-xl px-4 py-3 mb-4 flex items-center justify-between ${
          receive ? 'bg-green-50/70' : 'bg-rose-50/70'
        }`}
      >
        <div className="flex items-center gap-2">
          <i
            className={`pi ${
              receive ? 'pi-arrow-up-right' : 'pi-arrow-down-right'
            } text-xs ${receive ? 'text-green-600' : 'text-rose-600'}`}
          />
          <span className="text-xs font-medium text-gray-700">Your Share</span>
        </div>
        <div className="text-right">
          <p className={`text-[10px] ${receive ? 'text-green-600' : 'text-rose-600'}`}>
            {receive ? 'You receive' : 'You owe'}
          </p>
          <p
            className={`text-sm font-bold ${
              receive ? 'text-green-700' : 'text-rose-700'
            }`}
          >
            {formatCurrency(Math.abs(balance))}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate(`/groups/${group.groupId}`)}
        className="w-full bg-brand-50 hover:bg-brand-100 text-brand-600
                   font-medium text-sm py-2.5 rounded-xl transition-colors
                   flex items-center justify-center gap-2 mt-auto btn-primary cursor-pointer "
      >
        View Group <i className="pi pi-arrow-right text-xs" />
      </button>
    </div>
  );
};

export default GroupCardLarge;