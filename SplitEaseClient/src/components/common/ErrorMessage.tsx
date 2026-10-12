interface Props {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: Props) => (
  <div className="card border-l-4 border-red-500 bg-red-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <i className="pi pi-exclamation-circle text-red-500 text-2xl" />
        <p className="text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm">
          Retry
        </button>
      )}
    </div>
  </div>
);

export default ErrorMessage;