import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => (
  <div className="min-h-screen flex bg-surface-bg">
    <Sidebar />
    <div className="flex-1 min-w-0">
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 pb-10">
        <Outlet />
      </main>
    </div>
  </div>
);

export default MainLayout;