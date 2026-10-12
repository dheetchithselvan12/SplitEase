import { formatCurrency } from '../../utils/formatCurrency';

interface Props {
  title: string;
  amount: number;
  caption: string;
  variant: 'owe' | 'receive' | 'net';
}

const variants = {
  owe:     { amount: 'text-rose-600',   pill: 'pill-danger',  pillText: '▲ Payable', color: 'text-red-400', border:'border-red-400' },
  receive: { amount: 'text-green-700',  pill: 'pill-success', pillText: '▼ Receivable', color: 'text-green-700', border:'border-green-400' },
  net:     { amount: 'text-gray-900',   pill: 'pill-muted',   pillText: 'Overall', color: 'text-black', border:'border-blue-300' },
};

const BalanceCard = ({ title, amount, caption, variant }: Props) => {
  const v = variants[variant];
  const prefix = variant === 'owe' ? '-' : variant === 'receive' ? '' : '+';

  return (
    <div className={`card ${v.border}`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-surface-muted font-medium">{title}</p>
        <span className={`${v.color} ${v.pill}`}>{v.pillText}</span>
      </div>
      <p className={`text-3xl font-bold ${v.amount} mb-2`}>
        {prefix}{formatCurrency(Math.abs(amount))}
      </p>
      <p className="text-xs text-surface-muted">{caption}</p>
    </div>
  );
};

export default BalanceCard;