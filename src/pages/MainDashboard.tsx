import { FavoritesList } from '../components/FavoritesList';
import { getFavorites, addFavorite, removeFavorite } from '../lib/favorites';
import { getEventStatus, getMoonPhase } from '../lib/tibiaEvents';
import {
  getCharacterData,
  getTibiaNews,
  getTibiaBazaar,
  BazaarResponse,
} from '../services/tibiaApi';
import { useState, useEffect, useCallback } from 'react';
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
  Star,
  Globe,
  ExternalLink,
  Coins,
  Filter,
  Clock,
  ArrowUpDown,
  Package,
  ChevronLeft,
  ChevronRight,
  Zap,
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
    0: 'Carlin', 1: 'Svargrond', 2: 'Liberty Bay', 3: 'Port Hope', 4: 'Ankrahmun', 5: 'Darashia', 6: 'Edron',
  };
  const getCurrentTibiaDay = () => {
    const now = new Date();
    const tibiaTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    return tibiaTime.getDay();
  };
  const currentCity = rashidLocations[getCurrentTibiaDay()];
  return (
    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 px-4 rounded-xl border border-[#d4af37]/30">
      <img src="/Rashid.gif" alt="Rashid" className="w-10 h-10 object-contain" />
      <div className="flex flex-col">
        <span className="text-xs text-[#f5e6c8] font-bold uppercase tracking-widest animate-pulse" style={{ textShadow: '0 0 8px rgba(212, 175, 55, 0.8)' }}>
          {currentCity}
        </span>
      </div>
    </div>
  );
};

const EventHeader = () => {
  const { active, next } = getEventStatus();
  const moon = getMoonPhase();

  return (
    <div className="flex flex-col items-center justify-center py-2 px-6 bg-black/20 rounded-2xl border border-[#d4af37]/10 backdrop-blur-sm max-w-2xl mx-auto">
      <div className="flex gap-6 items-center flex-wrap justify-center">
        <div className="flex items-center gap-4 border-r border-[#d4af37]/10 pr-6">
          {active.length > 0 ? (
            <div className="flex gap-4">
              {active.map((event) => (
                <a
                  key={event.name}
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-widest animate-pulse">Ativo</span>
                    <ExternalLink size={8} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h2 className="text-xs font-bold text-white uppercase group-hover:text-green-400 transition-colors">
                    {event.name}
                  </h2>
                </a>
              ))}
            </div>
          ) : (
            <a 
    href={next?.link} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="flex flex-col items-center opacity-60 hover:opacity-100 hover:scale-105 transition-all cursor-pointer group"
  >
    <div className="flex items-center gap-1">
      <span className="text-[8px] font-bold text-[#d4af37] uppercase tracking-widest">Próximo</span>
      <ExternalLink size={8} className="text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <h2 className="text-xs font-bold text-white uppercase group-hover:text-[#d4af37] transition-colors">
      {next.name} ({next.nextStart.getDate()}/{next.nextStart.getMonth() + 1})
    </h2>
  </a>
          )}
        </div>

        <div className="flex flex-col items-center">
          {moon.isFullMoon ? (
            <div className="flex flex-col items-center text-blue-400 animate-pulse">
              <span className="text-[8px] font-black uppercase tracking-widest text-blue-300">Lua Cheia</span>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]" />
                <h2 className="text-xs font-bold uppercase">Grimvale</h2>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-60">
              <span className="text-[8px] font-bold text-[#c4b08a] uppercase tracking-widest text-center">Lua Cheia em</span>
              <h2 className="text-xs font-bold text-white uppercase">{moon.daysUntilNext} Dias</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const formatTibiaName = (text: string) => {
  return text
    .trim()
    .toLowerCase()
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
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
  const [bazaarMetadata, setBazaarMetadata] = useState<BazaarResponse['metadata']>({ total: 0, page: 1, totalPages: 1, hasMore: false });
  const [viewMode, setViewMode] = useState<'search' | 'news' | 'bazaar'>('search');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'level_desc' | 'level_asc'>('price_desc');
  const [pageInput, setPageInput] = useState('');
  const [bazaarFilters, setBazaarFilters] = useState({
    vocation: '', world: '', minLevel: '', maxLevel: '', nickname: ''
  });
  const [activeFilters, setActiveFilters] = useState({
    vocation: '', world: '', minLevel: '', maxLevel: '', nickname: ''
  });

  async function fetchHistory() {
    try {
      const { data, error } = await supabase.from('search_history').select('*').order('created_at', { ascending: false }).limit(5);
      if (error) throw error;
      setHistory((data as SearchHistory[]) || []);
    } catch (error) { console.error(error); }
  }

  async function loadFavorites(uid: string) {
    try {
      const data = await getFavorites(uid);
      setFavorites(data || []);
    } catch (error) { console.error(error); }
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

  const handleShowBazaar = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    const formattedWorld = activeFilters.world.trim()
      ? activeFilters.world.charAt(0).toUpperCase() + activeFilters.world.slice(1).toLowerCase()
      : undefined;

    try {
      const result = await getTibiaBazaar({
        vocation: activeFilters.vocation || undefined,
        world: formattedWorld,
        name: activeFilters.nickname.trim() || undefined,
        minLevel: activeFilters.minLevel ? parseInt(activeFilters.minLevel) : undefined,
        maxLevel: activeFilters.maxLevel ? parseInt(activeFilters.maxLevel) : undefined,
        sort: sortBy
      }, page);

      setBazaar(result.characters);
      setBazaarMetadata(result.metadata);
      setPageInput(result.metadata.page.toString());
      setViewMode('bazaar');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Erro na busca global:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters, sortBy]);

  useEffect(() => {
    if (viewMode === 'bazaar') {
      handleShowBazaar(1);
    }
  }, [sortBy, activeFilters, viewMode]);

  const applyBazaarFilters = () => {
    setActiveFilters(bazaarFilters);
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  async function handleSearch(e: React.FormEvent | string) {
    if (typeof e !== 'string') e.preventDefault();
    const rawName = typeof e === 'string' ? e : charName;
    if (!rawName.trim()) return;

    const nameToSearch = formatTibiaName(rawName);
    setViewMode('search');
    setIsLoading(true);
    try {
      const apiData = await getCharacterData(nameToSearch);
      if (userId) {
        await supabase.from('search_history').insert([{ query: nameToSearch, user_id: userId, status: apiData ? 'success' : 'not_found' }]);
      }
      setSearchResult(apiData);
      setCharName('');
      fetchHistory();
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  }

  async function handleShowNews() {
    setViewMode('news');
    setIsLoading(true);
    try {
      const data = await getTibiaNews();
      setNews(data);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  }

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    let targetPage = parseInt(pageInput);
    if (isNaN(targetPage) || targetPage < 1) {
      targetPage = 1;
    } else if (targetPage > bazaarMetadata.totalPages) {
      targetPage = bazaarMetadata.totalPages;
    }
    setPageInput(targetPage.toString());
    handleShowBazaar(targetPage);
  };

  const handleToggleFavorite = async (name: string) => {
    if (!userId) return;
    const isFav = favorites.some((f) => f.char_name.toLowerCase() === name.toLowerCase());
    if (isFav) {
      await removeFavorite(userId, name);
      setFavorites((prev) => prev.filter((f) => f.char_name.toLowerCase() !== name.toLowerCase()));
    } else {
      await addFavorite(userId, name);
      setFavorites((prev) => [...prev, { char_name: name }]);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#f5e6c8] space-y-8 p-6 lg:p-10 px-8 lg:px-12 relative overflow-x-hidden font-sans">
      <div className="fixed inset-0 bg-[url('/wallpaper2.jpg')] bg-fixed bg-cover bg-center -z-20 scale-100 opacity-80" />
      <div className="fixed inset-0 bg-black/30 -z-10" />

      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-6 pr-6 relative">
        <RashidTracker />
        
        <div className="absolute left-1/2 -translate-x-1/2 top-0 hidden lg:block">
          <EventHeader />
        </div>

        <GlassButton variant="secondary" onClick={handleLogout}>Sair</GlassButton>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 px-2">
        <div className="lg:hidden w-full mb-4">
           <EventHeader />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassButton variant="secondary" onClick={handleShowNews} disabled={isLoading}>
            <div className="flex items-center gap-3"><Newspaper className="h-5 w-5 text-[#d4af37]" /><span>News</span></div>
          </GlassButton>
          <GlassButton variant="secondary" onClick={() => setViewMode('search')}>
            <div className="flex items-center gap-3"><Users className="h-5 w-5 text-[#d4af37]" /><span>Characters</span></div>
          </GlassButton>
          <GlassButton variant="secondary" onClick={() => { setViewMode('bazaar'); applyBazaarFilters(); }} disabled={isLoading}>
            <div className="flex items-center gap-3"><Gavel className="h-5 w-5 text-[#d4af37]" /><span>Bazaar</span></div>
          </GlassButton>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-black/40 rounded-xl border border-[#d4af37]/20 animate-in fade-in duration-300">
            <div className="relative mb-4">
              <div className="h-12 w-12 border-2 border-[#d4af37]/10 border-t-[#d4af37] rounded-full animate-spin"></div>
              <ScrollText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#d4af37]/50 h-5 w-5 animate-pulse" />
            </div>
            <p className="font-medieval text-[#d4af37] tracking-[0.3em] uppercase text-[9px] animate-pulse text-center">Consultando os Arquivos Reais...</p>
          </div>
        ) : (
          <>
            {viewMode === 'news' && (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <h3 className="font-medieval text-[#d4af37] tracking-widest uppercase text-xs px-1">Últimos Relatos Oficiais</h3>
                <div className="grid gap-4">
                  {news.map((item, idx) => (
                    <Card key={idx} className="bg-black/60 border-[#d4af37]/30 backdrop-blur-md">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] text-[#d4af37] font-bold">{item.date}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-[#d4af37]/10 text-[#d4af37] uppercase border border-[#d4af37]/20">{item.type}</span>
                        </div>
                        <h4 className="text-white font-bold text-sm leading-tight mb-2">{item.news}</h4>
                        <a href={item.url} target="_blank" rel="noreferrer" className="text-[9px] text-[#c4b08a] flex items-center gap-1 hover:text-white underline">VER NO SITE <ExternalLink size={9} /></a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'bazaar' && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="bg-black/60 border border-[#d4af37]/30 rounded-xl p-6 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medieval text-[#d4af37] tracking-widest uppercase text-sm flex items-center gap-2"><Filter size={16} /> Filtros de Leilão</h3>
                    <button onClick={() => setShowFilters(!showFilters)} className="text-[10px] text-[#c4b08a] underline uppercase">{showFilters ? 'Recolher' : 'Expandir Filtros'}</button>
                  </div>
                  
                  <div className={`space-y-4 transition-all ${showFilters ? 'opacity-100 block' : 'hidden'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase text-[#d4af37]/70 font-bold">Nickname (Busca Global)</label>
                        <Input placeholder="Ex: Lord Paulistinha" value={bazaarFilters.nickname} onChange={(e) => setBazaarFilters({ ...bazaarFilters, nickname: e.target.value })} className="h-9 bg-black/40 border-[#d4af37]/20 text-xs text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase text-[#d4af37]/70 font-bold">Vocação</label>
                        <select value={bazaarFilters.vocation} onChange={(e) => setBazaarFilters({ ...bazaarFilters, vocation: e.target.value })} className="w-full bg-black/80 border border-[#d4af37]/20 rounded p-2 text-xs text-white outline-none h-9">
                          <option value="">Todas</option>
                          <option value="Knight">Knight</option>
                          <option value="Paladin">Paladin</option>
                          <option value="Sorcerer">Sorcerer</option>
                          <option value="Druid">Druid</option>
                          <option value="Monk">Monk</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase text-[#d4af37]/70 font-bold">Mundo</label>
                        <Input placeholder="Ex: Antica" value={bazaarFilters.world} onChange={(e) => setBazaarFilters({ ...bazaarFilters, world: e.target.value })} className="h-9 bg-black/40 border-[#d4af37]/20 text-xs text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase text-[#d4af37]/70 font-bold">Level Mín</label>
                          <Input type="number" placeholder="Min" value={bazaarFilters.minLevel} onChange={(e) => setBazaarFilters({ ...bazaarFilters, minLevel: e.target.value })} className="h-9 bg-black/40 border-[#d4af37]/20 text-xs text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase text-[#d4af37]/70 font-bold">Level Máx</label>
                          <Input type="number" placeholder="Max" value={bazaarFilters.maxLevel} onChange={(e) => setBazaarFilters({ ...bazaarFilters, maxLevel: e.target.value })} className="h-9 bg-black/40 border-[#d4af37]/20 text-xs text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <GlassButton variant="primary" className="w-full mt-6 py-2 h-auto text-xs" onClick={applyBazaarFilters}>BUSCAR NO MERCADO</GlassButton>
                </div>

                <div className="flex justify-end">
                  <div className="flex items-center gap-2 bg-black border border-[#d4af37]/40 rounded px-2 h-9 shadow-inner shadow-[#d4af37]/10">
                    <ArrowUpDown size={14} className="text-[#d4af37]" />
                    <select value={sortBy} onChange={(e: any) => setSortBy(e.target.value)} className="bg-black text-[10px] text-white outline-none cursor-pointer uppercase font-black tracking-widest">
                      <option value="price_desc">Maior Preço</option>
                      <option value="price_asc">Menor Preço</option>
                      <option value="level_desc">Maior Level</option>
                      <option value="level_asc">Menor Level</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4">
                  {bazaar.length > 0 ? (
                    bazaar.map((item, idx) => (
                      <a 
                        key={idx} 
                        href={`https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&filter_charactername=${encodeURIComponent(item.name)}&filter_world=&filter_vocation=0&filter_pvp_type=0&filter_battleye_state=0&filter_skillid=0&filter_order_column=10&filter_order_direction=1&searchall=1`}
                        target="_blank"
                        rel="noreferrer"
                        className="block no-underline"
                      >
                        <Card className="bg-black/80 border-[#d4af37]/30 backdrop-blur-md hover:border-[#d4af37]/80 transition-all duration-300 group overflow-hidden shadow-lg cursor-pointer">
                          <CardContent className="p-0 flex flex-col md:flex-row">
                            <div className="p-4 flex items-center gap-5 flex-1">
                              <div className="relative bg-gradient-to-b from-[#d4af37]/20 to-transparent p-1.5 rounded-lg border border-[#d4af37]/20">
                                <div className="bg-black/40 rounded-md p-1">
                                  <img src={item.outfit_url || '/placeholder_outfit.png'} alt="" className="h-20 w-20 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" />
                                </div>
                                <div className="absolute -top-2 -left-2 bg-[#d4af37] text-black text-[11px] px-2 py-0.5 font-bold rounded border border-black/20 shadow-md">LV {item.level}</div>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-bold text-lg group-hover:text-[#d4af37] transition-colors flex items-center gap-2">
                                  {item.name}
                                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4af37]" />
                                </h4>
                                <p className="text-[12px] text-[#c4b08a]/80 font-semibold tracking-wide uppercase">{item.vocation} <span className="mx-1 opacity-40">•</span> {item.world}</p>
                                <div className="flex gap-2 mt-4 flex-wrap">
                                  {item.skills.map((skill: string, sIdx: number) => {
                                    const value = skill.match(/\d+/)?.[0] || "";
                                    let name = skill.replace(/\d+/, "").split("(")[0].trim().substring(0, 3).toUpperCase();
                                    if (name === "MAG") name = "ML";
                                    return (
                                      <div key={sIdx} className="bg-black/40 px-2.5 py-1.5 rounded border border-[#d4af37]/20 flex flex-col items-center min-w-[42px]">
                                        <span className="text-[8px] uppercase text-[#c4b08a] opacity-70 font-black">{name}</span>
                                        <span className="text-[12px] font-bold text-white mt-0.5">{value}</span>
                                      </div>
                                    );
                                  })}
                                  {item.extras?.length > 0 && (
                                    <div className="bg-blue-500/10 px-2.5 py-1.5 rounded border border-blue-500/30 flex items-center gap-1.5 cursor-help" title={item.extras.join('\n')}>
                                      <Star size={12} className="text-blue-400" />
                                      <span className="text-[11px] font-bold text-blue-400">Extras</span>
                                    </div>
                                  )}
                                  {item.items?.length > 0 && (
                                    <div className="bg-[#d4af37]/10 px-2.5 py-1.5 rounded border border-[#d4af37]/30 flex items-center gap-1.5">
                                      <Package size={12} className="text-[#d4af37]" />
                                      <span className="text-[11px] font-bold text-[#d4af37]">{item.items.length}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="bg-[#d4af37]/5 p-5 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-[#d4af37]/10 min-w-[180px]">
                              <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-[#d4af37]/70 font-black mb-1">Lance Atual</p>
                                <div className="flex items-center gap-2 text-[#d4af37] font-black text-2xl"><Coins size={20} /> {(item.price || 0).toLocaleString()}</div>
                              </div>
                              <div className="text-[11px] text-[#c4b08a] flex items-center gap-2 font-semibold bg-black/30 px-3 py-1 rounded-full border border-[#d4af37]/10">
                                <Clock size={13} className="text-[#d4af37]" /> {item.auction_end_relative}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    )
                  )) : (
                    <div className="text-center py-20 bg-black/20 rounded-xl border border-dashed border-[#d4af37]/20">
                      <p className="opacity-50 italic text-base text-[#c4b08a]">Nenhum leilão encontrado com esses filtros.</p>
                    </div>
                  )}
                </div>

                {bazaarMetadata.totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4 pt-8">
                    <div className="flex items-center justify-center gap-3">
                      <GlassButton variant="secondary" onClick={() => handleShowBazaar(bazaarMetadata.page - 1)} disabled={bazaarMetadata.page === 1 || isLoading} className="px-3 h-10">
                        <ChevronLeft size={18} />
                      </GlassButton>
                      <form 
                        onSubmit={handlePageJump} 
                        className={`flex items-center gap-2 bg-black/60 border ${parseInt(pageInput) > bazaarMetadata.totalPages ? 'border-red-500/50' : 'border-[#d4af37]/30'} rounded-lg px-3 h-10 backdrop-blur-md transition-colors`}
                      >
                        <span className="text-[10px] font-medieval uppercase text-[#d4af37]/60">Pág.</span>
                        <input 
                          type="number" 
                          value={pageInput} 
                          onChange={(e) => setPageInput(e.target.value)}
                          className="w-12 bg-transparent text-center text-sm font-bold text-white outline-none border-b border-[#d4af37]/30 focus:border-[#d4af37] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="1"
                          max={bazaarMetadata.totalPages}
                        />
                        <span className="text-[10px] font-medieval uppercase text-[#d4af37]/60">de {bazaarMetadata.totalPages}</span>
                        <button type="submit" disabled={isLoading} className="ml-1 hover:text-[#d4af37] transition-colors group">
                          <Zap size={14} className={`${parseInt(pageInput) > bazaarMetadata.totalPages ? 'text-red-400' : 'text-[#d4af37]/50'} group-hover:text-[#d4af37] transition-colors`} />
                        </button>
                      </form>
                      <GlassButton variant="secondary" onClick={() => handleShowBazaar(bazaarMetadata.page + 1)} disabled={!bazaarMetadata.hasMore || isLoading} className="px-3 h-10">
                        <ChevronRight size={18} />
                      </GlassButton>
                    </div>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'search' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-[#d4af37]/30">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-[#d4af37]/50" />
                    <Input placeholder="Pesquisar personagem..." value={charName} onChange={(e) => setCharName(e.target.value)} className="pl-10 bg-black/60 border-[#d4af37]/20 text-[#f5e6c8]" />
                  </div>
                  <GlassButton variant="primary" type="submit" className="sm:w-44">Pesquisar</GlassButton>
                </form>

                {searchResult && (
                  <a 
                    href={`https://www.tibia.com/community/?subtopic=characters&name=${encodeURIComponent(searchResult.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block no-underline group"
                  >
                    <Card className="bg-black/60 border-[#d4af37]/40 backdrop-blur-md animate-in zoom-in duration-300 hover:border-[#d4af37] transition-all cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between border-b border-[#d4af37]/20 py-4">
                        <CardTitle className="flex items-center gap-2 text-[#d4af37]">
                          <User className="h-5 w-5" /> 
                          {searchResult.name}
                          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleFavorite(searchResult.name);
                          }} 
                          className="p-2 hover:bg-white/5 rounded-full relative z-10"
                        >
                          <Star size={24} className={favorites.some((f) => f.char_name.toLowerCase() === searchResult.name.toLowerCase()) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} />
                        </button>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg border border-white/5">
                            <Swords className="h-4 w-4 mb-1 text-[#d4af37]" />
                            <span className="text-[9px] uppercase opacity-60">Level</span>
                            <span className="text-lg font-bold text-white">{searchResult.level}</span>
                          </div>
                          <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg border border-white/5">
                            <ShieldAlert className="h-4 w-4 mb-1 text-[#d4af37]" />
                            <span className="text-[9px] uppercase opacity-60">Vocation</span>
                            <span className="text-xs font-bold text-white text-center">{searchResult.vocation}</span>
                          </div>
                          <div className="flex flex-col items-center p-3 bg-black/20 rounded-lg border border-white/5">
                            <Globe className="h-4 w-4 mb-1 text-[#d4af37]" />
                            <span className="text-[9px] uppercase opacity-60">World</span>
                            <span className="text-xs font-bold text-white">{searchResult.world}</span>
                          </div>
                        </div>
                        <p className="text-[8px] text-center mt-4 text-[#d4af37]/30 uppercase tracking-[0.3em] font-bold">
                          Clique para ver o perfil completo no Tibia.com
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                )}

                <div className="space-y-4 pt-4">
                  <button onClick={() => setShowFavorites(!showFavorites)} className="flex items-center gap-2 text-[#d4af37] font-medieval tracking-widest text-[10px] uppercase outline-none">
                    <Star size={14} className={showFavorites ? 'fill-yellow-400 text-yellow-400' : ''} /> {showFavorites ? 'Ocultar Favoritos' : 'Ver Favoritos'}
                  </button>
                  {showFavorites && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <FavoritesList favorites={favorites} onRemove={handleToggleFavorite} onSelect={(name) => { handleSearch(name); setShowFavorites(false); }} />
                    </div>
                  )}
                  <Card className="bg-black/40 border-[#d4af37]/20 backdrop-blur-sm">
                    <CardHeader className="border-b border-[#d4af37]/10 py-2 px-4">
                      <CardTitle className="flex items-center gap-2 text-[#d4af37] font-medieval tracking-widest uppercase text-[10px]"><ScrollText className="h-3 w-3" /> Pergaminhos de Consulta</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <table className="w-full text-left text-xs">
                        <tbody>
                          {history.map((item) => (
                            <tr key={item.id} className="border-b border-[#d4af37]/5 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => handleSearch(item.query)}>
                              <td className="p-3 font-bold text-white">{item.query}</td>
                              <td className="p-3 text-right text-[9px]">
                                <span className={`px-2 py-0.5 rounded-full border uppercase ${item.status === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>{item.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MainDashboard;