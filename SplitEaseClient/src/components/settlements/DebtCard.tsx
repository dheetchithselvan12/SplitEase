import type { Debt } from '../../types/balance.types';
import { formatCurrency } from '../../utils/formatCurrency';

interface Props {
  debt: Debt;
  onSettle: (debt: Debt) => void;
}

const DebtCard = ({ debt, onSettle }: Props) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
        <i className="pi pi-arrow-right text-red-500" />
      </div>
      <div>
        <p className="text-sm text-gray-900">
          <span className="font-medium">{debt.fromUserName || 'User'}</span>
          {' owes '}
          <span className="font-medium">{debt.toUserName || 'User'}</span>
        </p>
        <p className="text-lg font-bold text-red-600">
          {formatCurrency(debt.amount)}
        </p>
      </div>
    </div>
    <button onClick={() => onSettle(debt)} className="btn-primary text-sm">
      Settle Up
    </button>
  </div>
);

export default DebtCard;