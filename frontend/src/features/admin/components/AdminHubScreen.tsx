import { useNavigate } from 'react-router-dom';
import GameBackground from '@/shared/components/GameBackground';
import GameButton from '@/shared/components/GameButton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Users, FileQuestion, Gamepad2, LogOut, Clapperboard, Palette } from 'lucide-react';

interface AdminHubScreenProps {
  onLogout?: () => void;
}

const AdminHubScreen = ({ onLogout }: AdminHubScreenProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isSuperAdmin = user?.role === 1 || user?.role === 'SUPER_ADMIN';

  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout();
      } else {
        await signOut();
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Erro ao sair:', error);
      navigate('/login', { replace: true });
    }
  };

  return (
    <GameBackground>
      <div className="flex flex-col min-h-screen px-4 py-8 max-w-4xl mx-auto justify-center">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
          
          <div className="w-24 h-24 rounded-full border-4 border-blue-500/50 bg-slate-800 flex items-center justify-center mb-4 overflow-hidden bg-white/10">
            {user?.foto ? (
              <img 
                src={new URL(`../../../assets/characters/${user.foto}.png`, import.meta.url).href} 
                alt="Avatar" 
                className="w-full h-full object-cover object-top" 
              />
            ) : (
              <div className="text-4xl">👑</div>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center drop-shadow-lg">
            Painel Administrativo
          </h1>
          <p className="text-blue-200 mt-2 text-lg text-center mb-10">
            Bem-vindo(a), {user?.nome || 'Administrador'}! O que deseja fazer?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            
            <GameButton
              onClick={() => navigate('/admin/users')}
              variant="primary"
              className="flex flex-col items-center justify-center py-8 gap-4 hover:scale-105 transition-transform"
            >
              <Users className="w-10 h-10 text-white" />
              <span className="text-xl font-bold">Gerenciar Usuários</span>
            </GameButton>

            <GameButton
              onClick={() => navigate('/questionAdmin')}
              variant="primary"
              className="flex flex-col items-center justify-center py-8 gap-4 hover:scale-105 transition-transform"
            >
              <FileQuestion className="w-10 h-10 text-white" />
              <span className="text-xl font-bold">Gerenciar Questões</span>
            </GameButton>

            {/* Apenas SUPERADMIN vê este botão */}
            {isSuperAdmin && (
              <GameButton
                onClick={() => navigate('/admin/customizacoes')}
                variant="primary"
                className="flex flex-col items-center justify-center py-8 gap-4 hover:scale-105 transition-transform bg-gradient-to-br from-purple-600 to-indigo-700 border-purple-500/50"
              >
                <Palette className="w-10 h-10 text-white" />
                <span className="text-xl font-bold">Customizações</span>
              </GameButton>
            )}

            <GameButton
              onClick={() => navigate('/menu')}
              variant="secondary"
              className="flex flex-col items-center justify-center py-8 gap-4 hover:scale-105 transition-transform bg-slate-800"
            >
              <Gamepad2 className="w-10 h-10 text-emerald-400" />
              <span className="text-xl font-bold">Entrar no Jogo</span>
            </GameButton>

            <GameButton
              onClick={() => navigate('/admin/preview-ending')}
              variant="secondary"
              className="flex flex-col items-center justify-center py-8 gap-4 hover:scale-105 transition-transform bg-slate-800"
            >
              <Clapperboard className="w-10 h-10 text-yellow-400" />
              <span className="text-xl font-bold">Preview do Final</span>
            </GameButton>

            <GameButton
              onClick={handleLogout}
              variant="secondary"
              className="flex flex-col items-center justify-center py-8 gap-4 hover:scale-105 transition-transform bg-slate-800"
            >
              <LogOut className="w-10 h-10 text-red-400" />
              <span className="text-xl font-bold">Sair do Sistema</span>
            </GameButton>
            
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default AdminHubScreen;

