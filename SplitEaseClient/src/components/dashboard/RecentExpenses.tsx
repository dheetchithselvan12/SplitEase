import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import EmptyState from '../common/EmptyState';

const RecentExpenses = () => {
  const navigate = useNavigate();
  const { summary } = useAppSelector((state) => state.balances);
  const expenses = summary?.recentExpenses || [];

  if (expenses.length === 0) {
    return (
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <EmptyState
          icon="pi pi-receipt"
          title="No recent expenses"
          description="Add your first expense to see it here"
        />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        <button
          onClick={() => navigate('/expenses')}
          className="text-sm text-primary-600 hover:underline"
        >
          View all
        </button>
      </div>

      <div className="space-y-3">
        {expenses.slice(0, 5).map((expense) => (
          <div
            key={expense.expenseId}
            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                <i className="pi pi-shopping-bag text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{expense.description}</p>
                <p className="text-xs text-gray-500">
                  {expense.paidByName || 'Unknown'} paid •{' '}
                  {formatDate(expense.createdAt)}
                </p>
              </div>
            </div>
            <p className="font-semibold text-gray-900">
              {formatCurrency(expense.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExpenses;