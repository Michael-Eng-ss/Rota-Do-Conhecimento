import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => loginApi(data),
    onSuccess: (data) => {
      // Salva o mock user no localStorage para persistência temporária
      localStorage.setItem('user', JSON.stringify(data.user));

      const { role } = data.user;
      if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'CAMPUS_ADMIN') {
        navigate('/admin/users', { replace: true });
      } else {
        navigate('/game', { replace: true });
      }
    },
    onError: (error) => {
      console.error('Erro de autenticação:', error);
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
      <div>
        <label className="block text-sm font-semibold text-gray-700">Email Institucional</label>
        <input 
          {...register('email')} 
          className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="seu@email.edu.br"
          disabled={loginMutation.isPending}
        />
        {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Senha</label>
        <input 
          type="password" 
          {...register('password')} 
          className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
          disabled={loginMutation.isPending}
        />
        {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={loginMutation.isPending}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
      >
        {loginMutation.isPending ? 'Autenticando...' : 'Entrar'}
      </button>
      
      {loginMutation.isError && (
        <p className="text-red-500 text-sm mt-4 text-center font-medium bg-red-50 p-2 rounded">
          Credenciais inválidas. Tente novamente.
        </p>
      )}
    </form>
  );
};
