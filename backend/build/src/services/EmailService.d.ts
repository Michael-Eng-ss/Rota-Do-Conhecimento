export declare class EmailService {
    private transporter;
    private isDevMode;
    constructor();
    /**
     * Template base para todos os e-mails, garantindo um design consistente e responsivo.
     */
    private getBaseTemplate;
    /**
     * Envia o e-mail usando o transporter ou apenas loga no console em ambiente local.
     */
    private sendMail;
    sendPasswordReset(email: string, nome: string, token: string): Promise<void>;
    sendWelcome(email: string, nome: string): Promise<void>;
}
//# sourceMappingURL=EmailService.d.ts.map