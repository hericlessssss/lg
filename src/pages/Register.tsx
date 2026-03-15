import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GlassButton } from '../components/v0/glass-button';
import { Input } from '../components/v0/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/v0/ui/card';
import { Mail, Lock } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://tibia-scout.vercel.app/login',
        },
      });

      if (error) throw error;

      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        alert('Este e-mail já está cadastrado. Por favor, faça login.');
        navigate('/login');
        return;
      }

      alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
      navigate('/login');
    } catch (error) {
      const err = error as Error;
      alert(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
      <div
        className="fixed inset-0 bg-[url('/wallpaper.jpg')] bg-fixed bg-cover bg-center -z-20 scale-100 opacity-80"
        aria-hidden="true"
      />
      <div className="fixed inset-0 bg-black/30 -z-10" />

      <Card className="w-full max-w-md bg-black/60 border-[#d4af37]/40 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.1)] mx-auto">
        <CardHeader className="space-y-1 text-center border-b border-[#d4af37]/10 pb-6">
          <CardTitle className="text-4xl font-medieval tracking-widest text-[#d4af37]">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-[#c4b08a]/60 font-serif">
            Junte-se à guilda e comece sua história.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-6 sm:px-10">
          <form onSubmit={handleRegister} className="space-y-5 w-full">
            <div className="space-y-2">
              <div className="relative flex items-center w-full">
                <Mail className="absolute left-3 h-4 w-4 text-[#d4af37]/50 pointer-events-none z-10" />
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-black/40 border-[#d4af37]/20 text-[#f5e6c8] focus:border-[#d4af37] h-11 w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative flex items-center w-full">
                <Lock className="absolute left-3 h-4 w-4 text-[#d4af37]/50 pointer-events-none z-10" />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-black/40 border-[#d4af37]/20 text-[#f5e6c8] focus:border-[#d4af37] h-11 w-full"
                  required
                />
              </div>
            </div>

            <div className="w-full flex justify-center pt-2">
              <GlassButton
                variant="primary"
                type="submit"
                className="w-full h-12 text-lg uppercase tracking-widest font-medieval flex items-center justify-center"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'FORJAR CONTA'}
              </GlassButton>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#c4b08a]/60">Já faz parte da jornada? </span>
            <Link
              to="/login"
              className="text-[#d4af37] hover:underline font-bold"
            >
              Entrar agora
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
