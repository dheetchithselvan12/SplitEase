interface Props {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon = 'pi pi-inbox', title, description, actionLabel, onAction }: Props) => (
  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-gray-200 bg-white rounded-xl ">
    <i className={`${icon} text-5xl text-gray-600 mb-4`} />
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    {description && <p className="text-gray-500 mb-6 max-w-md">{description}</p>}
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary cursor-pointer">
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;