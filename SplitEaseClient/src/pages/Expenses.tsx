import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchGroups } from '../redux/slices/groupSlice';
import { fetchExpensesByGroup } from '../redux/slices/expenseSlice';
import ExpenseList from '../components/expenses/ExpenseList';
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const Expenses = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { groups, loading: groupsLoading } = useAppSelector((state) => state.groups);
  const { expenses, loading: expensesLoading } = useAppSelector(
    (state) => state.expenses
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  useEffect(() => {
    if (selectedGroupId) {
      dispatch(fetchExpensesByGroup(selectedGroupId));
    }
  }, [dispatch, selectedGroupId]);
  

  if (groupsLoading) return <Loader />;

  if (groups.length === 0) {
    return (
      <EmptyState
        icon="pi pi-receipt"
        title="No groups available"
        description="Create a group first to start tracking expenses"
        actionLabel="Create Group"
        onAction={() => navigate('/groups')}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="All Expenses"
        subtitle="View expenses across your groups"
      />

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
          {expensesLoading ? (
            <Loader />
          ) : (
            <ExpenseList
              expenses={expenses}
              onAddClick={() => navigate(`/expenses/add?groupId=${selectedGroupId}`)}
            />
          )}
        </div>
      )}

      {!selectedGroupId && (
        <EmptyState
          icon="pi pi-filter"
          title="Select a group"
          description="Choose a group above to view its expenses"
        />
      )}
    </div>
  );
};

export default Expenses;