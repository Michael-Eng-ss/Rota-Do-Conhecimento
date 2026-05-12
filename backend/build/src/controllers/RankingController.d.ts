import { Request, Response } from 'express';
export declare class RankingController {
    private service;
    constructor();
    /** GET /ranking?limit=100 */
    getGlobal: (req: Request, res: Response) => Promise<void>;
    /** GET /ranking/curso/:cursoId?limit=50 */
    getByCurso: (req: Request, res: Response) => Promise<void>;
    /** GET /ranking/campus/:campusId?limit=50 */
    getByCampus: (req: Request, res: Response) => Promise<void>;
}
export declare const rankingController: RankingController;
//# sourceMappingURL=RankingController.d.ts.map