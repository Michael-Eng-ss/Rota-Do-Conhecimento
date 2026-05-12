import { DataSource } from 'typeorm';
export interface RankingEntry {
    position: number;
    id: number;
    nome: string;
    foto: string | null;
    pontuacao: number;
    campusId: number | null;
    cursoId: number | null;
}
export declare class RankingService {
    private usuarioRepo;
    constructor(dataSource: DataSource);
    getGlobalRanking(limit?: number): Promise<RankingEntry[]>;
    getRankingByCurso(cursoId: number, limit?: number): Promise<RankingEntry[]>;
    getRankingByCampus(campusId: number, limit?: number): Promise<RankingEntry[]>;
}
//# sourceMappingURL=RankingService.d.ts.map