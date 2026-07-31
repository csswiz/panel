import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, ArrowRight } from 'lucide-react';

// Salted SHA-256 hashes for admin credentials ('raghav94' / '098123456')
const ADMIN_USER_HASH = '5983de63de88ca644366890296fe1c25b3b0cc4617b102584e407bc99bfaf306';
const ADMIN_PASS_HASH = 'c0d4da474f57a0a64f84d3002ae73751fc833f93f7b37dee3201aedd5812c5f4';

async function hashValue(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode('wizard_salt_' + str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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
      const userHash = await hashValue(identifier.trim().toLowerCase());
      const passHash = await hashValue(password.trim());

      const isAdminUser = (userHash === ADMIN_USER_HASH && passHash === ADMIN_PASS_HASH);
      const roleType = isAdminUser ? 'Admin' : 'User';

      login(identifier, password, roleType);
      addToast(
        isAdminUser 
          ? 'Successfully logged in as Super Administrator!' 
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

