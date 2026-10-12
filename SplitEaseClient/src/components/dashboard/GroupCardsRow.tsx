import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';
import { formatCurrency } from '../../utils/formatCurrency';

const GroupCardsRow = () => {
  const navigate = useNavigate();
  const { groups } = useAppSelector((s) => s.groups);
  const safeGroups = Array.isArray(groups) ? groups : [];

  if (safeGroups.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {safeGroups.slice(0, 3).map((group) => {
        // Replace with real per-group balance from API
        const balance = (group as any).myBalance ?? 0;
        const receive = balance >= 0;

        return (
          <div key={group.groupId} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                  <i className="pi pi-briefcase text-brand-600 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{group.name}</p>
                  <p className="text-xs text-surface-muted flex items-center gap-1">
                    <i className="pi pi-users text-[10px]" />
                    {group.memberCount || 0} members
                  </p>
                </div>
              </div>
              <span className={receive ? 'pill-success' : 'pill-danger'}>
                {receive ? '+' : '-'}
                {formatCurrency(Math.abs(balance))}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-surface-border mb-4">
              <span className="text-xs text-surface-muted">Your balance</span>
              <span className={`text-sm font-semibold ${receive ? 'text-green-700' : 'text-rose-600'}`}>
                {receive ? `You receive ${formatCurrency(balance)}` : `You owe ${formatCurrency(Math.abs(balance))}`}
              </span>
            </div>

            <button
              onClick={() => navigate(`/groups/${group.groupId}`)}
              className="w-full bg-brand-50 hover:bg-brand-100 text-brand-600 font-medium text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer btn-primary text-white "
            >
              View Group <i className="pi pi-arrow-right text-xs" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default GroupCardsRow;