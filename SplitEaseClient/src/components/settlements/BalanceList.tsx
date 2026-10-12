import type { Debt } from '../../types/balance.types';
import DebtCard from './DebtCard';
import EmptyState from '../common/EmptyState';

interface Props {
  debts: Debt[];
  onSettle: (debt: Debt) => void;
}

const BalanceList = ({ debts, onSettle }: Props) => {
  if (debts.length === 0) {
    return (
      <EmptyState
        icon="pi pi-check-circle"
        title="All settled up!"
        description="No pending debts in this group"
      />
    );
  }

  return (
    <div className="space-y-3">
      {debts.map((debt, index) => (
        <DebtCard key={index} debt={debt} onSettle={onSettle} />
      ))}
    </div>
  );
};

export default BalanceList;