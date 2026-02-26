import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/v0/ui/card';
import { Button } from '../components/v0/ui/button'; // Usando o caminho que você já tinha
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Redireciona para a página inicial (HeroSection)
      navigate('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
      alert('Erro ao deslogar. Tente novamente.');
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button variant="destructive" onClick={handleLogout}>
          Sair
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Personagens Monitorados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Alertas Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Última Verificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Há 2 min</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
