import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sparkles, BookOpen, BarChart3, Calendar, Palette, GraduationCap, Folder } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '投掷骰子', icon: Sparkles },
    { path: '/daily', label: '每日一骰', icon: Calendar },
    { path: '/dice-sets', label: '骰子套装', icon: Palette },
    { path: '/knowledge', label: '知识库', icon: GraduationCap },
    { path: '/records', label: '历史记录', icon: BookOpen },
    { path: '/collections', label: '记录合集', icon: Folder },
    { path: '/analytics', label: '统计分析', icon: BarChart3 },
  ];

  return (
    <nav className="relative z-10 backdrop-blur-md bg-indigo-950/30 border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-amber-400 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-xl">✨</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
              占星骰子
            </h1>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300
                    ${isActive
                      ? 'bg-violet-600/40 text-white shadow-lg shadow-violet-500/20'
                      : 'text-indigo-200/70 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-violet-400 to-amber-400 rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
