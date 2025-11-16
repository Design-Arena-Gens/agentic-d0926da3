'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Flame, Trophy } from 'lucide-react';
import { Task, Habit, Goal } from '@/lib/types';
import { format, isToday } from 'date-fns';

interface HomePageProps {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  onCompleteTask: (taskId: string) => void;
  onCompleteHabit: (habitId: string) => void;
}

export default function HomePage({
  tasks,
  habits,
  goals,
  onCompleteTask,
  onCompleteHabit,
}: HomePageProps) {
  const todayTasks = tasks.filter(t => !t.completed);
  const completedToday = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0;

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const activeGoals = goals.length;

  const categoryColors: Record<string, string> = {
    homework: 'bg-blue-500',
    workout: 'bg-green-500',
    personal: 'bg-purple-500',
    study: 'bg-yellow-500',
    other: 'bg-gray-500',
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, Hero! 🎯
        </h1>
        <p className="text-gray-600">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div
          className="glass rounded-2xl p-4 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="text-primary" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{completedToday}</p>
          <p className="text-xs text-gray-600">Done Today</p>
        </motion.div>

        <motion.div
          className="glass rounded-2xl p-4 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Flame className="text-warning" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalStreak}</p>
          <p className="text-xs text-gray-600">Total Streak</p>
        </motion.div>

        <motion.div
          className="glass rounded-2xl p-4 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Trophy className="text-success" size={24} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{activeGoals}</p>
          <p className="text-xs text-gray-600">Active Goals</p>
        </motion.div>
      </div>

      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          Today's Progress
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Tasks Completed</span>
            <span className="font-medium">
              {completedToday}/{totalTasks}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Today's Tasks
        </h2>
        {todayTasks.length === 0 ? (
          <motion.div
            className="glass rounded-2xl p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500">
              No tasks for today! You're all set! 🎉
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task, index) => (
              <motion.div
                key={task.id}
                className="glass rounded-2xl p-4 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => onCompleteTask(task.id)}
                  className="w-6 h-6 rounded-full border-2 border-primary flex-shrink-0 hover:bg-primary transition-colors"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`${
                        categoryColors[task.category]
                      } text-white text-xs px-2 py-0.5 rounded-full`}
                    >
                      {task.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {habits.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Quick Habits
          </h2>
          <div className="space-y-3">
            {habits.slice(0, 3).map((habit, index) => {
              const completedToday =
                habit.lastCompleted && isToday(habit.lastCompleted);

              return (
                <motion.div
                  key={habit.id}
                  className="glass rounded-2xl p-4 flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => !completedToday && onCompleteHabit(habit.id)}
                      className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-colors ${
                        completedToday
                          ? 'bg-success border-success'
                          : 'border-success hover:bg-success'
                      }`}
                    >
                      {completedToday && (
                        <CheckCircle2 size={20} className="text-white" />
                      )}
                    </button>
                    <div>
                      <p className="font-medium text-gray-800">{habit.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Flame size={14} className="text-warning" />
                        <span className="text-xs text-gray-600">
                          {habit.streak} day streak
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
