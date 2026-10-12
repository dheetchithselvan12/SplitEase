import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout = ({ title, subtitle, children }: Props) => (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-blue-100 p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-600">SplitEase</h1>
        <p className="text-gray-500 mt-2">Split expenses, not friendships</p>
      </div>
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-gray-500 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;