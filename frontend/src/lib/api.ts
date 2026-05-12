// Utilitário de requisições reais configurado para lidar com JWT
const API_BASE_URL = 'http://localhost:4000/api'; // Ajuste conforme seu ambiente

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  // Pega o token se existir (do auth store, local storage ou cookie)
  const token = localStorage.getItem('token'); 
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro na requisição');
  }

  return response.json();
};

// -----------------------------------------------------
// Mocks Temporários (Enquanto o backend não é integrado)
// -----------------------------------------------------

export const loginApi = async (data: any) => {
  // Para testar o fetch real, descomente abaixo:
  // return apiClient('/auth/login', { method: 'POST', body: JSON.stringify(data) });

  await new Promise(resolve => setTimeout(resolve, 1000));

  if (data.email === 'admin@teste.com' && data.password === '123456') {
    const mockData = {
      token: 'mock-jwt-token-admin',
      user: { id: '1', email: data.email, role: 'SUPER_ADMIN' }
    };
    // Simula a persistência do JWT
    localStorage.setItem('token', mockData.token);
    return mockData;
  } else if (data.email && data.password === '123456') {
    const mockData = {
      token: 'mock-jwt-token-player',
      user: { id: '2', email: data.email, role: 'PLAYER' }
    };
    localStorage.setItem('token', mockData.token);
    return mockData;
  }

  throw new Error('Credenciais inválidas');
};

export const fetchUsersApi = async () => {
  // Para testar o fetch real, descomente abaixo:
  // return apiClient('/users');

  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    { id: '1', name: 'Administrador Master', email: 'admin@teste.com', role: 'SUPER_ADMIN', campus: 'Todos' },
    { id: '2', name: 'Coordenador Silva', email: 'silva@teste.com', role: 'CAMPUS_ADMIN', campus: 'Campus A' },
    { id: '3', name: 'Aluno João', email: 'joao@teste.com', role: 'PLAYER', campus: 'Campus A' },
    { id: '4', name: 'Aluna Maria', email: 'maria@teste.com', role: 'PLAYER', campus: 'Campus B' },
  ];
};

export const fetchRankingApi = async () => {
  // Para testar o fetch real, descomente abaixo:
  // return apiClient('/game/ranking');

  await new Promise(resolve => setTimeout(resolve, 600));

  return [
    { rank: 1, name: 'João Silva', score: 9850, campus: 'Campus A' },
    { rank: 2, name: 'Maria Souza', score: 8720, campus: 'Campus B' },
    { rank: 3, name: 'Pedro Costa', score: 8100, campus: 'Campus A' },
    { rank: 4, name: 'Ana Oliveira', score: 7950, campus: 'Campus C' },
    { rank: 5, name: 'Lucas Mendes', score: 7600, campus: 'Campus B' },
    { rank: 6, name: 'Juliana Lima', score: 7200, campus: 'Campus A' },
    { rank: 7, name: 'Carlos Santos', score: 6800, campus: 'Campus D' },
  ];
};
