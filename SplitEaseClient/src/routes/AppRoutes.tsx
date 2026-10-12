import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/Dashboard';
import Groups from '../pages/Groups';
import GroupDetails from '../pages/GroupDetails';
import AddExpense from '../pages/AddExpense';
import Expenses from '../pages/Expenses';
import Settlements from '../pages/Settlements';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import MainLayout from '../components/layout/MainLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />} >
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/expenses/add" element={<AddExpense />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/settlements" element={<Settlements />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
  </Route>
</Routes>
  );
};

export default AppRoutes;