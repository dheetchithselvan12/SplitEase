import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', icon: 'pi pi-th-large', path: '/dashboard' },
  { label: 'Groups',    icon: 'pi pi-users',    path: '/groups' },
  { label: 'Expenses',  icon: 'pi pi-receipt',  path: '/expenses' },
  { label: 'Balances',  icon: 'pi pi-wallet',   path: '/settlements' },
  { label: 'Profile',   icon: 'pi pi-user',     path: '/profile' },
];

const Sidebar = () => {
  const { sidebarOpen } = useAppSelector((s) => s.ui);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => dispatch(toggleSidebar())}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40
                    w-64 h-screen bg-white border-r border-gray-200 shadow-xl
                    flex flex-col transform transition-transform
                    lg:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5  border-surface-border">
          <img src="../../../public/screen.png" alt="Logo" className='w-10 h-10' />
          <div>
            <p className="font-bold text-2xl text-blue-600  ">SplitEase</p>
            <p className="text-xs ">Expense Platform</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <i className={`${item.icon} text-base`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className=" p-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-brand-50 bg-blue-100 ">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center bg-blue-300  text-blue-700 text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || <i className='pi pi-user' /> }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || <span className="text-sm font-semibold text-gray-900 truncate" >Guest</span> }
              </p>
              <p className="text-[11px] text-surface-muted truncate">
                {user?.mobile}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className=" rounded-full text-rose-500 hover:text-rose-700 h-10 w-10 hover:bg-white cursor-pointer  "
            >
              <i className="pi pi-sign-out text-3xl " />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;