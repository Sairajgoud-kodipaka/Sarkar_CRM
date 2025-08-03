export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'BUSINESS_ADMIN' | 'FLOOR_MANAGER'
          floor_id: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_active: boolean
          avatar: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'BUSINESS_ADMIN' | 'FLOOR_MANAGER'
          floor_id?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          avatar?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'BUSINESS_ADMIN' | 'FLOOR_MANAGER'
          floor_id?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          avatar?: string | null
        }
      }
      floors: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          date_of_birth: string | null
          wedding_date: string | null
          street: string | null
          city: string | null
          state: string | null
          pincode: string | null
          catchment_area: string | null
          community: string | null
          languages: string[] | null
          visit_reason: string | null
          visit_source: string | null
          interested_categories: string[] | null
          interested_products: string[] | null
          preferences: string | null
          purchase_amount: number | null
          notes: string | null
          follow_up_date: string | null
          follow_up_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | null
          floor_id: string
          registered_by_id: string
          created_at: string
          updated_at: string
          last_visit_at: string | null
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          date_of_birth?: string | null
          wedding_date?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          catchment_area?: string | null
          community?: string | null
          languages?: string[] | null
          visit_reason?: string | null
          visit_source?: string | null
          interested_categories?: string[] | null
          interested_products?: string[] | null
          preferences?: string | null
          purchase_amount?: number | null
          notes?: string | null
          follow_up_date?: string | null
          follow_up_status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | null
          floor_id: string
          registered_by_id: string
          created_at?: string
          updated_at?: string
          last_visit_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          date_of_birth?: string | null
          wedding_date?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          catchment_area?: string | null
          community?: string | null
          languages?: string[] | null
          visit_reason?: string | null
          visit_source?: string | null
          interested_categories?: string[] | null
          interested_products?: string[] | null
          preferences?: string | null
          purchase_amount?: number | null
          notes?: string | null
          follow_up_date?: string | null
          follow_up_status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | null
          floor_id?: string
          registered_by_id?: string
          created_at?: string
          updated_at?: string
          last_visit_at?: string | null
        }
      }
      customer_interactions: {
        Row: {
          id: string
          customer_id: string
          type: 'CALL' | 'EMAIL' | 'SMS' | 'VISIT' | 'SALE' | 'FOLLOW_UP'
          description: string
          outcome: string | null
          next_action: string | null
          follow_up_date: string | null
          created_by_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          type: 'CALL' | 'EMAIL' | 'SMS' | 'VISIT' | 'SALE' | 'FOLLOW_UP'
          description: string
          outcome?: string | null
          next_action?: string | null
          follow_up_date?: string | null
          created_by_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          type?: 'CALL' | 'EMAIL' | 'SMS' | 'VISIT' | 'SALE' | 'FOLLOW_UP'
          description?: string
          outcome?: string | null
          next_action?: string | null
          follow_up_date?: string | null
          created_by_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          sku: string
          description: string | null
          category_id: string
          price: number
          cost_price: number | null
          stock_quantity: number
          min_stock_level: number
          images: string[] | null
          specifications: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sku: string
          description?: string | null
          category_id: string
          price: number
          cost_price?: number | null
          stock_quantity: number
          min_stock_level: number
          images?: string[] | null
          specifications?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          description?: string | null
          category_id?: string
          price?: number
          cost_price?: number | null
          stock_quantity?: number
          min_stock_level?: number
          images?: string[] | null
          specifications?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_amount: number
          discount_amount: number | null
          final_amount: number
          payment_method: 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'EMI'
          sales_person_id: string
          floor_id: string
          sale_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_amount: number
          discount_amount?: number | null
          final_amount: number
          payment_method: 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'EMI'
          sales_person_id: string
          floor_id: string
          sale_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_amount?: number
          discount_amount?: number | null
          final_amount?: number
          payment_method?: 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'EMI'
          sales_person_id?: string
          floor_id?: string
          sale_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          subject: string
          description: string
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
          category: 'TECHNICAL' | 'BILLING' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'GENERAL'
          user_id: string
          assigned_to_id: string | null
          attachments: string[] | null
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          subject: string
          description: string
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
          category: 'TECHNICAL' | 'BILLING' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'GENERAL'
          user_id: string
          assigned_to_id?: string | null
          attachments?: string[] | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          subject?: string
          description?: string
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
          status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
          category?: 'TECHNICAL' | 'BILLING' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'GENERAL'
          user_id?: string
          assigned_to_id?: string | null
          attachments?: string[] | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 