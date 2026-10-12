import { useState, type FormEvent } from 'react';
import { Dialog } from 'primereact/dialog';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addMember } from '../../redux/slices/groupSlice';

interface Props {
  visible: boolean;
  onHide: () => void;
  groupId: number;
}

const AddMemberDialog = ({ visible, onHide, groupId }: Props) => {
  const dispatch = useAppDispatch();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const normalizedMobile = mobile.trim();

    if (!/^\d{10}$/.test(normalizedMobile)) {
      setLoading(false);
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const result = await dispatch(
      addMember({ groupId, data: { mobile: normalizedMobile } })
    );

    setLoading(false);

    if (addMember.fulfilled.match(result)) {
      setMobile('');
      onHide();
    } else {
      setError((result.payload as string) || 'Failed to add member');
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Add Member"
      style={{ width: '400px' }}
      modal
      className="p-fluid"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </label>
          <input
            type="tel"
            required
            pattern="[0-9]{10}"
            placeholder="Enter member's 10-digit mobile number"
            className="input-field"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            The user must already be registered on SplitEase.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onHide} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Adding...' : 'Add Member'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddMemberDialog;