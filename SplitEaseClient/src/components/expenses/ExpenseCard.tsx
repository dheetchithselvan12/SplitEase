import type { Expense } from '../../types/expense.types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface Props {
  expense: Expense;
  currentUserId?: number;
}

const ExpenseCard = ({ expense }: Props) => {
  const splitCount = expense?.splits?.length ?? 0;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
          <i className="pi pi-shopping-bag text-primary-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{expense.description}</p>
          <p className="text-xs text-gray-500">
            Paid by {expense?.paidByName || 'Unknown'} •{' '}
            {formatDate(expense?.createdAt)} • {splitCount} people
          </p>
        </div>
      </div>
      <p className="font-semibold text-gray-900">
        {formatCurrency(expense?.amount)}
      </p>
    </div>
  );
};

export default ExpenseCard;