import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchGroups } from '../redux/slices/groupSlice';
import { fetchBalanceSummary } from '../redux/slices/balanceSlice';
import GroupCardLarge from '../components/groups/GroupCardLarge';
import GroupStatCard from '../components/groups/GroupStatCard';
import GroupForm from '../components/groups/GroupForm';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency } from '../utils/formatCurrency';

const Groups = () => {
  const dispatch = useAppDispatch();
  const { groups, loading } = useAppSelector((s) => s.groups);
  const { summary } = useAppSelector((s) => s.balances);
  const safeGroups = Array.isArray(groups) ? groups : [];

  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchBalanceSummary());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!query.trim()) return safeGroups;
    const q = query.toLowerCase();
    return safeGroups.filter((g) => g.name.toLowerCase().includes(q));
  }, [safeGroups, query]);

  // Aggregate stats (fallback if API doesn't return them)
  const netPosition = summary?.netBalance ?? 0;
  const totalMembers = safeGroups.reduce((sum, g) => sum + (g.memberCount ?? 0), 0);
  const pendingSettlements = summary?.recentExpenses?.length ?? 0;

  if (loading && safeGroups.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">My Groups</h1>
            <span className="pill-muted">{safeGroups.length} Groups</span>
          </div>
          <p className="text-sm text-surface-muted">
            Manage shared balances, settle team bills, and invite collaborators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2
                          text-gray-400 text-xs" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search groups..."
              className="w-full sm:w-56 bg-white border border-surface-border
                         rounded-xl pl-9 pr-4 py-2.5 text-sm
                         focus:ring-2 focus:ring-brand-500 focus:border-transparent
                         outline-none transition"
            />
          </div>


          <button onClick={() => setShowForm(true)} className="btn-primary whitespace-nowrap cursor-pointer ">
            <i className="pi pi-plus text-xs" />
            Create Group
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <GroupStatCard
          icon="pi pi-building-columns"
          label="Net Group Position"
          value={`${netPosition >= 0 ? '+' : '-'}${formatCurrency(Math.abs(netPosition))}`}
          valueClass={netPosition >= 0 ? 'text-green-700' : 'text-rose-600'}
        />
        <GroupStatCard
          icon="pi pi-users"
          label="Total Active Peers"
          value={`${totalMembers} Members`}
        />
        <GroupStatCard
          icon="pi pi-arrow-right-arrow-left"
          label="Pending Settlements"
          value={`${pendingSettlements} Transactions`}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="pi pi-users"
          title={query ? 'No matching groups' : 'No groups yet'}
          description={
            query
              ? 'Try a different search term.'
              : 'Create your first group to start splitting expenses.'
          }
          actionLabel={query ? undefined : 'Create Group'}
          onAction={query ? undefined : () => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {filtered.map((group) => (
            <GroupCardLarge key={group.groupId} group={group as any} />
          ))}
        </div>
      )}

      <GroupForm visible={showForm} onHide={() => setShowForm(false)} />
    </div>
  );
};

export default Groups;