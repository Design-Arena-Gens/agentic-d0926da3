'use client';

import { Home, CheckSquare, Target, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentPage: 'home' | 'tasks' | 'habits' | 'goals' | 'profile';
  onNavigate: (page: 'home' | 'tasks' | 'habits' | 'goals' | 'profile') => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'tasks' as const, icon: CheckSquare, label: 'Tasks' },
    { id: 'habits' as const, icon: Target, label: 'Habits' },
    { id: 'goals' as const, icon: Target, label: 'Goals' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-gray-200 pb-safe">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center gap-1 relative"
                whileTap={{ scale: 0.9 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"
                  />
                )}
                <Icon
                  size={24}
                  className={isActive ? 'text-primary' : 'text-gray-400'}
                />
                <span
                  className={`text-xs ${
                    isActive ? 'text-primary font-medium' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
