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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      court_cases: {
        Row: {
          case_number: string
          case_summary: string | null
          case_type: string | null
          court_name: string | null
          created_at: string
          filing_date: string | null
          id: string
          latest_order_date: string | null
          next_hearing_date: string | null
          petitioner: string
          respondent: string
          updated_at: string
          urgency: Database["public"]["Enums"]["case_urgency"] | null
          user_id: string
        }
        Insert: {
          case_number: string
          case_summary?: string | null
          case_type?: string | null
          court_name?: string | null
          created_at?: string
          filing_date?: string | null
          id?: string
          latest_order_date?: string | null
          next_hearing_date?: string | null
          petitioner: string
          respondent: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["case_urgency"] | null
          user_id: string
        }
        Update: {
          case_number?: string
          case_summary?: string | null
          case_type?: string | null
          court_name?: string | null
          created_at?: string
          filing_date?: string | null
          id?: string
          latest_order_date?: string | null
          next_hearing_date?: string | null
          petitioner?: string
          respondent?: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["case_urgency"] | null
          user_id?: string
        }
        Relationships: []
      }
      court_orders: {
        Row: {
          action_required: string | null
          case_id: string
          case_status_file_name: string | null
          case_status_file_url: string | null
          completion_date: string | null
          completion_document_url: string | null
          court_order_file_name: string | null
          court_order_file_url: string | null
          created_at: string
          deadline: string | null
          extracted_data: Json | null
          file_name: string
          file_type: string
          file_url: string
          id: string
          order_date: string
          status: Database["public"]["Enums"]["order_status"] | null
          summary: string | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_required?: string | null
          case_id: string
          case_status_file_name?: string | null
          case_status_file_url?: string | null
          completion_date?: string | null
          completion_document_url?: string | null
          court_order_file_name?: string | null
          court_order_file_url?: string | null
          created_at?: string
          deadline?: string | null
          extracted_data?: Json | null
          file_name: string
          file_type: string
          file_url: string
          id?: string
          order_date: string
          status?: Database["public"]["Enums"]["order_status"] | null
          summary?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_required?: string | null
          case_id?: string
          case_status_file_name?: string | null
          case_status_file_url?: string | null
          completion_date?: string | null
          completion_document_url?: string | null
          court_order_file_name?: string | null
          court_order_file_url?: string | null
          created_at?: string
          deadline?: string | null
          extracted_data?: Json | null
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          order_date?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          summary?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "court_orders_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "court_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bar_registration: string | null
          city: string | null
          created_at: string
          email: string | null
          firm_name: string | null
          full_name: string | null
          id: string
          phone: string | null
          practice_areas: string[] | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bar_registration?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          firm_name?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          practice_areas?: string[] | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bar_registration?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          firm_name?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          practice_areas?: string[] | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      case_urgency: "urgent" | "warning" | "normal"
      order_status: "pending" | "in-progress" | "completed"
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
      case_urgency: ["urgent", "warning", "normal"],
      order_status: ["pending", "in-progress", "completed"],
    },
  },
} as const
