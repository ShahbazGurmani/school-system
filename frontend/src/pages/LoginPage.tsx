import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { login as loginApi } from '@/api/login';
import { useUser } from "@/contexts/UserContext";

const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [cardVisible, setCardVisible] = useState(false);

  React.useEffect(() => {
    setTimeout(() => setCardVisible(true), 100);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginApi(email, password, role || '');
      setUser({ id: data.id, name: data.name, email: data.email, role: role as 'student' | 'teacher' | 'principal' });
      navigate(`/${role}/${data.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 relative overflow-hidden px-2 sm:px-0">
      {/* Logo/Icon */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <div className="bg-white p-2 sm:p-3 rounded-full shadow-lg mb-2">
          <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
        </div>
        <span className="text-xl sm:text-2xl font-bold text-purple-700 tracking-wide drop-shadow">EduManage Pro</span>
      </div>
      {/* Animated Card */}
      <Card className={`w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-700 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} pt-8 pb-4 mx-2 sm:mx-0`}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
            Login as {role?.charAt(0).toUpperCase() + role?.slice(1)}
          </CardTitle>
          <p className="text-muted-foreground text-xs sm:text-sm mb-2">
            Please enter your credentials to access your dashboard.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
            <Input
              type="text"
              placeholder="Email or Username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              className="rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 text-xs sm:text-base"
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 text-xs sm:text-base pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && <div className="text-red-500 text-xs sm:text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full mt-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-md transition-all text-xs sm:text-base">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage; 