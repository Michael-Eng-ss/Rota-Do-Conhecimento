import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

/**
 * Customizações do jogo (cutscenes, banners, diálogos).
 * Gerenciadas exclusivamente por SUPERADMIN.
 */
@Entity('customizacoes')
export class Customizacao {
  @PrimaryGeneratedColumn()
  id!: number;

  /** Tipo da customização: 'cutscene', 'banner', 'dialogo' */
  @Column({ type: 'text' })
  tipo!: string;

  /** Título/nome da customização */
  @Column({ type: 'text' })
  titulo!: string;

  /** Conteúdo de texto (corpo, diálogo, descrição) */
  @Column({ type: 'text', nullable: true })
  conteudo!: string | null;

  /** URL da imagem associada */
  @Column({ name: 'imagem_url', type: 'text', nullable: true })
  imagemUrl!: string | null;

  /** Ordem de exibição */
  @Column({ type: 'int', default: 0 })
  ordem!: number;

  /** Se a customização está ativa */
  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'created_at', type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz' })
  updatedAt!: Date;
}
