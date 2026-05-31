export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'owner' | 'admin' | 'staff' | 'content_editor' | 'instructor' | 'read_only'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          role: UserRole
          status: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          role?: UserRole
          status?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          role?: UserRole
          status?: string
          avatar_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Record<string, unknown>
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Record<string, unknown>
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Record<string, unknown>
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          id: string
          name_fr: string
          name_en: string
          description_fr: string | null
          description_en: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_fr: string
          name_en: string
          description_fr?: string | null
          description_en?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name_fr?: string
          name_en?: string
          description_fr?: string | null
          description_en?: string | null
          sort_order?: number
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          id: string
          category_id: string
          name_fr: string
          name_en: string
          description_fr: string | null
          description_en: string | null
          price_cents: number | null
          price_display: string | null
          tags: string[]
          allergens: string[]
          is_available: boolean
          is_featured: boolean
          image_url: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name_fr: string
          name_en: string
          description_fr?: string | null
          description_en?: string | null
          price_cents?: number | null
          price_display?: string | null
          tags?: string[]
          allergens?: string[]
          is_available?: boolean
          is_featured?: boolean
          image_url?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          name_fr?: string
          name_en?: string
          description_fr?: string | null
          description_en?: string | null
          price_cents?: number | null
          price_display?: string | null
          tags?: string[]
          allergens?: string[]
          is_available?: boolean
          is_featured?: boolean
          image_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      experiences: {
        Row: {
          id: string
          category: string
          title_fr: string
          title_en: string
          description_fr: string | null
          description_en: string | null
          short_description_fr: string | null
          short_description_en: string | null
          instructor_name: string | null
          instructor_bio_fr: string | null
          instructor_bio_en: string | null
          start_time: string
          end_time: string
          duration_minutes: number
          capacity: number
          spots_reserved: number
          spots_confirmed: number
          price_cents: number
          currency: string
          location_fr: string | null
          location_en: string | null
          image_url: string | null
          tags: string[]
          requirements_fr: string | null
          requirements_en: string | null
          included_fr: string | null
          included_en: string | null
          what_to_bring_fr: string | null
          what_to_bring_en: string | null
          cancellation_policy_fr: string | null
          cancellation_policy_en: string | null
          status: 'draft' | 'published' | 'cancelled' | 'completed'
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          title_fr: string
          title_en: string
          description_fr?: string | null
          description_en?: string | null
          short_description_fr?: string | null
          short_description_en?: string | null
          instructor_name?: string | null
          instructor_bio_fr?: string | null
          instructor_bio_en?: string | null
          start_time: string
          end_time: string
          duration_minutes: number
          capacity: number
          spots_reserved?: number
          spots_confirmed?: number
          price_cents: number
          currency?: string
          location_fr?: string | null
          location_en?: string | null
          image_url?: string | null
          tags?: string[]
          requirements_fr?: string | null
          requirements_en?: string | null
          included_fr?: string | null
          included_en?: string | null
          what_to_bring_fr?: string | null
          what_to_bring_en?: string | null
          cancellation_policy_fr?: string | null
          cancellation_policy_en?: string | null
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          category?: string
          title_fr?: string
          title_en?: string
          description_fr?: string | null
          description_en?: string | null
          short_description_fr?: string | null
          short_description_en?: string | null
          instructor_name?: string | null
          instructor_bio_fr?: string | null
          instructor_bio_en?: string | null
          start_time?: string
          end_time?: string
          duration_minutes?: number
          capacity?: number
          spots_reserved?: number
          spots_confirmed?: number
          price_cents?: number
          currency?: string
          location_fr?: string | null
          location_en?: string | null
          image_url?: string | null
          tags?: string[]
          requirements_fr?: string | null
          requirements_en?: string | null
          included_fr?: string | null
          included_en?: string | null
          what_to_bring_fr?: string | null
          what_to_bring_en?: string | null
          cancellation_policy_fr?: string | null
          cancellation_policy_en?: string | null
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
          is_featured?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          id: string
          experience_id: string
          user_id: string | null
          customer_first_name: string
          customer_last_name: string
          customer_email: string
          customer_phone: string
          quantity: number
          amount_cents: number
          currency: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'no_show'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          square_payment_id: string | null
          square_order_id: string | null
          notes: string | null
          consent_terms: boolean
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          user_id?: string | null
          customer_first_name: string
          customer_last_name: string
          customer_email: string
          customer_phone: string
          quantity: number
          amount_cents: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'no_show'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          square_payment_id?: string | null
          square_order_id?: string | null
          notes?: string | null
          consent_terms: boolean
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          experience_id?: string
          user_id?: string | null
          customer_first_name?: string
          customer_last_name?: string
          customer_email?: string
          customer_phone?: string
          quantity?: number
          amount_cents?: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'no_show'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          square_payment_id?: string | null
          square_order_id?: string | null
          notes?: string | null
          consent_terms?: boolean
          ip_address?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          }
        ]
      }
      private_event_inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          event_type: string
          preferred_date: string
          preferred_time: string
          guest_count: number
          budget_range: string | null
          food_drink_needs: string | null
          message: string | null
          status: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'declined' | 'cancelled'
          admin_notes: string | null
          consent_terms: boolean
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          event_type: string
          preferred_date: string
          preferred_time: string
          guest_count: number
          budget_range?: string | null
          food_drink_needs?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'declined' | 'cancelled'
          admin_notes?: string | null
          consent_terms: boolean
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          email?: string
          phone?: string
          event_type?: string
          preferred_date?: string
          preferred_time?: string
          guest_count?: number
          budget_range?: string | null
          food_drink_needs?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'declined' | 'cancelled'
          admin_notes?: string | null
          consent_terms?: boolean
          ip_address?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          id: string
          business_name: string
          contact_name: string
          email: string
          phone: string
          instagram: string | null
          product_type: string
          preferred_date: string
          space_needs: string | null
          message: string | null
          status: 'new' | 'reviewing' | 'approved' | 'declined' | 'waitlisted'
          admin_notes: string | null
          consent_terms: boolean
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_name: string
          contact_name: string
          email: string
          phone: string
          instagram?: string | null
          product_type: string
          preferred_date: string
          space_needs?: string | null
          message?: string | null
          status?: 'new' | 'reviewing' | 'approved' | 'declined' | 'waitlisted'
          admin_notes?: string | null
          consent_terms: boolean
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          business_name?: string
          contact_name?: string
          email?: string
          phone?: string
          instagram?: string | null
          product_type?: string
          preferred_date?: string
          space_needs?: string | null
          message?: string | null
          status?: 'new' | 'reviewing' | 'approved' | 'declined' | 'waitlisted'
          admin_notes?: string | null
          consent_terms?: boolean
          ip_address?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          category: string
          message: string
          status: 'new' | 'read' | 'replied' | 'archived'
          admin_notes: string | null
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          category: string
          message: string
          status?: 'new' | 'read' | 'replied' | 'archived'
          admin_notes?: string | null
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          email?: string
          phone?: string | null
          category?: string
          message?: string
          status?: 'new' | 'read' | 'replied' | 'archived'
          admin_notes?: string | null
          ip_address?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          first_name: string | null
          locale: string
          status: 'active' | 'unsubscribed' | 'bounced'
          consent_given_at: string
          unsubscribed_at: string | null
          ip_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          locale?: string
          status?: 'active' | 'unsubscribed' | 'bounced'
          consent_given_at?: string
          unsubscribed_at?: string | null
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          first_name?: string | null
          locale?: string
          status?: 'active' | 'unsubscribed' | 'bounced'
          consent_given_at?: string
          unsubscribed_at?: string | null
          ip_address?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title_fr: string
          title_en: string
          content_fr: string | null
          content_en: string | null
          excerpt_fr: string | null
          excerpt_en: string | null
          cover_image_url: string | null
          author_id: string | null
          tags: string[]
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title_fr: string
          title_en: string
          content_fr?: string | null
          content_en?: string | null
          excerpt_fr?: string | null
          excerpt_en?: string | null
          cover_image_url?: string | null
          author_id?: string | null
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          title_fr?: string
          title_en?: string
          content_fr?: string | null
          content_en?: string | null
          excerpt_fr?: string | null
          excerpt_en?: string | null
          cover_image_url?: string | null
          author_id?: string | null
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          id: string
          filename: string
          original_filename: string
          mime_type: string
          size_bytes: number
          width: number | null
          height: number | null
          url: string
          alt_fr: string | null
          alt_en: string | null
          caption_fr: string | null
          caption_en: string | null
          tags: string[]
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_filename: string
          mime_type: string
          size_bytes: number
          width?: number | null
          height?: number | null
          url: string
          alt_fr?: string | null
          alt_en?: string | null
          caption_fr?: string | null
          caption_en?: string | null
          tags?: string[]
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          filename?: string
          original_filename?: string
          mime_type?: string
          size_bytes?: number
          width?: number | null
          height?: number | null
          url?: string
          alt_fr?: string | null
          alt_en?: string | null
          caption_fr?: string | null
          caption_en?: string | null
          tags?: string[]
          uploaded_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: Record<string, unknown> | null
          new_values: Record<string, unknown> | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Record<string, unknown> | null
          new_values?: Record<string, unknown> | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Record<string, unknown> | null
          new_values?: Record<string, unknown> | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          id: string
          source: string
          event_type: string
          event_id: string
          payload: Record<string, unknown>
          processed: boolean
          processed_at: string | null
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source: string
          event_type: string
          event_id: string
          payload: Record<string, unknown>
          processed?: boolean
          processed_at?: string | null
          error?: string | null
          created_at?: string
        }
        Update: {
          processed?: boolean
          processed_at?: string | null
          error?: string | null
        }
        Relationships: []
      }
      rate_limit_events: {
        Row: {
          id: string
          identifier: string
          action: string
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          identifier: string
          action: string
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          identifier?: string
          action?: string
          ip_address?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
    }
  }
}
