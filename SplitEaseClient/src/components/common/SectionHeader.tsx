interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: string;
  onAction?: () => void;
}

const SectionHeader = ({ title, subtitle, actionLabel, actionIcon = 'pi pi-plus', onAction }: Props) => (
  <div className="flex items-end justify-between mb-4">
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs text-surface-muted mt-0.5">{subtitle}</p>}
    </div>
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-outline btn-primary cursor-pointer ">
        <i className={actionIcon} />
        {actionLabel}
      </button>
    )}
  </div>
);

export default SectionHeader;