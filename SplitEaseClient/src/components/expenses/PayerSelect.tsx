import type { GroupMember } from '../../types/group.types';

interface Props {
  members: GroupMember[];
  value: number;
  onChange: (userId: number) => void;
  label?: string;
}

const PayerSelect = ({ members, value, onChange, label = 'Paid By' }: Props) => {
  const safeMembers = Array.isArray(members) ? members : [];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} *
      </label>
      <select
        required
        className="input-field"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={0}>Select who paid</option>
        {safeMembers.map((member) => (
          <option key={member.userId} value={member.userId}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PayerSelect;