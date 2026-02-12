export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alternativas: {
        Row: {
          conteudo: string | null
          correta: boolean
          id: number
          imagem: string | null
          perguntasid: number
        }
        Insert: {
          conteudo?: string | null
          correta?: boolean
          id?: number
          imagem?: string | null
          perguntasid: number
        }
        Update: {
          conteudo?: string | null
          correta?: boolean
          id?: number
          imagem?: string | null
          perguntasid?: number
        }
        Relationships: [
          {
            foreignKeyName: "alternativas_perguntasid_fkey"
            columns: ["perguntasid"]
            isOneToOne: false
            referencedRelation: "perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      campus: {
        Row: {
          id: number
          nomecampus: string
        }
        Insert: {
          id?: number
          nomecampus: string
        }
        Update: {
          id?: number
          nomecampus?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          cursoId: number
          descricao: string
          id: number
          imagem: string
          status: boolean
        }
        Insert: {
          cursoId: number
          descricao: string
          id?: number
          imagem?: string
          status?: boolean
        }
        Update: {
          cursoId?: number
          descricao?: string
          id?: number
          imagem?: string
          status?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "categorias_cursoId_fkey"
            columns: ["cursoId"]
            isOneToOne: false
            referencedRelation: "curso"
            referencedColumns: ["id"]
          },
        ]
      }
      curso: {
        Row: {
          id: number
          imagem: string
          nome: string
        }
        Insert: {
          id?: number
          imagem?: string
          nome: string
        }
        Update: {
          id?: number
          imagem?: string
          nome?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          datalogin: string
          descricao: string
          id: number
          usuariosid: number
        }
        Insert: {
          datalogin?: string
          descricao: string
          id?: number
          usuariosid: number
        }
        Update: {
          datalogin?: string
          descricao?: string
          id?: number
          usuariosid?: number
        }
        Relationships: [
          {
            foreignKeyName: "logs_usuariosid_fkey"
            columns: ["usuariosid"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      perguntas: {
        Row: {
          categoriasid: number
          conteudo: string | null
          id: number
          pathimage: string | null
          perguntasnivelid: number
          quizid: number | null
          status: boolean
          tempo: number
        }
        Insert: {
          categoriasid: number
          conteudo?: string | null
          id?: number
          pathimage?: string | null
          perguntasnivelid: number
          quizid?: number | null
          status?: boolean
          tempo?: number
        }
        Update: {
          categoriasid?: number
          conteudo?: string | null
          id?: number
          pathimage?: string | null
          perguntasnivelid?: number
          quizid?: number | null
          status?: boolean
          tempo?: number
        }
        Relationships: [
          {
            foreignKeyName: "perguntas_categoriasid_fkey"
            columns: ["categoriasid"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perguntas_perguntasnivelid_fkey"
            columns: ["perguntasnivelid"]
            isOneToOne: false
            referencedRelation: "perguntasnivel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perguntas_quizid_fkey"
            columns: ["quizid"]
            isOneToOne: false
            referencedRelation: "quiz"
            referencedColumns: ["id"]
          },
        ]
      }
      perguntasnivel: {
        Row: {
          id: number
          nivel: number
          pontuacao: number
          tempo: number
        }
        Insert: {
          id?: number
          nivel: number
          pontuacao: number
          tempo: number
        }
        Update: {
          id?: number
          nivel?: number
          pontuacao?: number
          tempo?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_id: string
          completed_environments: number[]
          created_at: string
          display_name: string
          id: string
          total_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_id?: string
          completed_environments?: number[]
          created_at?: string
          display_name?: string
          id?: string
          total_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_id?: string
          completed_environments?: number[]
          created_at?: string
          display_name?: string
          id?: string
          total_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progressoperguntas: {
        Row: {
          id: number
          perguntasid: number
          usuariosid: number
        }
        Insert: {
          id?: number
          perguntasid: number
          usuariosid: number
        }
        Update: {
          id?: number
          perguntasid?: number
          usuariosid?: number
        }
        Relationships: [
          {
            foreignKeyName: "progressoperguntas_perguntasid_fkey"
            columns: ["perguntasid"]
            isOneToOne: false
            referencedRelation: "perguntas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progressoperguntas_usuariosid_fkey"
            columns: ["usuariosid"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          base_text: string
          created_at: string
          environment_id: number
          id: string
          is_active: boolean
          statements: Json
          subject: string
          updated_at: string
        }
        Insert: {
          base_text: string
          created_at?: string
          environment_id: number
          id?: string
          is_active?: boolean
          statements?: Json
          subject: string
          updated_at?: string
        }
        Update: {
          base_text?: string
          created_at?: string
          environment_id?: number
          id?: string
          is_active?: boolean
          statements?: Json
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz: {
        Row: {
          avaliativo: boolean
          cursoid: number
          id: number
          imagem: string
          status: boolean
          titulo: string
          usuarioid: number
        }
        Insert: {
          avaliativo?: boolean
          cursoid: number
          id?: number
          imagem?: string
          status?: boolean
          titulo: string
          usuarioid: number
        }
        Update: {
          avaliativo?: boolean
          cursoid?: number
          id?: number
          imagem?: string
          status?: boolean
          titulo?: string
          usuarioid?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_cursoid_fkey"
            columns: ["cursoid"]
            isOneToOne: false
            referencedRelation: "curso"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_usuarioid_fkey"
            columns: ["usuarioid"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_avaliativo_usuario: {
        Row: {
          horafinal: string
          horainicial: string
          id: number
          pontuacao: number
          quizid: number
          usuarioid: number
        }
        Insert: {
          horafinal?: string
          horainicial?: string
          id?: number
          pontuacao?: number
          quizid: number
          usuarioid: number
        }
        Update: {
          horafinal?: string
          horainicial?: string
          id?: number
          pontuacao?: number
          quizid?: number
          usuarioid?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_avaliativo_usuario_quizid_fkey"
            columns: ["quizid"]
            isOneToOne: false
            referencedRelation: "quiz"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_avaliativo_usuario_usuarioid_fkey"
            columns: ["usuarioid"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          campusid: number | null
          cidade: string
          cursoid: number
          datanascimento: string
          email: string
          foto: string
          id: number
          nome: string
          periodo: number | null
          pontuacao: number
          role: number
          senha: string
          sexo: number
          status: boolean
          telefone: string
          turma: string | null
          uf: string
        }
        Insert: {
          campusid?: number | null
          cidade?: string
          cursoid: number
          datanascimento?: string
          email: string
          foto?: string
          id?: number
          nome: string
          periodo?: number | null
          pontuacao?: number
          role?: number
          senha: string
          sexo?: number
          status?: boolean
          telefone?: string
          turma?: string | null
          uf?: string
        }
        Update: {
          campusid?: number | null
          cidade?: string
          cursoid?: number
          datanascimento?: string
          email?: string
          foto?: string
          id?: number
          nome?: string
          periodo?: number | null
          pontuacao?: number
          role?: number
          senha?: string
          sexo?: number
          status?: boolean
          telefone?: string
          turma?: string | null
          uf?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_campusid_fkey"
            columns: ["campusid"]
            isOneToOne: false
            referencedRelation: "campus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_cursoid_fkey"
            columns: ["cursoid"]
            isOneToOne: false
            referencedRelation: "curso"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
