import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { verifyAdminCredentials } from '../../utils/security';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim() || !password) return;

    setIsLoading(true);
    try {
      const isAdminUser = await verifyAdminCredentials(identifier, password);
      const roleType = isAdminUser ? 'Admin' : 'User';

      login(identifier, password, roleType);
      addToast(
        isAdminUser 
          ? 'Successfully authenticated as Administrator!' 
          : `Welcome back! Signed in successfully.`, 
        'success'
      );
      navigate(isAdminUser ? '/admin' : '/dashboard');
    } catch (err) {
      addToast('Error processing login. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Sign in to your Wizard SMM dashboard to manage orders, funds, and API keys.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Username or Email Address"
          type="text"
          icon={Mail}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter username or email"
          required
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
            <Link to="/auth/forgot-password" className="text-xs text-indigo-400 hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <Button
          type="submit"
          variant="gradient"
          isLoading={isLoading}
          className="w-full justify-center py-3 text-sm font-bold gap-2"
        >
          Sign In To Dashboard <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/auth/register" className="font-bold text-indigo-400 hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
};

