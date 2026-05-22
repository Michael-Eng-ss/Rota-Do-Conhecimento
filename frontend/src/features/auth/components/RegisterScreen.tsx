import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import GameBackground from '@/shared/components/GameBackground';
import GameHeader from '@/shared/components/GameHeader';
import GameButton from '@/shared/components/GameButton';
import { useToast } from '@/hooks/use-toast';
import { getCampusList } from '@/models/services/campus.service';
import type { Campus } from '@/models/types';
import {
  User, Mail, Lock, Eye, EyeOff, MapPin, ChevronRight,
  ChevronLeft, Check, Loader2, GraduationCap, Shield,
} from 'lucide-react';

interface RegisterScreenProps {
  onRegister: () => void;
  onBackToLogin: () => void;
  signUp: (email: string, password: string, displayName: string, campusId?: number) => Promise<{ data: any; error: any }>;
}

const STEPS = [
  { id: 1, label: 'Dados Pessoais', icon: User },
  { id: 2, label: 'Campus', icon: MapPin },
  { id: 3, label: 'Segurança', icon: Shield },
];

const RegisterScreen = ({ onRegister, onBackToLogin, signUp }: RegisterScreenProps) => {
  // Step state
  const [step, setStep] = useState(1);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [campusId, setCampusId] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  // Fetch campus list
  const { data: campusList = [], isLoading: loadingCampus } = useQuery({
    queryKey: ['campus-list-register'],
    queryFn: getCampusList,
  });

  // Validation per step
  const validateStep = (s: number): boolean => {
    if (s === 1) {
      if (!name.trim()) {
        toast({ title: 'Digite seu nome completo', variant: 'destructive' });
        return false;
      }
      if (name.trim().length < 3) {
        toast({ title: 'Nome deve ter pelo menos 3 caracteres', variant: 'destructive' });
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({ title: 'Digite um e-mail válido', variant: 'destructive' });
        return false;
      }
      return true;
    }
    if (s === 2) {
      if (!campusId) {
        toast({ title: 'Selecione seu campus', variant: 'destructive' });
        return false;
      }
      return true;
    }
    if (s === 3) {
      if (password.length < 6) {
        toast({ title: 'A senha deve ter pelo menos 6 caracteres', variant: 'destructive' });
        return false;
      }
      if (password !== confirmPassword) {
        toast({ title: 'As senhas não coincidem', variant: 'destructive' });
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleRegister = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    const { error } = await signUp(email, password, name, campusId ?? undefined);
    setLoading(false);

    if (error) {
      toast({ title: 'Erro ao cadastrar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '🎉 Conta criada com sucesso!', description: 'Faça login para começar a jogar.' });
      onRegister();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < 3) {
        nextStep();
      } else {
        handleRegister();
      }
    }
  };

  const selectedCampus = campusList.find((c: Campus) => c.id === campusId);

  // Password strength
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', width: '0%' };
    if (password.length < 6) return { label: 'Fraca', color: 'bg-red-500', width: '25%' };
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const score = [password.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score <= 1) return { label: 'Fraca', color: 'bg-red-500', width: '25%' };
    if (score === 2) return { label: 'Média', color: 'bg-amber-500', width: '50%' };
    if (score === 3) return { label: 'Forte', color: 'bg-emerald-500', width: '75%' };
    return { label: 'Muito forte', color: 'bg-emerald-400', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-start min-h-screen pt-6 md:pt-10 px-4 pb-8">
        <GameHeader />

        <div className="mt-6 md:mt-8 w-full max-w-md">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-white scale-100'
                          : isActive
                            ? 'bg-white border-white text-blue-600 scale-110 shadow-lg shadow-white/30'
                            : 'bg-white/20 border-white/30 text-white/60'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-1 font-medium transition-colors ${
                      isActive ? 'text-white' : isCompleted ? 'text-emerald-300' : 'text-white/50'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 mb-5 transition-colors rounded-full ${
                      step > s.id ? 'bg-emerald-400' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full" />
            
            {/* Step Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-1">
              {step === 1 && 'Seus Dados'}
              {step === 2 && 'Escolha seu Campus'}
              {step === 3 && 'Crie sua Senha'}
            </h2>
            <p className="text-white/50 text-sm text-center mb-6">
              {step === 1 && 'Preencha seu nome e e-mail institucional'}
              {step === 2 && 'Selecione o campus onde você estuda'}
              {step === 3 && 'Escolha uma senha segura para sua conta'}
            </p>

            {/* Step 1: Name + Email */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" onKeyDown={handleKeyDown}>
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-1.5">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Maria Silva"
                      autoFocus
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-1.5">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.edu.br"
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/40 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Campus Selection */}
            {step === 2 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                {loadingCampus ? (
                  <div className="flex flex-col items-center justify-center py-12 text-white/50 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p>Carregando campus...</p>
                  </div>
                ) : campusList.length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    <MapPin className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>Nenhum campus encontrado</p>
                  </div>
                ) : (
                  <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {campusList.map((campus: Campus) => {
                      const isSelected = campusId === campus.id;
                      return (
                        <button
                          key={campus.id}
                          type="button"
                          onClick={() => setCampusId(campus.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            isSelected
                              ? 'bg-blue-500/20 border-blue-400 text-white shadow-lg shadow-blue-500/10 scale-[1.02]'
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/25 hover:text-white'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'
                          }`}>
                            {isSelected ? <Check className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold truncate ${isSelected ? 'text-white' : ''}`}>
                              {campus.nomecampus || `Campus ${campus.id}`}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="flex-shrink-0">
                              <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" onKeyDown={handleKeyDown}>
                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      autoFocus
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-12 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Força da senha</span>
                        <span className={`font-bold ${
                          strength.color === 'bg-red-500' ? 'text-red-400' :
                          strength.color === 'bg-amber-500' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} rounded-full transition-all duration-500`}
                          style={{ width: strength.width }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/80 mb-1.5">
                    Confirme a Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Digite a senha novamente"
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-12 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Match indicator */}
                  {confirmPassword && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {password === confirmPassword ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-emerald-400">Senhas coincidem</span>
                        </>
                      ) : (
                        <>
                          <span className="w-4 h-4 text-red-400 text-center text-xs font-bold">✕</span>
                          <span className="text-xs text-red-400">Senhas não coincidem</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-2">
                  <h4 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Resumo do Cadastro</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="truncate">{name || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="truncate">{email || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="truncate">{selectedCampus ? selectedCampus.nomecampus : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 ? (
                <GameButton
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Voltar
                </GameButton>
              ) : (
                <GameButton
                  onClick={onBackToLogin}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Login
                </GameButton>
              )}

              {step < 3 ? (
                <GameButton
                  onClick={nextStep}
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  Próximo
                  <ChevronRight className="w-5 h-5" />
                </GameButton>
              ) : (
                <GameButton
                  onClick={handleRegister}
                  variant="primary"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Criar Conta
                    </>
                  )}
                </GameButton>
              )}
            </div>

            {/* Footer link */}
            <div className="text-center mt-5">
              <button
                onClick={onBackToLogin}
                className="text-white/50 hover:text-white/80 text-sm transition-colors underline underline-offset-2"
              >
                Já possui conta? Faça login
              </button>
            </div>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default RegisterScreen;
