import { FavoritesList } from '../components/FavoritesList';
import { getFavorites, addFavorite, removeFavorite } from '../lib/favorites';
import {
  getCharacterData,
  getTibiaNews,
  getTibiaBazaar,
} from '../services/tibiaApi';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GlassButton } from '../components/v0/glass-button';
import { Input } from '../components/v0/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/v0/ui/card';
import {
  Search,
  User,
  Swords,
  ShieldAlert,
  ScrollText,
  Newspaper,
  Users,
  Gavel,
  Loader2,
  Star,
  Globe,
  Activity,
  ExternalLink,
  Coins,
  Filter,
  Zap,
  Clock,
} from 'lucide-react';

interface SearchHistory {
  id: string;
  query: string;
  status: string;
  created_at: string;
  user_id: string;
}

const RashidTracker = () => {
  const rashidLocations: { [key: number]: string } = {
    0: 'Carlin',
    1: 'Svargrond',
    2: 'Liberty Bay',
    3: 'Port Hope',
    4: 'Ankrahmun',
    5: 'Darashia',
    6: 'Edron',
  };

  const today = new Date().getDay();
  const currentCity = rashidLocations[today];

  return (
    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 px-4 rounded-xl border border-[#d4af37]/30">
      <img
        src="/Rashid.gif"
        alt="Rashid"
        className="w-10 h-10 object-contain"
      />
      <div className="flex flex-col">
        <span className="text-[8px] uppercase tracking-tighter text-[#d4af37]/60 font-bold"></span>
        <span
          className="text-xs text-[#f5e6c8] font-bold uppercase tracking-widest animate-pulse"
          style={{
            textShadow:
              '0 0 8px rgba(212, 175, 55, 0.8), 0 0 12px rgba(212, 175, 55, 0.5)',
          }}
        >
          {currentCity}
        </span>
      </div>
    </div>
  );
};

function MainDashboard() {
  const navigate = useNavigate();
  const [charName, setCharName] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [bazaar, setBazaar] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'search' | 'news' | 'bazaar'>(
    'search',
  );
  const [showFilters, setShowFilters] = useState(false);
  const [nicknameFilter, setNicknameFilter] = useState('');
  const [bazaarFilters, setBazaarFilters] = useState({
    vocation: 'all',
    pvp_type: 'all',
    battleye: 'all',
    location: 'all',
    min_level: '',
    max_level: '',
    min_skill: '',
    max_skill: '',
    skill_type: 'magic',
  });

  const filteredBazaar = useMemo(() => {
    return bazaar.filter((item) =>
      item.name.toLowerCase().includes(nicknameFilter.toLowerCase()),
    );
  }, [bazaar, nicknameFilter]);

  async function fetchHistory() {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      setHistory((data as SearchHistory[]) || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadFavorites(uid: string) {
    try {
      const data = await getFavorites(uid);
      setFavorites(data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        fetchHistory();
        loadFavorites(user.id);
      }
    });
  }, []);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSearch(e: React.FormEvent | string) {
    if (typeof e !== 'string') e.preventDefault();
    const nameToSearch = typeof e === 'string' ? e : charName.trim();
    if (!nameToSearch) return;
    setViewMode('search');
    setIsLoading(true);
    try {
      const apiData = await getCharacterData(nameToSearch);
      if (userId) {
        await supabase.from('search_history').insert([
          {
            query: nameToSearch,
            user_id: userId,
            status: apiData ? 'success' : 'not_found',
          },
        ]);
      }
      setSearchResult(apiData);
      setCharName('');
      fetchHistory();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleShowNews() {
    setViewMode('news');
    setSearchResult(null);
    setIsLoading(true);
    try {
      const data = await getTibiaNews();
      setNews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleShowBazaar(filters = bazaarFilters) {
    setViewMode('bazaar');
    setSearchResult(null);
    setIsLoading(true);
    try {
      const cleanFilters = {
        ...filters,
        min_level: filters.min_level ? Number(filters.min_level) : undefined,
        max_level: filters.max_level ? Number(filters.max_level) : undefined,
        min_skill: filters.min_skill ? Number(filters.min_skill) : undefined,
        max_skill: filters.max_skill ? Number(filters.max_skill) : undefined,
      };
      const data = await getTibiaBazaar(cleanFilters);
      setBazaar(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleToggleFavorite = async (name: string) => {
    if (!userId) return;
    const isFav = favorites.some(
      (f) => f.char_name.toLowerCase() === name.toLowerCase(),
    );
    try {
      if (isFav) {
        await removeFavorite(userId, name);
        setFavorites((prev) =>
          prev.filter((f) => f.char_name.toLowerCase() !== name.toLowerCase()),
        );
      } else {
        await addFavorite(userId, name);
        setFavorites((prev) => [...prev, { char_name: name }]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#f5e6c8] space-y-8 p-6 lg:p-10 px-8 lg:px-12 relative overflow-x-hidden font-sans">
      <div className="fixed inset-0 bg-[url('/wallpaper2.jpg')] bg-fixed bg-cover bg-center -z-20 scale-100 opacity-80" />
      <div className="fixed inset-0 bg-black/30 -z-10" />

      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-6 pr-6">
        <RashidTracker />
        <GlassButton variant="secondary" onClick={handleLogout}>
          Sair
        </GlassButton>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 px-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassButton
            variant="secondary"
            onClick={handleShowNews}
            disabled={isLoading}
          >
            <div className="flex items-center gap-3">
              <Newspaper className="h-5 w-5 text-[#d4af37]" />
              <span>News</span>
            </div>
          </GlassButton>
          <GlassButton
            variant="secondary"
            onClick={() => setViewMode('search')}
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-[#d4af37]" />
              <span>Characters</span>
            </div>
          </GlassButton>
          <GlassButton
            variant="secondary"
            onClick={() => handleShowBazaar()}
            disabled={isLoading}
          >
            <div className="flex items-center gap-3">
              <Gavel className="h-5 w-5 text-[#d4af37]" />
              <span>Bazaar</span>
            </div>
          </GlassButton>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 bg-black/40 rounded-xl border border-[#d4af37]/20 animate-in fade-in duration-300">
            <Loader2 className="h-10 w-10 text-[#d4af37] animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-[#d4af37] animate-pulse">
              Consultando a Biblioteca Real...
            </p>
          </div>
        )}

        {!isLoading && viewMode === 'news' && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
            <h3 className="font-medieval text-[#d4af37] tracking-widest uppercase text-xs px-1">
              Últimos Relatos Oficiais
            </h3>
            <div className="grid gap-4">
              {news.map((item, idx) => (
                <Card
                  key={idx}
                  className="bg-black/60 border-[#d4af37]/30 backdrop-blur-md"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-[#d4af37] font-bold">
                        {item.date}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-[#d4af37]/10 text-[#d4af37] uppercase border border-[#d4af37]/20">
                        {item.type}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-sm leading-tight mb-2">
                      {item.news}
                    </h4>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[9px] text-[#c4b08a] flex items-center gap-1 hover:text-white underline"
                    >
                      VER NO SITE <ExternalLink size={9} />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!isLoading && viewMode === 'bazaar' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-black/60 border border-[#d4af37]/30 rounded-xl p-6 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medieval text-[#d4af37] tracking-widest uppercase text-sm flex items-center gap-2">
                  <Filter size={16} /> Filtros de Leilão
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-[10px] text-[#c4b08a] underline uppercase"
                >
                  {showFilters ? 'Recolher' : 'Expandir Filtros'}
                </button>
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all ${showFilters ? 'opacity-100' : 'hidden'}`}
              >
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-[#d4af37]/70">
                    Vocação
                  </label>
                  <select
                    value={bazaarFilters.vocation}
                    onChange={(e) =>
                      setBazaarFilters({
                        ...bazaarFilters,
                        vocation: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 border border-[#d4af37]/20 rounded p-2 text-xs text-white outline-none"
                  >
                    <option value="all">Todas</option>
                    <option value="none">None</option>
                    <option value="knight">Knight</option>
                    <option value="paladin">Paladin</option>
                    <option value="sorcerer">Sorcerer</option>
                    <option value="druid">Druid</option>
                    <option value="monk">Monk</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-[#d4af37]/70">
                    Tipo de PvP
                  </label>
                  <select
                    value={bazaarFilters.pvp_type}
                    onChange={(e) =>
                      setBazaarFilters({
                        ...bazaarFilters,
                        pvp_type: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 border border-[#d4af37]/20 rounded p-2 text-xs text-white outline-none"
                  >
                    <option value="all">Todos</option>
                    <option value="optional">Optional</option>
                    <option value="open">Open</option>
                    <option value="retro_open">Retro Open</option>
                    <option value="hardcore">Hardcore</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-[#d4af37]/70">
                    BattlEye
                  </label>
                  <select
                    value={bazaarFilters.battleye}
                    onChange={(e) =>
                      setBazaarFilters({
                        ...bazaarFilters,
                        battleye: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 border border-[#d4af37]/20 rounded p-2 text-xs text-white outline-none"
                  >
                    <option value="all">Todos</option>
                    <option value="green">Verde</option>
                    <option value="yellow">Amarelo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-[#d4af37]/70">
                    Level Range
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={bazaarFilters.min_level}
                      onChange={(e) =>
                        setBazaarFilters({
                          ...bazaarFilters,
                          min_level: e.target.value,
                        })
                      }
                      className="h-8 bg-black/40 border-[#d4af37]/20 text-xs"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={bazaarFilters.max_level}
                      onChange={(e) =>
                        setBazaarFilters({
                          ...bazaarFilters,
                          max_level: e.target.value,
                        })
                      }
                      className="h-8 bg-black/40 border-[#d4af37]/20 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-[#d4af37]/70">
                    Skill Range
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={bazaarFilters.skill_type}
                      onChange={(e) =>
                        setBazaarFilters({
                          ...bazaarFilters,
                          skill_type: e.target.value,
                        })
                      }
                      className="bg-black/40 border border-[#d4af37]/20 rounded p-1 text-[10px] text-white w-20 outline-none"
                    >
                      <option value="magic">Magic</option>
                      <option value="distance">Dist</option>
                      <option value="sword">Sword</option>
                      <option value="axe">Axe</option>
                      <option value="club">Club</option>
                    </select>
                    <Input
                      placeholder="Min"
                      value={bazaarFilters.min_skill}
                      onChange={(e) =>
                        setBazaarFilters({
                          ...bazaarFilters,
                          min_skill: e.target.value,
                        })
                      }
                      className="h-8 bg-black/40 border-[#d4af37]/20 text-xs w-full"
                    />
                    <Input
                      placeholder="Max"
                      value={bazaarFilters.max_skill}
                      onChange={(e) =>
                        setBazaarFilters({
                          ...bazaarFilters,
                          max_skill: e.target.value,
                        })
                      }
                      className="h-8 bg-black/40 border-[#d4af37]/20 text-xs w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-[#d4af37]/70">
                    Localização
                  </label>
                  <select
                    value={bazaarFilters.location}
                    onChange={(e) =>
                      setBazaarFilters({
                        ...bazaarFilters,
                        location: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 border border-[#d4af37]/20 rounded p-2 text-xs text-white outline-none"
                  >
                    <option value="all">Global</option>
                    <option value="europe">EU</option>
                    <option value="north_america">NA</option>
                    <option value="south_america">BR</option>
                  </select>
                </div>
              </div>

              <GlassButton
                variant="primary"
                className="w-full mt-6 py-2 h-auto text-xs"
                onClick={() => handleShowBazaar()}
              >
                FILTRAR MERCADO
              </GlassButton>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#d4af37]/50" />
              <Input
                placeholder="Filtrar por nickname nos resultados..."
                value={nicknameFilter}
                onChange={(e) => setNicknameFilter(e.target.value)}
                className="pl-10 bg-black/40 border-[#d4af37]/20 text-xs h-9"
              />
            </div>

            <div className="grid gap-4">
              {filteredBazaar.length > 0 ? (
                filteredBazaar.map((item, idx) => (
                  <Card
                    key={idx}
                    className="bg-black/60 border-[#d4af37]/30 backdrop-blur-md hover:border-[#d4af37]/60 transition-all group overflow-hidden"
                  >
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      <div className="p-4 flex items-center gap-4 flex-1">
                        <div className="relative bg-white/5 p-2 rounded-lg border border-[#d4af37]/10">
                          <img
                            src={item.outfit_url}
                            alt=""
                            className="h-14 w-14 object-contain"
                          />
                          <div className="absolute -top-2 -left-2 bg-[#d4af37] text-black text-[8px] px-1 font-bold rounded-sm">
                            LV {item.level}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold group-hover:text-[#d4af37] transition-colors flex items-center gap-2">
                            {item.name}
                            {item.battleye_status === 'green' && (
                              <Zap size={12} className="text-green-400" />
                            )}
                          </h4>
                          <p className="text-[10px] text-[#c4b08a]">
                            {item.vocation} • {item.world}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {['axe', 'distance', 'magic'].map((skill) => (
                              <div
                                key={skill}
                                className="bg-black/40 px-2 py-1 rounded border border-white/5 flex flex-col items-center min-w-[40px]"
                              >
                                <span className="text-[7px] uppercase opacity-50">
                                  {skill}
                                </span>
                                <span className="text-[10px] font-bold text-[#d4af37]">
                                  {item.skills?.[skill] || '--'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#d4af37]/5 p-4 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-[#d4af37]/10 min-w-[140px]">
                        <div className="text-right">
                          <p className="text-[8px] uppercase tracking-tighter opacity-60">
                            Lance Atual
                          </p>
                          <div className="flex items-center gap-1 text-[#d4af37] font-bold text-lg">
                            <Coins size={16} /> {item.bid.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <span className="text-[9px] text-white/70 uppercase">
                            {item.location}
                          </span>
                          <div className="text-[9px] text-[#c4b08a] flex items-center gap-1">
                            <Clock size={10} />{' '}
                            {item.auction_end_relative || 'Finalizando'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 opacity-40 italic text-xs">
                  Nenhum leilão encontrado.
                </div>
              )}
            </div>
          </div>
        )}

        {!isLoading && viewMode === 'search' && (
          <>
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-[#d4af37]/30"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-[#d4af37]/50" />
                <Input
                  placeholder="Pesquisar personagem..."
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  className="pl-10 bg-black/60 border-[#d4af37]/20 text-[#f5e6c8]"
                />
              </div>
              <GlassButton variant="primary" type="submit" className="sm:w-44">
                Pesquisar
              </GlassButton>
            </form>

            {searchResult && (
              <Card className="bg-black/60 border-[#d4af37]/40 backdrop-blur-md animate-in zoom-in duration-300">
                <CardHeader className="flex flex-row items-center justify-between border-b border-[#d4af37]/20 py-4">
                  <CardTitle className="flex items-center gap-2 text-[#d4af37]">
                    <User className="h-5 w-5" /> {searchResult.name}
                  </CardTitle>
                  <button
                    onClick={() => handleToggleFavorite(searchResult.name)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <Star
                      size={24}
                      className={
                        favorites.some(
                          (f) =>
                            f.char_name.toLowerCase() ===
                            searchResult.name.toLowerCase(),
                        )
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-400'
                      }
                    />
                  </button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg border border-white/5">
                      <Swords className="h-4 w-4 mb-1 text-[#d4af37]" />
                      <span className="text-[9px] uppercase opacity-60">
                        Level
                      </span>
                      <span className="text-lg font-bold text-white">
                        {searchResult.level}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg border border-white/5">
                      <ShieldAlert className="h-4 w-4 mb-1 text-[#d4af37]" />
                      <span className="text-[9px] uppercase opacity-60">
                        Vocation
                      </span>
                      <span className="text-xs font-bold text-white text-center">
                        {searchResult.vocation}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg border border-white/5">
                      <Globe className="h-4 w-4 mb-1 text-[#d4af37]" />
                      <span className="text-[9px] uppercase opacity-60">
                        World
                      </span>
                      <span className="text-xs font-bold text-white">
                        {searchResult.world}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg border border-white/5">
                      <Activity className="h-4 w-4 mb-1 text-[#d4af37]" />
                      <span className="text-[9px] uppercase opacity-60">
                        Status
                      </span>
                      <span
                        className={`text-xs font-bold uppercase ${searchResult.status === 'online' ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {searchResult.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <div className="space-y-4 pt-4">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center gap-2 text-[#d4af37] font-medieval tracking-widest text-[10px] uppercase outline-none"
          >
            <Star
              size={14}
              className={showFavorites ? 'fill-yellow-400 text-yellow-400' : ''}
            />
            {showFavorites ? 'Ocultar Favoritos' : 'Ver Favoritos'}
          </button>
          {showFavorites && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <FavoritesList
                favorites={favorites}
                onRemove={(name) => handleToggleFavorite(name)}
                onSelect={(name) => {
                  handleSearch(name);
                  setShowFavorites(false);
                }}
              />
            </div>
          )}
          <Card className="bg-black/40 border-[#d4af37]/20 backdrop-blur-sm">
            <CardHeader className="border-b border-[#d4af37]/10 py-2 px-4">
              <CardTitle className="flex items-center gap-2 text-[#d4af37] font-medieval tracking-widest uppercase text-[10px]">
                <ScrollText className="h-3 w-3" /> Pergaminhos de Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs">
                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#d4af37]/5 hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => handleSearch(item.query)}
                    >
                      <td className="p-3 font-bold text-white">{item.query}</td>
                      <td className="p-3 text-right text-[9px]">
                        <span
                          className={`px-2 py-0.5 rounded-full border uppercase ${item.status === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MainDashboard;
