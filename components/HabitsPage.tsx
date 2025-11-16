'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Flame, CheckCircle2, Calendar } from 'lucide-react';
import { Habit } from '@/lib/types';
import { isToday, format, subDays } from 'date-fns';

interface HabitsPageProps {
  habits: Habit[];
  onAddHabit: (habit: Habit) => void;
  onCompleteHabit: (habitId: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export default function HabitsPage({
  habits,
  onAddHabit,
  onCompleteHabit,
  onDeleteHabit,
}: HabitsPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      title: title.trim(),
      streak: 0,
      completedDates: [],
      createdAt: new Date(),
    };

    onAddHabit(newHabit);
    setTitle('');
    setShowModal(false);
  };

  const getWeekDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      dates.push(subDays(new Date(), i));
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const isDateCompleted = (habit: Habit, date: Date) => {
    return habit.completedDates.some(
      (d) => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Habits</h1>
        <motion.button
          onClick={() => setShowModal(true)}
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={24} />
        </motion.button>
      </div>

      {habits.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-gray-500">
            No habits yet. Create one to start building streaks!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit, index) => {
            const completedToday = habit.lastCompleted && isToday(habit.lastCompleted);

            return (
              <motion.div
                key={habit.id}
                className="glass rounded-2xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => !completedToday && onCompleteHabit(habit.id)}
                      className={`w-8 h-8 mt-0.5 rounded-full border-2 flex-shrink-0 transition-all ${
                        completedToday
                          ? 'bg-success border-success scale-110'
                          : 'border-success hover:bg-success hover:scale-105'
                      }`}
                    >
                      {completedToday && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                        >
                          <CheckCircle2 size={24} className="text-white" />
                        </motion.div>
                      )}
                    </button>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-full">
                          <Flame size={16} className="text-warning" />
                          <span className="text-sm font-bold text-warning">
                            {habit.streak}
                          </span>
                          <span className="text-xs text-gray-600">day streak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Last 7 Days
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((date, idx) => {
                      const completed = isDateCompleted(habit, date);
                      const isCurrentDay = isToday(date);

                      return (
                        <div key={idx} className="text-center">
                          <p className="text-xs text-gray-500 mb-1">
                            {format(date, 'EEE')}
                          </p>
                          <motion.div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              completed
                                ? 'bg-success'
                                : isCurrentDay
                                ? 'border-2 border-primary bg-primary/10'
                                : 'bg-gray-200'
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {completed && (
                              <CheckCircle2 size={20} className="text-white" />
                            )}
                          </motion.div>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(date, 'd')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="glass rounded-3xl p-6 w-full max-w-md"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">New Habit</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What habit do you want to build?
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:outline-none"
                    placeholder="e.g., Drink 8 glasses of water"
                    autoFocus
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Start with simple habits you can do daily.
                    Consistency is key to building streaks!
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                  >
                    Create Habit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
