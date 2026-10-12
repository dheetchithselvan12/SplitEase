interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const PageHeader = ({ title, subtitle, actionLabel, onAction }: Props) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary flex items-center gap-2">
        <i className="pi pi-plus" />
        {actionLabel}
      </button>
    )}
  </div>
);

export default PageHeader;