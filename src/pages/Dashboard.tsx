import { useState } from 'react';
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
import { Search, User, Swords, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [charName, setCharName] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);

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

  // Função de busca atualizada para salvar no banco de dados (Supabase)
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const nameToSearch = charName.trim();

    // 1. Validação: Não aceita campo vazio
    if (!nameToSearch) {
      alert('Por favor, digite o nome de um personagem.');
      setSearchResult(null);
      return;
    }

    try {
      // 2. Obtém o usuário logado para garantir o user_id correto (RLS)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        return;
      }

      // 3. Insere a busca na tabela search_history
      const { error } = await supabase.from('search_history').insert([
        {
          query: nameToSearch,
          user_id: user.id, // O RLS valida se este ID é o do usuário atual
          status: 'pending',
        },
      ]);

      if (error) throw error;

      // 4. Sucesso: Atualiza o estado visual
      setSearchResult(nameToSearch);
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

      {/* Exibição do Resultado */}
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
            title: 'Personagens Monitorados',
            value: '12',
            color: 'text-[#d4af37]',
          },
          { title: 'Alertas Ativos', value: '3', color: 'text-red-500' },
          {
            title: 'Última Verificação',
            value: 'Há 2 min',
            color: 'text-blue-400',
          },
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
    </div>
  );
}
