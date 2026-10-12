import AuthLayout from '../../components/auth/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => (
  <AuthLayout title="Create account" subtitle="Join SplitEase today">
    <RegisterForm />
  </AuthLayout>
);

export default Register;