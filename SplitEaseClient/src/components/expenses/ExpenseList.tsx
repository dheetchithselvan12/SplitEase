import type { Expense } from '../../types/expense.types';
import ExpenseCard from './ExpenseCard';
import EmptyState from '../common/EmptyState';

interface Props {
  expenses: Expense[];
  onAddClick?: () => void;
}

const ExpenseList = ({ expenses, onAddClick }: Props) => {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  

  if (safeExpenses.length === 0) {
    return (
      <EmptyState
        icon="pi pi-receipt"
        title="No expenses yet"
        description="Add your first expense to this group"
        actionLabel={onAddClick ? 'Add Expense' : undefined}
        onAction={onAddClick}
      />
    );
  }

  return (
    <div>
      {safeExpenses.map((expense) => (
        <ExpenseCard key={expense.expenseId} expense={expense} />
      ))}
    </div>
  );
};

export default ExpenseList;