'use client';

import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Flame, CheckCircle2, Target, Award } from 'lucide-react';
import { Task, Habit, Goal } from '@/lib/types';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

interface ProfilePageProps {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
}

export default function ProfilePage({ tasks, habits, goals }: ProfilePageProps) {
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const longestStreak = Math.max(...habits.map((h) => h.streak), 0);

  const completedGoals = goals.filter(
    (g) => g.milestones.every((m) => m.completed)
  ).length;
  const totalGoals = goals.length;

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const tasksThisWeek = tasks.filter((t) =>
    isWithinInterval(t.createdAt, { start: weekStart, end: weekEnd })
  ).length;

  const habitsCompletedThisWeek = habits.reduce((sum, habit) => {
    const completedInWeek = habit.completedDates.filter((date) =>
      isWithinInterval(date, { start: weekStart, end: weekEnd })
    ).length;
    return sum + completedInWeek;
  }, 0);

  const stats = [
    {
      label: 'Tasks Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
    },
    {
      label: 'Total Streak',
      value: totalStreak,
      icon: Flame,
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
    },
    {
      label: 'Goals Achieved',
      value: completedGoals,
      icon: Target,
      color: 'bg-green-500',
      textColor: 'text-green-500',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
    },
  ];

  const achievements = [
    {
      title: 'First Steps',
      description: 'Complete your first task',
      unlocked: completedTasks > 0,
      icon: '🎯',
    },
    {
      title: 'Habit Builder',
      description: 'Create 3 habits',
      unlocked: habits.length >= 3,
      icon: '💪',
    },
    {
      title: 'Week Warrior',
      description: 'Complete 10 tasks in a week',
      unlocked: tasksThisWeek >= 10,
      icon: '⚔️',
    },
    {
      title: 'Streak Master',
      description: 'Reach a 7-day streak',
      unlocked: longestStreak >= 7,
      icon: '🔥',
    },
    {
      title: 'Goal Getter',
      description: 'Complete your first goal',
      unlocked: completedGoals > 0,
      icon: '🏆',
    },
    {
      title: 'Consistency King',
      description: 'Complete 5 habits in a week',
      unlocked: habitsCompletedThisWeek >= 5,
      icon: '👑',
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center">
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Trophy size={48} className="text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800">Your Progress</h1>
        <p className="text-gray-600 mt-1">Keep up the amazing work!</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Overall Stats
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="glass rounded-2xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center mb-3`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          This Week's Activity
        </h2>
        <div className="glass rounded-2xl p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tasks Created</p>
                  <p className="text-xl font-bold text-gray-800">
                    {tasksThisWeek}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                  <Flame size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Habits Completed</p>
                  <p className="text-xl font-bold text-gray-800">
                    {habitsCompletedThisWeek}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Achievements</h2>
          <span className="text-sm text-gray-600">
            {unlockedCount}/{achievements.length} unlocked
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              className={`rounded-2xl p-4 ${
                achievement.unlocked
                  ? 'glass'
                  : 'bg-gray-200 opacity-60'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={achievement.unlocked ? { scale: 1.02 } : {}}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                {achievement.title}
              </h3>
              <p className="text-xs text-gray-600">{achievement.description}</p>
              {achievement.unlocked && (
                <motion.div
                  className="mt-2 flex items-center gap-1 text-xs text-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Award size={12} />
                  <span>Unlocked!</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-600">
          You're doing great! Keep building those habits and crushing your goals! 🌟
        </p>
      </div>
    </div>
  );
}
