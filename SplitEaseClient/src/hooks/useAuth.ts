import { useAppSelector } from './reduxHooks';

export const useAuth = () => {
  const { user, token, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );
  return { user, token, isAuthenticated, loading, error };
};