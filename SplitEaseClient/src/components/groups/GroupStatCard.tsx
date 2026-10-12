interface Props {
  icon: string;
  label: string;
  value: string;
  valueClass?: string;
}

const GroupStatCard = ({ icon, label, value, valueClass = 'text-gray-900' }: Props) => (
  <div className="card flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
      <i className={`${icon} text-brand-600 text-base`} />
    </div>
    <div>
      <p className="text-[11px] uppercase tracking-wide text-surface-muted font-semibold">
        {label}
      </p>
      <p className={`text-xl font-bold ${valueClass} mt-0.5`}>{value}</p>
    </div>
  </div>
);

export default GroupStatCard;