import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/v0/ui/card';
import { Input } from '../components/v0/ui/input';
import { Button } from '../components/v0/ui/button';
import { Label } from '../components/v0/ui/label';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Sucesso! Verifique seu e-mail.');
    setLoading(false);
  };
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
          <CardDescription>
            Cadastre-se para começar a trackear.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Registrar'}
          </Button>
          <p className="text-sm text-center">
            Já tem conta?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Faça login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
