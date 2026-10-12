import { useState, type FormEvent } from 'react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { createExpense } from '../../redux/slices/expenseSlice';
import type { GroupMember } from '../../types/group.types';
import PayerSelect from './PayerSelect';
import ParticipantSelect from './ParticipantSelect';

interface Props {
  groupId: number;
  members: GroupMember[];
  onSuccess?: () => void;
}

const ExpenseForm = ({ groupId, members, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    description: '',
    amount: '',
    paidByUserId: 0,
    participantIds: [] as number[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (Number(form.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (!form.paidByUserId) {
      setError('Please select who paid');
      return;
    }
    if (form.participantIds.length === 0) {
      setError('Select at least one participant');
      return;
    }

    setLoading(true);

    const result = await dispatch(
      createExpense({
        groupId,
        description: form.description,
        amount: Number(form.amount),
        paidByUserId: form.paidByUserId,
        participantIds: form.participantIds,
      })
    );

    setLoading(false);

    if (createExpense.fulfilled.match(result)) {
      setForm({
        description: '',
        amount: '',
        paidByUserId: 0,
        participantIds: [],
      });
      onSuccess?.();
    } else {
      setError((result.payload as string) || 'Failed to add expense');
    }
  };

  const perPersonShare =
    form.amount && form.participantIds.length > 0
      ? (Number(form.amount) / form.participantIds.length).toFixed(2)
      : '0.00';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <input
          type="text"
          required
          placeholder="e.g., Dinner at restaurant"
          className="input-field"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Amount (₹) *
        </label>
        <input
          type="number"
          required
          min="0.01"
          step="0.01"
          placeholder="0.00"
          className="input-field"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
      </div>

      <PayerSelect
        members={members}
        value={form.paidByUserId}
        onChange={(id) => setForm({ ...form, paidByUserId: id })}
      />

      <ParticipantSelect
        members={members}
        selectedIds={form.participantIds}
        onChange={(ids) => setForm({ ...form, participantIds: ids })}
      />

      {form.amount && form.participantIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <i className="pi pi-info-circle mr-2" />
            Each participant will owe{' '}
            <span className="font-semibold">₹{perPersonShare}</span>
          </p>
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Adding Expense...' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;