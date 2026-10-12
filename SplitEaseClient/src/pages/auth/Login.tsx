import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => (
  <AuthLayout title="Welcome back" subtitle="Sign in to your account">
    <LoginForm />
  </AuthLayout>
);

export default Login;