import BalanceCard from './BalanceCard';
import { useAppSelector } from '../../hooks/reduxHooks';

const BalanceSummary = () => {
  const { summary } = useAppSelector((s) => s.balances);
  const { groups } = useAppSelector((s) => s.groups);

  if (!summary) return null;
  
  const groupCount = groups.length;
  const netAbs = Math.abs(summary.netBalance);
  const netCaption =
    summary.netBalance > 0
      ? `↗ You are owed in net overall`
      : summary.netBalance < 0
      ? `↘ You owe in net overall`
      : `All settled up`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
      <BalanceCard
        title="Total You Owe"
        amount={summary?.totalOwed}
        caption={`Across ${groupCount} group${groupCount !== 1 ? 's' : ''}`}
        variant="owe"
      />
      <BalanceCard
        title="Total to Receive"
        amount={summary?.totalToReceive}
        caption={`Across ${groupCount} group${groupCount !== 1 ? 's' : ''}`}
        variant="receive"
      />
      <BalanceCard
        title="Net Balance"
        amount={netAbs}
        caption={netCaption}
        variant="net"
      />
    </div>
  );
};

export default BalanceSummary;