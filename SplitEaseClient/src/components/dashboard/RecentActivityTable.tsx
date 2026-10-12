import { Column } from 'primereact/column';
import { useAppSelector } from '../../hooks/reduxHooks';
import { formatCurrency } from '../../utils/formatCurrency';
import {DataTable} from "primereact/datatable"

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 1)
    .toUpperCase();

const RecentActivityTable = () => {
  const { summary } = useAppSelector((s) => s.balances);
  const { user } = useAppSelector((s) => s.auth);
  const expenses = summary?.recentExpenses || [];


  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <p className="text-xs text-surface-muted mt-0.5">
            Audited breakdown of real-time transactions
          </p>
        </div>
        <span className="pill-muted">{expenses.length} Records</span>
      </div>
        <DataTable value={expenses} stripedRows tableStyle={{ minWidth: '50rem' }}  >
          <Column field='description' header='Description' ></Column>
          <Column field='groupName' header='Group' ></Column>
          <Column field='paidByName' header='Paid By' ></Column>
          <Column field='amount' header='Amount'  ></Column>
          <Column field='createdAt' header='Date' ></Column>
        </DataTable>

      {/* <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-surface-muted bg-gray-50/50">
              <th className="px-6 py-3 font-semibold">Description</th>
              <th className="px-6 py-3 font-semibold">Group</th>
              <th className="px-6 py-3 font-semibold">Paid By</th>
              <th className="px-6 py-3 font-semibold">Amount</th>
              <th className="px-6 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => {
              const isYou = exp.paidByUserId === user?.userId;
              return (
                <tr
                  key={exp.expenseId}
                  className="border-t border-surface-border hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                        <i className="pi pi-shopping-bag text-brand-600 text-xs" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {exp.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{exp.groupName || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="avatar-chip">
                        {initials(exp.paidByName || 'U')}
                      </span>
                      <span className="text-gray-700">{exp.paidByName}</span>
                      {isYou && (
                        <span className="pill-brand text-[10px]">You</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {exp.createdAt}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default RecentActivityTable;