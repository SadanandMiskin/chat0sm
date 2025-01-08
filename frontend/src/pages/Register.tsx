import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Register() {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      console.log(err)
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <Card className="w-96 p-6 bg-black/30 backdrop-blur-xl border-white/10">
        <h1 className="text-2xl font-bold text-white mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded">
              {error}
            </div>
          )}
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>
        <p className="mt-4 text-white/70 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}