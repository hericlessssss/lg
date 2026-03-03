import React from 'react';
import { Star, Trash2, User } from 'lucide-react';

interface Favorite {
  char_name: string;
}

interface FavoritesListProps {
  favorites: Favorite[];
  onRemove: (name: string) => void;
  onSelect: (name: string) => void;
}

export function FavoritesList({
  favorites,
  onRemove,
  onSelect,
}: FavoritesListProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Star className="text-yellow-400 fill-yellow-400" size={20} />
        <h3 className="font-bold">Favoritos</h3>
      </div>

      {favorites.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Nenhum favorito ainda.</p>
      ) : (
        <div className="space-y-2">
          {favorites.map((fav) => (
            <div
              key={fav.char_name}
              className="flex items-center justify-between bg-black/20 p-2 rounded-lg hover:bg-black/40 transition-colors"
            >
              <button
                onClick={() => onSelect(fav.char_name)}
                className="flex items-center gap-2 text-sm font-medium hover:text-yellow-400"
              >
                <User size={14} />
                {fav.char_name}
              </button>
              <button
                onClick={() => onRemove(fav.char_name)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
