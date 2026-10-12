import { useAppDispatch } from '../../hooks/reduxHooks';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();


  return (
    <header className="bg-white border-b mb-4 border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 h-19">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <i className="pi pi-bars text-xl" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user ? 
          <span className="hidden sm:block text-xl text-gray-600 ">
            Hi, <span className="font-bold text-blue-400   ">{user?.name}</span>
          </span> : <span className="font-bold text-xl text-blue-400">Hello Guest User</span>
          }
        </div>
      </div>
    </header>
  );
};

export default Navbar;