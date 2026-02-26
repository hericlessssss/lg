import { useState, useEffect } from 'react';
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
  Clock,
  ScrollText,
} from 'lucide-react';

// Interface para evitar o erro de "any" do ESLint
interface SearchHistory {
  id: string;
  query: string;
  status: string;
  created_at: string;
  user_id: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [charName, setCharName] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);

  // Função para buscar o histórico no Supabase
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
      console.error('Erro ao buscar histórico:', error);
    }
  }

  // Carrega o histórico ao montar o componente
  useEffect(() => {
    fetchHistory();
  }, []);

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
      alert('Erro ao deslogar. Tente novamente.');
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const nameToSearch = charName.trim();

    if (!nameToSearch) {
      alert('Por favor, digite o nome de um personagem.');
      setSearchResult(null);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        return;
      }

      const { error } = await supabase.from('search_history').insert([
        {
          query: nameToSearch,
          user_id: user.id,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      setSearchResult(nameToSearch);
      setCharName(''); // Limpa o input
      fetchHistory(); // Atualiza a lista instantaneamente
      console.log('Busca salva no histórico com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar busca:', error);
      alert('Ocorreu um erro ao salvar sua pesquisa no banco de dados.');
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5e6c8] space-y-8 p-6 lg:p-10 bg-[url('/wallpaper.jpg')] bg-fixed bg-cover bg-center">
      <div className="fixed inset-0 bg-black/80 -z-10" />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-6">
        <div>
          <h2 className="font-medieval text-4xl tracking-wide text-[#d4af37]">
            Dashboard
          </h2>
          <p className="text-sm text-[#c4b08a]/60">Bem-vindo, explorador.</p>
        </div>
        <div className="w-32">
          <GlassButton variant="secondary" onClick={handleLogout}>
            Sair
          </GlassButton>
        </div>
      </div>

      {/* Formulário de Busca */}
      <section className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d4af37]/50" />
            <Input
              placeholder="Ex: Eternal Oblivion..."
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
              className="pl-10 bg-black/60 border-[#d4af37]/20 text-[#f5e6c8] focus:border-[#d4af37] transition-colors"
            />
          </div>
          <div className="sm:w-40">
            <GlassButton variant="primary" type="submit">
              Pesquisar
            </GlassButton>
          </div>
        </form>
      </section>

      {/* Exibição do Resultado Atual */}
      {searchResult && (
        <div className="animate-fade-in-up">
          <Card className="max-w-2xl mx-auto bg-black/60 border-[#d4af37]/40 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-[#d4af37]/10 border-b border-[#d4af37]/20">
              <CardTitle className="flex items-center gap-2 text-[#d4af37]">
                <User className="h-5 w-5" />
                Resultado da Busca
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <p className="text-xl mb-2">Informações de:</p>
              <h3 className="text-4xl font-medieval text-white mb-4 uppercase tracking-widest">
                {searchResult}
              </h3>
              <div className="flex justify-center gap-6 text-[#c4b08a]">
                <div className="flex items-center gap-1">
                  <Swords className="h-4 w-4" /> Level: ??
                </div>
                <div className="flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" /> Vocation: ??
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Buscas Realizadas',
            value: history.length.toString(),
            color: 'text-[#d4af37]',
          },
          { title: 'Alertas Ativos', value: '3', color: 'text-red-500' },
          { title: 'Status do Banco', value: 'Online', color: 'text-blue-400' },
        ].map((item, i) => (
          <Card
            key={i}
            className="bg-black/40 border-[#d4af37]/20 backdrop-blur-sm border"
          >
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-tighter text-[#c4b08a]/70">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TABELA DE HISTÓRICO */}
      <Card className="bg-black/40 border-[#d4af37]/20 backdrop-blur-sm border">
        <CardHeader className="border-b border-[#d4af37]/10">
          <CardTitle className="flex items-center gap-2 text-[#d4af37] font-medieval tracking-widest">
            <ScrollText className="h-5 w-5" />
            Últimas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d4af37]/10 bg-[#d4af37]/5 text-[#c4b08a] text-xs uppercase">
                  <th className="p-4">Personagem</th>
                  <th className="p-4">Data/Hora</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#d4af37]/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-bold text-white">{item.query}</td>
                      <td className="p-4 text-sm text-[#c4b08a]/60 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(item.created_at).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-4 text-right">
                        <span className="px-2 py-1 rounded-full text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-tighter">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-10 text-center text-[#c4b08a]/40 italic"
                    >
                      Nenhum histórico de busca encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
