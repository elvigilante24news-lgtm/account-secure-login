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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      equipos: {
        Row: {
          bandera: string
          codigo: string
          grupo: string
          id: string
          nombre: string
        }
        Insert: {
          bandera: string
          codigo: string
          grupo: string
          id: string
          nombre: string
        }
        Update: {
          bandera?: string
          codigo?: string
          grupo?: string
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      ganadores: {
        Row: {
          fecha_ganado: string
          id: string
          notificado: boolean
          premio_id: string
          puesto: number
          sorteo_id: string
          tipo: string
          user_id: string
        }
        Insert: {
          fecha_ganado?: string
          id?: string
          notificado?: boolean
          premio_id: string
          puesto: number
          sorteo_id: string
          tipo?: string
          user_id: string
        }
        Update: {
          fecha_ganado?: string
          id?: string
          notificado?: boolean
          premio_id?: string
          puesto?: number
          sorteo_id?: string
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ganadores_premio_id_fkey"
            columns: ["premio_id"]
            isOneToOne: false
            referencedRelation: "premios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ganadores_sorteo_id_fkey"
            columns: ["sorteo_id"]
            isOneToOne: false
            referencedRelation: "sorteos"
            referencedColumns: ["id"]
          },
        ]
      }
      notificaciones: {
        Row: {
          fecha: string
          id: string
          leida: boolean
          mensaje: string
          partido_id: string | null
          sorteo_id: string | null
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          fecha?: string
          id?: string
          leida?: boolean
          mensaje: string
          partido_id?: string | null
          sorteo_id?: string | null
          tipo: string
          titulo: string
          user_id: string
        }
        Update: {
          fecha?: string
          id?: string
          leida?: boolean
          mensaje?: string
          partido_id?: string | null
          sorteo_id?: string | null
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificaciones_partido_id_fkey"
            columns: ["partido_id"]
            isOneToOne: false
            referencedRelation: "partidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificaciones_sorteo_id_fkey"
            columns: ["sorteo_id"]
            isOneToOne: false
            referencedRelation: "sorteos"
            referencedColumns: ["id"]
          },
        ]
      }
      participaciones: {
        Row: {
          chances: number | null
          es_acertador: boolean | null
          estado: string
          fecha_participacion: string
          id: string
          numero_ticket: string
          puesto: number | null
          sorteo_id: string
          user_id: string
        }
        Insert: {
          chances?: number | null
          es_acertador?: boolean | null
          estado?: string
          fecha_participacion?: string
          id?: string
          numero_ticket: string
          puesto?: number | null
          sorteo_id: string
          user_id: string
        }
        Update: {
          chances?: number | null
          es_acertador?: boolean | null
          estado?: string
          fecha_participacion?: string
          id?: string
          numero_ticket?: string
          puesto?: number | null
          sorteo_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participaciones_sorteo_id_fkey"
            columns: ["sorteo_id"]
            isOneToOne: false
            referencedRelation: "sorteos"
            referencedColumns: ["id"]
          },
        ]
      }
      partidos: {
        Row: {
          ciudad: string
          creado_por: string | null
          created_at: string
          descripcion: string | null
          equipo_local_id: string
          equipo_visitante_id: string
          estadio: string
          estado: string
          fase: string
          fecha: string
          goles_local: number | null
          goles_visitante: number | null
          grupo: string | null
          hora: string
          id: string
          imagen: string | null
          jornada: number | null
          sorteo_id: string | null
          updated_at: string
          video: string | null
        }
        Insert: {
          ciudad: string
          creado_por?: string | null
          created_at?: string
          descripcion?: string | null
          equipo_local_id: string
          equipo_visitante_id: string
          estadio: string
          estado?: string
          fase: string
          fecha: string
          goles_local?: number | null
          goles_visitante?: number | null
          grupo?: string | null
          hora: string
          id?: string
          imagen?: string | null
          jornada?: number | null
          sorteo_id?: string | null
          updated_at?: string
          video?: string | null
        }
        Update: {
          ciudad?: string
          creado_por?: string | null
          created_at?: string
          descripcion?: string | null
          equipo_local_id?: string
          equipo_visitante_id?: string
          estadio?: string
          estado?: string
          fase?: string
          fecha?: string
          goles_local?: number | null
          goles_visitante?: number | null
          grupo?: string | null
          hora?: string
          id?: string
          imagen?: string | null
          jornada?: number | null
          sorteo_id?: string | null
          updated_at?: string
          video?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partidos_equipo_local_id_fkey"
            columns: ["equipo_local_id"]
            isOneToOne: false
            referencedRelation: "equipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partidos_equipo_visitante_id_fkey"
            columns: ["equipo_visitante_id"]
            isOneToOne: false
            referencedRelation: "equipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partidos_sorteo_id_fkey"
            columns: ["sorteo_id"]
            isOneToOne: false
            referencedRelation: "sorteos"
            referencedColumns: ["id"]
          },
        ]
      }
      predicciones: {
        Row: {
          estado: string
          fecha_prediccion: string
          goles_local: number
          goles_visitante: number
          id: string
          partido_id: string
          sorteo_id: string
          triple_chance_aplicado: boolean | null
          user_id: string
        }
        Insert: {
          estado?: string
          fecha_prediccion?: string
          goles_local: number
          goles_visitante: number
          id?: string
          partido_id: string
          sorteo_id: string
          triple_chance_aplicado?: boolean | null
          user_id: string
        }
        Update: {
          estado?: string
          fecha_prediccion?: string
          goles_local?: number
          goles_visitante?: number
          id?: string
          partido_id?: string
          sorteo_id?: string
          triple_chance_aplicado?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predicciones_partido_id_fkey"
            columns: ["partido_id"]
            isOneToOne: false
            referencedRelation: "partidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predicciones_sorteo_id_fkey"
            columns: ["sorteo_id"]
            isOneToOne: false
            referencedRelation: "sorteos"
            referencedColumns: ["id"]
          },
        ]
      }
      premios: {
        Row: {
          descripcion: string | null
          id: string
          imagen: string | null
          nombre: string
          puesto: number
          sorteo_id: string
          valor: string | null
        }
        Insert: {
          descripcion?: string | null
          id?: string
          imagen?: string | null
          nombre: string
          puesto: number
          sorteo_id: string
          valor?: string | null
        }
        Update: {
          descripcion?: string | null
          id?: string
          imagen?: string | null
          nombre?: string
          puesto?: number
          sorteo_id?: string
          valor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "premios_sorteo_id_fkey"
            columns: ["sorteo_id"]
            isOneToOne: false
            referencedRelation: "sorteos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          apellido: string
          ciudad: string | null
          created_at: string
          dni: string | null
          fecha_nacimiento: string | null
          id: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          apellido?: string
          ciudad?: string | null
          created_at?: string
          dni?: string | null
          fecha_nacimiento?: string | null
          id: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          apellido?: string
          ciudad?: string | null
          created_at?: string
          dni?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sorteos: {
        Row: {
          cantidad_ganadores: number | null
          creado_por: string | null
          created_at: string
          descripcion: string
          edad_maxima: number | null
          edad_minima: number
          estado: string
          fecha_fin: string
          fecha_inicio: string
          fecha_sorteo: string
          id: string
          imagen: string | null
          max_participantes: number | null
          participantes: number
          requisitos: string[] | null
          terminos_condiciones: string | null
          tipo_sorteo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          cantidad_ganadores?: number | null
          creado_por?: string | null
          created_at?: string
          descripcion?: string
          edad_maxima?: number | null
          edad_minima?: number
          estado?: string
          fecha_fin: string
          fecha_inicio: string
          fecha_sorteo: string
          id?: string
          imagen?: string | null
          max_participantes?: number | null
          participantes?: number
          requisitos?: string[] | null
          terminos_condiciones?: string | null
          tipo_sorteo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          cantidad_ganadores?: number | null
          creado_por?: string | null
          created_at?: string
          descripcion?: string
          edad_maxima?: number | null
          edad_minima?: number
          estado?: string
          fecha_fin?: string
          fecha_inicio?: string
          fecha_sorteo?: string
          id?: string
          imagen?: string | null
          max_participantes?: number | null
          participantes?: number
          requisitos?: string[] | null
          terminos_condiciones?: string | null
          tipo_sorteo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
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
      increment_participantes: {
        Args: { sorteo_uuid: string }
        Returns: undefined
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
