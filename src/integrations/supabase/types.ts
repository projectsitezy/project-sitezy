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
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          active: boolean
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          brief_file_url: string | null
          budget: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          package_name: string
          package_price: number
          payment_method: string | null
          phone: string
          requirements: string | null
          screenshot_url: string | null
          sender_number: string | null
          status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          brief_file_url?: string | null
          budget?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          package_name: string
          package_price: number
          payment_method?: string | null
          phone: string
          requirements?: string | null
          screenshot_url?: string | null
          sender_number?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          brief_file_url?: string | null
          budget?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          package_name?: string
          package_price?: number
          payment_method?: string | null
          phone?: string
          requirements?: string | null
          screenshot_url?: string | null
          sender_number?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          active: boolean
          badge: string | null
          created_at: string
          currency: string
          features: Json
          highlighted: boolean
          id: string
          name: string
          price: number
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          badge?: string | null
          created_at?: string
          currency?: string
          features?: Json
          highlighted?: boolean
          id?: string
          name: string
          price: number
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          badge?: string | null
          created_at?: string
          currency?: string
          features?: Json
          highlighted?: boolean
          id?: string
          name?: string
          price?: number
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      popup_banner: {
        Row: {
          cta_label: string | null
          cta_url: string | null
          enabled: boolean
          frequency: string
          id: string
          image_url: string | null
          message: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          cta_label?: string | null
          cta_url?: string | null
          enabled?: boolean
          frequency?: string
          id?: string
          image_url?: string | null
          message?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          cta_label?: string | null
          cta_url?: string | null
          enabled?: boolean
          frequency?: string
          id?: string
          image_url?: string | null
          message?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          live_url: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          active: boolean
          avatar_url: string | null
          body: string
          created_at: string
          id: string
          name: string
          rating: number
          role: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          body: string
          created_at?: string
          id?: string
          name: string
          rating?: number
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          body?: string
          created_at?: string
          id?: string
          name?: string
          rating?: number
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
