export const formatCurrency = (amount: number, currency = '₹'): string => {
  return `${currency}${Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatBalance = (amount: number): string => {
  if (amount > 0) return `+${formatCurrency(amount)}`;
  if (amount < 0) return `-${formatCurrency(amount)}`;
  return formatCurrency(0);
};