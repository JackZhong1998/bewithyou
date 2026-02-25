import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Character } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/** 数据库 characters 表行类型 */
export interface CharacterRow {
  id: string;
  clerk_user_id: string;
  name: string;
  avatar_url: string;
  voice_id: string;
  description: string | null;
  is_public: boolean;
  status: 'cloning' | 'ready';
  creator_name: string | null;
  created_at: string;
  updated_at: string;
}

export function rowToCharacter(row: CharacterRow): Character {
  return {
    id: row.id,
    name: row.name,
    avatarUrl: row.avatar_url,
    voiceId: row.voice_id,
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
    description: row.description ?? undefined,
    isPublic: row.is_public,
    creatorName: row.creator_name ?? undefined,
  };
}

export function characterToRow(c: Character, clerkUserId: string): Omit<CharacterRow, 'created_at' | 'updated_at'> {
  return {
    id: c.id,
    clerk_user_id: clerkUserId,
    name: c.name,
    avatar_url: c.avatarUrl,
    voice_id: c.voiceId,
    description: c.description ?? null,
    is_public: c.isPublic ?? false,
    status: c.status,
    creator_name: c.creatorName ?? null,
  };
}
