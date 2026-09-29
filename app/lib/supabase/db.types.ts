/**
 * Database type definitions for Supabase
 * These types should match the SQL schema in Supabase
 */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'teacher' | 'student';
          created_at: string;
        };
        Insert: {
          id: string;
          role: 'teacher' | 'student';
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: 'teacher' | 'student';
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          owner_id: string;
          course_id: string;
          title: string;
          description: string | null;
          raw_json: unknown; // JSONB in PostgreSQL
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          course_id: string;
          title: string;
          description?: string | null;
          raw_json: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          raw_json?: unknown;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          course_db_id: string;
          lesson_id: string;
          step_id: string;
          is_completed: boolean;
          score: number;
          user_answer: unknown; // JSONB in PostgreSQL
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_db_id: string;
          lesson_id: string;
          step_id: string;
          is_completed?: boolean;
          score?: number;
          user_answer?: unknown;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_db_id?: string;
          lesson_id?: string;
          step_id?: string;
          is_completed?: boolean;
          score?: number;
          user_answer?: unknown;
          updated_at?: string;
        };
      };
    };
  };
};
