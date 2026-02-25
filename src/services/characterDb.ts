import { supabase, rowToCharacter, characterToRow, type CharacterRow } from '../lib/supabase';
import type { Character } from '../types';

export async function fetchMyCharacters(clerkUserId: string): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchMyCharacters error:', error);
    return [];
  }
  return (data as CharacterRow[]).map(rowToCharacter);
}

export async function fetchPublicCharacters(): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchPublicCharacters error:', error);
    return [];
  }
  return (data as CharacterRow[]).map(rowToCharacter);
}

export async function upsertCharacter(clerkUserId: string, character: Character): Promise<boolean> {
  const row = characterToRow(character, clerkUserId);
  const { error } = await supabase.from('characters').upsert(
    {
      ...row,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );
  if (error) {
    console.error('upsertCharacter error:', error);
    return false;
  }
  return true;
}

export async function setCharacterPublic(clerkUserId: string, characterId: string, isPublic: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('characters')
    .update({
      is_public: isPublic,
      updated_at: new Date().toISOString(),
    })
    .eq('id', characterId)
    .eq('clerk_user_id', clerkUserId);

  if (error) {
    console.error('setCharacterPublic error:', error);
    return false;
  }
  return true;
}

export async function deleteCharacter(clerkUserId: string, characterId: string): Promise<boolean> {
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', characterId)
    .eq('clerk_user_id', clerkUserId);

  if (error) {
    console.error('deleteCharacter error:', error);
    return false;
  }
  return true;
}
