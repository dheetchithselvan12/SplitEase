import { useState, type FormEvent } from 'react';
import { Dialog } from 'primereact/dialog';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { createGroup } from '../../redux/slices/groupSlice';

interface Props {
  visible: boolean;
  onHide: () => void;
}

const GroupForm = ({ visible, onHide }: Props) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await dispatch(
      createGroup({
        name: form.name,
        description: form.description || undefined,
      })
    );
    

    setLoading(false);

    if (createGroup.fulfilled.match(result)) {
      setForm({ name: '', description: '' });
      onHide();
    } else {
      setError((result.payload as string) || 'Failed to create group');
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Create New Group"
      style={{ width: '450px' }}
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
            Group Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Roommates, Trip to Goa"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Optional description"
            className="input-field resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onHide} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default GroupForm;