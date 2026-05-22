import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomizacaoService, UploadService } from '@/models';
import type { Customizacao, CustomizacaoCreate } from '@/models/types';
import GameBackground from '@/shared/components/GameBackground';
import GameButton from '@/shared/components/GameButton';
import ImagePreview from '@/shared/components/ImagePreview';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, Plus, Loader2, Edit, Trash2, Power, PowerOff,
  Image as ImageIcon, Film, MessageSquare, Megaphone, Save, X,
  ChevronUp, ChevronDown,
} from 'lucide-react';

type TipoCustomizacao = 'cutscene' | 'banner' | 'dialogo';
const TIPOS: { value: TipoCustomizacao; label: string; icon: typeof Film }[] = [
  { value: 'cutscene', label: 'Cutscene', icon: Film },
  { value: 'banner',   label: 'Banner',   icon: Megaphone },
  { value: 'dialogo',  label: 'Diálogo',  icon: MessageSquare },
];

const getTipoInfo = (tipo: string) => TIPOS.find(t => t.value === tipo) || TIPOS[0];

export const CustomizacoesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Filters
  const [filterTipo, setFilterTipo] = useState<'all' | TipoCustomizacao>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Customizacao | null>(null);
  const [formTipo, setFormTipo] = useState<TipoCustomizacao>('cutscene');
  const [formTitulo, setFormTitulo] = useState('');
  const [formConteudo, setFormConteudo] = useState('');
  const [formImagemUrl, setFormImagemUrl] = useState('');
  const [formOrdem, setFormOrdem] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Fetch data
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['customizacoes'],
    queryFn: CustomizacaoService.getAll,
    enabled: !!user,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CustomizacaoCreate) => CustomizacaoService.create(data),
    onSuccess: () => {
      toast({ title: 'Customização criada com sucesso!' });
      closeForm();
      queryClient.invalidateQueries({ queryKey: ['customizacoes'] });
    },
    onError: (err: any) => toast({ title: 'Erro ao criar', description: err.message, variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Customizacao> }) => CustomizacaoService.update(id, data),
    onSuccess: () => {
      toast({ title: 'Customização atualizada!' });
      closeForm();
      queryClient.invalidateQueries({ queryKey: ['customizacoes'] });
    },
    onError: (err: any) => toast({ title: 'Erro ao atualizar', description: err.message, variant: 'destructive' }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, ativo }: { id: number; ativo: boolean }) => CustomizacaoService.toggleActive(id, ativo),
    onSuccess: (_, vars) => {
      toast({ title: vars.ativo ? 'Customização ativada!' : 'Customização desativada!' });
      queryClient.invalidateQueries({ queryKey: ['customizacoes'] });
    },
    onError: (err: any) => toast({ title: 'Erro', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => CustomizacaoService.remove(id),
    onSuccess: () => {
      toast({ title: 'Customização removida!' });
      queryClient.invalidateQueries({ queryKey: ['customizacoes'] });
    },
    onError: (err: any) => toast({ title: 'Erro ao remover', description: err.message, variant: 'destructive' }),
  });

  // Helpers
  const openCreate = () => {
    setEditingItem(null);
    setFormTipo('cutscene');
    setFormTitulo('');
    setFormConteudo('');
    setFormImagemUrl('');
    setFormOrdem(items.length + 1);
    setShowForm(true);
  };

  const openEdit = (item: Customizacao) => {
    setEditingItem(item);
    setFormTipo(item.tipo);
    setFormTitulo(item.titulo);
    setFormConteudo(item.conteudo || '');
    setFormImagemUrl(item.imagemUrl || '');
    setFormOrdem(item.ordem);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    if (!formTitulo.trim()) {
      toast({ title: 'Título é obrigatório', variant: 'destructive' });
      return;
    }
    const payload = {
      tipo: formTipo,
      titulo: formTitulo.trim(),
      conteudo: formConteudo.trim() || undefined,
      imagemUrl: formImagemUrl.trim() || undefined,
      ordem: formOrdem,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload });
    } else {
      createMutation.mutate(payload as CustomizacaoCreate);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await UploadService.uploadImage(file);
      setFormImagemUrl(result.url);
      toast({ title: 'Imagem carregada!' });
    } catch (err: any) {
      toast({ title: 'Erro no upload', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover esta customização?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter logic
  const filtered = items.filter((item: Customizacao) => {
    if (filterTipo !== 'all' && item.tipo !== filterTipo) return false;
    if (filterStatus === 'active' && !item.ativo) return false;
    if (filterStatus === 'inactive' && item.ativo) return false;
    return true;
  });

  if (authLoading) return <div className="min-h-screen bg-slate-950" />;

  const apiUrl = import.meta.env.VITE_API_URL || '';

  return (
    <GameBackground>
      <div className="flex flex-col min-h-screen px-4 py-6 md:px-8 max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Gerenciar Customizações
            </h1>
            <p className="text-white/80 mt-2 text-lg">
              {isLoading ? 'Carregando...' : `${items.length} customizações cadastradas`}
            </p>
          </div>
          <div className="flex gap-3">
            <GameButton onClick={openCreate} variant="primary" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nova Customização
            </GameButton>
            <GameButton onClick={() => navigate('/admin')} variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </GameButton>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md rounded-xl px-4 py-3 border border-slate-700/50 shadow-lg">
            <Film className="w-5 h-5 text-purple-400" />
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value as typeof filterTipo)}
              className="bg-transparent text-white font-medium border-none outline-none cursor-pointer"
            >
              <option value="all" className="text-slate-900">Todos os Tipos</option>
              {TIPOS.map(t => (
                <option key={t.value} value={t.value} className="text-slate-900">{t.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md rounded-xl px-4 py-3 border border-slate-700/50 shadow-lg">
            <Power className="w-5 h-5 text-emerald-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="bg-transparent text-white font-medium border-none outline-none cursor-pointer"
            >
              <option value="all" className="text-slate-900">Todos os Status</option>
              <option value="active" className="text-slate-900">Ativas</option>
              <option value="inactive" className="text-slate-900">Inativas</option>
            </select>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-auto rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-md p-1 shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-emerald-400 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin" />
              <p className="font-medium text-lg text-slate-300">Carregando customizações...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-400 font-bold text-xl border border-red-500/50 bg-red-500/10 rounded-lg m-4">
              Erro ao carregar. Verifique suas permissões (requer SUPERADMIN).
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {filtered.map((item: Customizacao) => {
                const tipoInfo = getTipoInfo(item.tipo);
                const TipoIcon = tipoInfo.icon;
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors rounded-lg border border-slate-700/50 ${
                      !item.ativo ? 'opacity-50' : ''
                    }`}
                  >
                    {/* Image thumbnail */}
                    {item.imagemUrl && (
                      <ImagePreview
                        src={item.imagemUrl.startsWith('http') ? item.imagemUrl : `${apiUrl}${item.imagemUrl}`}
                        alt={item.titulo}
                        thumbnail
                        zoomable
                      />
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <TipoIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <h3 className="text-lg font-bold text-slate-100 truncate">{item.titulo}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-bold tracking-wide ${
                          item.tipo === 'cutscene' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                          item.tipo === 'banner' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/50'
                        }`}>
                          {tipoInfo.label}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${
                          item.ativo
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                        }`}>
                          {item.ativo ? 'Ativa' : 'Inativa'}
                        </span>
                        {item.imagemUrl && (
                          <span className="text-xs px-2 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/50 font-bold flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Imagem
                          </span>
                        )}
                      </div>
                      {item.conteudo && (
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">{item.conteudo}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">Ordem: {item.ordem} • ID: {item.id}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <GameButton
                        variant="secondary"
                        onClick={() => toggleMutation.mutate({ id: item.id, ativo: !item.ativo })}
                        disabled={toggleMutation.isPending}
                        className={`flex items-center justify-center gap-2 py-2 px-3 ${
                          item.ativo ? 'hover:bg-red-900/50' : 'hover:bg-emerald-900/50'
                        }`}
                        title={item.ativo ? 'Desativar' : 'Ativar'}
                      >
                        {item.ativo
                          ? <PowerOff className="w-4 h-4 text-red-400" />
                          : <Power className="w-4 h-4 text-emerald-400" />
                        }
                      </GameButton>

                      <GameButton
                        variant="secondary"
                        onClick={() => openEdit(item)}
                        className="flex items-center justify-center gap-2 py-2 px-3"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-blue-400" />
                      </GameButton>

                      <GameButton
                        variant="secondary"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMutation.isPending}
                        className="flex items-center justify-center gap-2 py-2 px-3 hover:bg-red-900/50"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </GameButton>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-lg">
                  Nenhuma customização encontrada com os filtros atuais.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingItem ? 'Editar Customização' : 'Nova Customização'}
              </h2>

              <div className="space-y-4">
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Tipo *</label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value as TipoCustomizacao)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {TIPOS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Título *</label>
                  <input
                    type="text"
                    value={formTitulo}
                    onChange={(e) => setFormTitulo(e.target.value)}
                    placeholder="Ex: Introdução do Jogo"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Conteúdo */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Conteúdo / Texto</label>
                  <textarea
                    value={formConteudo}
                    onChange={(e) => setFormConteudo(e.target.value)}
                    placeholder="Texto do diálogo, descrição da cutscene..."
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 resize-y"
                  />
                </div>

                {/* Imagem Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Imagem</label>
                  <div className="space-y-2">
                    {formImagemUrl && (
                      <ImagePreview
                        src={formImagemUrl.startsWith('http') ? formImagemUrl : `${apiUrl}${formImagemUrl}`}
                        alt="Preview"
                        zoomable
                      />
                    )}
                    <div className="flex gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 border border-dashed border-slate-500 rounded-lg text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors cursor-pointer ${
                        uploading ? 'opacity-50 pointer-events-none' : ''
                      }`}>
                        {uploading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                        ) : (
                          <><ImageIcon className="w-4 h-4" /> Fazer Upload</>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                      {formImagemUrl && (
                        <button
                          onClick={() => setFormImagemUrl('')}
                          className="px-3 py-2.5 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={formImagemUrl}
                      onChange={(e) => setFormImagemUrl(e.target.value)}
                      placeholder="Ou cole a URL da imagem"
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Ordem */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Ordem de exibição</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFormOrdem(Math.max(0, formOrdem - 1))}
                      className="p-2 bg-slate-800 border border-slate-600 rounded-lg text-white hover:bg-slate-700"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={formOrdem}
                      onChange={(e) => setFormOrdem(parseInt(e.target.value) || 0)}
                      className="w-20 text-center bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => setFormOrdem(formOrdem + 1)}
                      className="p-2 bg-slate-800 border border-slate-600 rounded-lg text-white hover:bg-slate-700"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8 justify-end">
                <GameButton variant="secondary" onClick={closeForm} className="px-6 flex items-center gap-2">
                  <X className="w-4 h-4" /> Cancelar
                </GameButton>
                <GameButton
                  variant="primary"
                  onClick={handleSave}
                  disabled={createMutation.isPending || updateMutation.isPending || !formTitulo.trim()}
                  className="px-6 flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending)
                    ? <Loader2 className="w-5 h-5 animate-spin" />
                    : <><Save className="w-4 h-4" /> Salvar</>
                  }
                </GameButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameBackground>
  );
};
