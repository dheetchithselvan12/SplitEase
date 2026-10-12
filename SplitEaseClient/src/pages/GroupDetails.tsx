import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchGroupById, clearCurrentGroup } from '../redux/slices/groupSlice';
import { fetchExpensesByGroup } from '../redux/slices/expenseSlice';
import { fetchGroupBalances } from '../redux/slices/balanceSlice';
import GroupHeader from '../components/groups/GroupHeader';
import GroupMembers from '../components/groups/GroupMembers';
import AddMemberDialog from '../components/groups/AddMemberDialog';
import ExpenseList from '../components/expenses/ExpenseList';
import BalanceList from '../components/settlements/BalanceList';
import SettleDialog from '../components/settlements/SettleDialog';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import type { Debt } from '../types/balance.types';

type Tab = 'expenses' | 'balances';

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const groupId = Number(id);

  const { currentGroup, loading: groupLoading, error: groupError } = useAppSelector(
    (state) => state.groups
  );
  const { expenses, loading: expenseLoading } = useAppSelector(
    (state) => state.expenses
  );
  const { groupDebts, loading: balanceLoading } = useAppSelector(
    (state) => state.balances
  );

  const [activeTab, setActiveTab] = useState<Tab>('expenses');
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById(groupId));
      dispatch(fetchExpensesByGroup(groupId));
      dispatch(fetchGroupBalances(groupId));
    }
    return () => {
      dispatch(clearCurrentGroup());
    };
  }, [dispatch, groupId]);

  const refreshData = () => {
    dispatch(fetchGroupById(groupId));
    dispatch(fetchExpensesByGroup(groupId));
    dispatch(fetchGroupBalances(groupId));
  };

  if (groupLoading) return <Loader />;
  if (groupError) return <ErrorMessage message={groupError} onRetry={refreshData} />;
  if (!currentGroup) return null;
  

  return (
    <div>
      <GroupHeader
        group={currentGroup}
        onAddExpense={() => navigate(`/expenses/add?groupId=${groupId}`)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex gap-1 mb-6 border-b border-gray-100">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'expenses'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Expenses ({expenses.length})
              </button>
              <button
                onClick={() => setActiveTab('balances')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'balances'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Balances ({groupDebts.length})
              </button>
            </div>

            {activeTab === 'expenses' &&
              (expenseLoading ? (
                <Loader />
              ) : (
                <ExpenseList
                  expenses={expenses}
                  onAddClick={() => navigate(`/expenses/add?groupId=${groupId}`)}
                />
              ))}

            {activeTab === 'balances' &&
              (balanceLoading ? (
                <Loader />
              ) : (
                <BalanceList
                  debts={groupDebts}
                  onSettle={(debt) => setSelectedDebt(debt)}
                />
              ))}
          </div>
        </div>

        <div>
          <GroupMembers
            members={currentGroup.members}
            onAddClick={() => setShowAddMember(true)}
          />
        </div>
      </div>

      <AddMemberDialog
        visible={showAddMember}
        onHide={() => setShowAddMember(false)}
        groupId={groupId}
      />

      <SettleDialog
        visible={!!selectedDebt}
        onHide={() => setSelectedDebt(null)}
        debt={selectedDebt}
        groupId={groupId}
      />
    </div>
  );
};

export default GroupDetails;