import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchBalanceSummary } from '../redux/slices/balanceSlice';
import { fetchGroups } from '../redux/slices/groupSlice';
import BalanceSummary from '../components/dashboard/BalanceSummary';
import GroupCardsRow from '../components/dashboard/GroupCardsRow';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import SectionHeader from '../components/common/SectionHeader';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading: bLoading } = useAppSelector((s) => s.balances);
  const { loading: gLoading } = useAppSelector((s) => s.groups);

  useEffect(() => {
    dispatch(fetchBalanceSummary());
    dispatch(fetchGroups());
  }, [dispatch]);

  if (bLoading && gLoading) return <Loader />;

  return (
    <div className="space-y-8">
      {/* Top summary */}
      <BalanceSummary />

      {/* My Groups section */}
      <section>
        <SectionHeader
          title="My Groups"
          subtitle="Manage lean balances, active trips, and household splits"
          actionLabel="Create Group"
          actionIcon="pi pi-plus"
          onAction={() => navigate('/groups')}
        />
        <GroupCardsRow />
      </section>

      {/* Recent Activity */}
      <section>
        <RecentActivityTable />
      </section>
    </div>
  );
};

export default Dashboard;