import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 overflow-x-auto no-scrollbar py-1">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
      >
        <Home className="w-3.5 h-3.5" /> Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-bold text-slate-900 dark:text-white">{formattedName}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
              >
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
