import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, updateUserRole, updateUser, toggleUserStatus } from '@/models/services/admin.service';
import GameBackground from '@/shared/components/GameBackground';
import GameButton from '@/shared/components/GameButton';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, ShieldAlert, ShieldCheck, Loader2, Edit, Power, PowerOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UsuarioPublico } from '@/models/types';

export const ManageUsersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterCampus, setFilterCampus] = useState<'all' | number>('all');
  
  // Modal states
  const [editingUser, setEditingUser] = useState<UsuarioPublico | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
    enabled: !!user,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: number }) => updateUserRole(id, role),
    onSuccess: () => {
      toast({ title: 'Permissão atualizada com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { nome: string; email: string } }) => updateUser(id, payload),
    onSuccess: () => {
      toast({ title: 'Usuário atualizado com sucesso!' });
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao atualizar usuário', description: error.message, variant: 'destructive' });
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) => toggleUserStatus(id, status),
    onSuccess: (_, variables) => {
      toast({ title: variables.status ? 'Usuário ativado!' : 'Usuário desativado!' });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao alterar status', description: error.message, variant: 'destructive' });
    }
  });

  if (authLoading) return <div className="min-h-screen bg-slate-950" />;

  const getRoleName = (role: number) => {
    switch(role) {
      case 1: return 'Super Admin';
      case 2: return 'Admin';
      case 3: return 'Jogador';
      case 4: return 'Admin Campus';
      default: return 'Jogador';
    }
  };

  const getRoleBadgeColor = (role: number, status: boolean) => {
    if (!status) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    switch(role) {
      case 1: return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 2: return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 4: return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const filteredUsers = filterCampus === 'all' 
    ? users 
    : users.filter((u: UsuarioPublico) => u.campusid === filterCampus);

  const handleEditClick = (u: UsuarioPublico) => {
    setEditingUser(u);
    setEditNome(u.nome);
    setEditEmail(u.email);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    updateMutation.mutate({ id: editingUser.id, payload: { nome: editNome, email: editEmail } });
  };

  return (
    <GameBackground>
      <div className="flex flex-col min-h-screen px-4 py-6 md:px-8 max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Gerenciamento de Usuários
            </h1>
            <p className="text-white/80 mt-2 text-lg">
              {isLoading ? 'Carregando...' : `${users.length} usuários cadastrados`}
            </p>
          </div>
          <GameButton onClick={() => navigate('/admin')} variant="primary" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Hub Admin
          </GameButton>
        </div>

        {/* Actions / Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md rounded-xl px-4 py-3 border border-slate-700/50 shadow-lg">
            <Filter className="w-5 h-5 text-emerald-400" />
            <select
              value={filterCampus}
              onChange={(e) => setFilterCampus(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-white font-medium border-none outline-none cursor-pointer"
            >
              <option value="all" className="text-slate-900">Todos os Campus</option>
              {Array.from(new Set(users.map((u: UsuarioPublico) => u.campusid).filter(Boolean))).map(id => (
                <option key={String(id)} value={Number(id)} className="text-slate-900">
                  Campus ID {id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-auto rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-1 shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-emerald-400 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin" />
              <p className="font-medium text-lg text-slate-300">Buscando usuários no banco...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-400 font-bold text-xl border border-red-500/50 bg-red-500/10 rounded-lg m-4">
              Erro ao carregar os dados. Verifique se você possui permissão.
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {filteredUsers.map((u: UsuarioPublico) => (
                <div 
                  key={u.id}
                  className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors rounded-lg border border-slate-700/50 gap-4 ${!u.status ? 'opacity-60' : ''}`}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-100 flex items-center gap-3 flex-wrap">
                      {u.nome}
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-bold tracking-wide ${getRoleBadgeColor(u.role, u.status)}`}>
                        {getRoleName(u.role)}
                      </span>
                      {!u.status && (
                        <span className="text-xs px-2.5 py-1 rounded-full border font-bold tracking-wide bg-gray-600/30 text-gray-300 border-gray-500/50">
                          Inativo
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 break-all">
                      {u.email} • ID: {u.id} {u.campusid ? `• Campus: ${u.campusid}` : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Status Toggle Button */}
                    {u.id !== user?.id && (
                      <GameButton 
                        variant="secondary"
                        disabled={statusMutation.isPending}
                        onClick={() => statusMutation.mutate({ id: u.id, status: !u.status })}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-3 ${u.status ? 'hover:bg-red-900/50' : 'hover:bg-emerald-900/50'}`}
                        title={u.status ? 'Desativar usuário' : 'Ativar usuário'}
                      >
                        {u.status ? <PowerOff className="w-4 h-4 text-red-400" /> : <Power className="w-4 h-4 text-emerald-400" />}
                      </GameButton>
                    )}

                    {/* Edit Button */}
                    <GameButton 
                      variant="secondary"
                      onClick={() => handleEditClick(u)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-3"
                      title="Editar dados"
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                    </GameButton>

                    {/* Role Promotion Button */}
                    {u.role === 3 ? (
                      <GameButton 
                        variant="secondary"
                        disabled={roleMutation.isPending || u.id === user?.id || !u.status}
                        onClick={() => roleMutation.mutate({ id: u.id, role: 2 })}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-4"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="hidden md:inline">Promover a Admin</span>
                        <span className="inline md:hidden">Promover</span>
                      </GameButton>
                    ) : (
                      <GameButton 
                        variant="secondary" 
                        disabled={roleMutation.isPending || u.id === user?.id || !u.status}
                        onClick={() => roleMutation.mutate({ id: u.id, role: 3 })}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2 px-4 opacity-80 hover:opacity-100"
                      >
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        <span className="hidden md:inline">Remover Admin</span>
                        <span className="inline md:hidden">Rebaixar</span>
                      </GameButton>
                    )}
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-lg">
                  Nenhum usuário encontrado com os filtros atuais.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold text-white mb-4">Editar Usuário</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
                  <input 
                    type="text" 
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
                  <input 
                    type="email" 
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8 justify-end">
                <GameButton variant="secondary" onClick={() => setEditingUser(null)} className="px-6">
                  Cancelar
                </GameButton>
                <GameButton 
                  variant="primary" 
                  onClick={handleSaveEdit}
                  disabled={updateMutation.isPending || !editNome || !editEmail}
                  className="px-6"
                >
                  {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
                </GameButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameBackground>
  );
};

