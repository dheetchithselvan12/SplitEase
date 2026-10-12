import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/common/PageHeader';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="My Profile" subtitle="Your account information" />

      <div className="card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500">{user?.mobile}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">User ID</label>
            <p className="font-medium text-gray-900">#{user?.userId}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="font-medium text-gray-900">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Mobile Number</label>
            <p className="font-medium text-gray-900">{user?.mobile}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;