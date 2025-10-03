import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Profile Database Queries
 */

/**
 * Get profile by user ID
 */
export async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get profile by username
 */
export async function getProfileByUsername(
  supabase: SupabaseClient<Database>,
  username: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new profile
 */
export async function createProfile(
  supabase: SupabaseClient<Database>,
  profile: ProfileInsert
) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update profile
 */
export async function updateProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  updates: ProfileUpdate
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(
  supabase: SupabaseClient<Database>,
  username: string
): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle();

  return !data;
}
