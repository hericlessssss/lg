import { supabase } from './supabase';

export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addFavorite = async (userId: string, charName: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, char_name: charName }]);

  if (error) throw error;
  return data;
};

export const removeFavorite = async (userId: string, charName: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('char_name', charName);

  if (error) throw error;
  return data;
};
