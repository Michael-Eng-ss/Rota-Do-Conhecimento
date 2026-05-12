import { LoginForm } from '@/features/auth/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Rota do Conhecimento</h2>
          <p className="mt-2 text-sm text-gray-600">Acesse sua conta para continuar</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
