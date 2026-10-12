import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchGroupById } from '../redux/slices/groupSlice';
import ExpenseForm from '../components/expenses/ExpenseForm';
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const AddExpense = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const groupId = Number(searchParams.get('groupId'));

  const { currentGroup, loading } = useAppSelector((state) => state.groups);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById(groupId));
    }
  }, [dispatch, groupId]);

  if (!groupId) {
    return (
      <EmptyState
        icon="pi pi-exclamation-triangle"
        title="No group selected"
        description="Please select a group first to add an expense"
        actionLabel="Go to Groups"
        onAction={() => navigate('/groups')}
      />
    );
  }

  if (loading || !currentGroup) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Add Expense"
        subtitle={`Adding to ${currentGroup.name}`}
      />
      <div className="card">
        <ExpenseForm
          groupId={groupId}
          members={currentGroup.members}
          onSuccess={() => navigate(`/groups/${groupId}`)}
        />
      </div>
    </div>
  );
};

export default AddExpense;