import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { settlementService } from '../../services/settlementService';
import type { Debt } from '../../types/balance.types';
import { formatCurrency } from '../../utils/formatCurrency';

interface Props {
  visible: boolean;
  onHide: () => void;
  debt: Debt | null;
  groupId: number;
}

const SettleDialog = ({ visible, onHide, debt, groupId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSettle = async () => {
    if (!debt) return;
    setLoading(true);
    setError('');

    try {
      await settlementService.createSettlement({
        groupId,
        payerId: debt.fromUserId,
        receiverId: debt.toUserId,
        amount: debt.amount,
      });
      onHide();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to settle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Confirm Settlement"
      style={{ width: '400px' }}
      modal
    >
      {debt && (
        <div className="pt-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="text-center py-4">
            <i className="pi pi-check-circle text-5xl text-green-500 mb-3" />
            <p className="text-gray-700">
              Mark this debt as settled?
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{debt.fromUserName}</span>
                {' pays '}
                <span className="font-medium">{debt.toUserName}</span>
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(debt.amount)}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={onHide} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleSettle}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Processing...' : 'Confirm Settlement'}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default SettleDialog;