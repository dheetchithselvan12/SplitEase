import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchGroups } from '../redux/slices/groupSlice';
import { fetchGroupBalances } from '../redux/slices/balanceSlice';
import BalanceList from '../components/settlements/BalanceList';
import SettleDialog from '../components/settlements/SettleDialog';
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import type { Debt } from '../types/balance.types';

const Settlements = () => {
  const dispatch = useAppDispatch();
  const { groups, loading: groupsLoading } = useAppSelector((state) => state.groups);
  const { groupDebts, loading: balanceLoading } = useAppSelector(
    (state) => state.balances
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  useEffect(() => {
    if (selectedGroupId) {
      dispatch(fetchGroupBalances(selectedGroupId));
    }
  }, [dispatch, selectedGroupId]);


  if (groupsLoading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="Settlements"
        subtitle="Settle your debts with group members"
      />

      {groups.length === 0 ? (
        <EmptyState
          icon="pi pi-check-circle"
          title="No groups available"
          description="Create a group first to start settling expenses"
        />
      ) : (
        <>
          <div className="card mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Group
            </label>
            <select
              className="input-field max-w-md"
              value={selectedGroupId || ''}
              onChange={(e) => setSelectedGroupId(Number(e.target.value))}
            >
              <option value="">Choose a group</option>
              {groups.map((group) => (
                <option key={group.groupId} value={group.groupId}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {selectedGroupId && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Pending Settlements
              </h3>
              {balanceLoading ? (
                <Loader />
              ) : (
                <BalanceList
                  debts={groupDebts}
                  onSettle={(debt) => setSelectedDebt(debt)}
                />
              )}
            </div>
          )}

          {!selectedGroupId && (
            <EmptyState
              icon="pi pi-filter"
              title="Select a group"
              description="Choose a group to view pending settlements"
            />
          )}
        </>
      )}

      <SettleDialog
        visible={!!selectedDebt}
        onHide={() => setSelectedDebt(null)}
        debt={selectedDebt}
        groupId={selectedGroupId || 0}
      />
    </div>
  );
};

export default Settlements;