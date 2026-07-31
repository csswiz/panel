import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Zap, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
        <Zap className="w-8 h-8 fill-current" />
      </div>
      <h1 className="text-6xl font-black text-gradient">404</h1>
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-md">
        The route or dashboard resource you are trying to access does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="gradient" className="gap-2 font-bold">
          <Home className="w-4 h-4" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
