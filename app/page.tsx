'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import HomePage from '@/components/HomePage';
import TasksPage from '@/components/TasksPage';
import HabitsPage from '@/components/HabitsPage';
import GoalsPage from '@/components/GoalsPage';
import ProfilePage from '@/components/ProfilePage';
import { Task, Habit, Goal } from '@/lib/types';
import {
  getStoredData,
  addTask,
  updateTask,
  deleteTask,
  addHabit,
  updateHabit,
  deleteHabit,
  addGoal,
  updateGoal,
  deleteGoal,
} from '@/lib/storage';
import { requestNotificationPermission, scheduleNotification, showNotification } from '@/lib/notifications';
import { isToday, differenceInDays } from 'date-fns';

type Page = 'home' | 'tasks' | 'habits' | 'goals' | 'profile';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = getStoredData();
    setTasks(data.tasks);
    setHabits(data.habits);
    setGoals(data.goals);

    requestNotificationPermission();
  }, []);

  const handleAddTask = (task: Task) => {
    addTask(task);
    setTasks([...tasks, task]);

    if (task.reminder) {
      scheduleNotification(task.title, task.reminder);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    updateTask(taskId, { completed: true });
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );
    showNotification('Task Completed!', 'Great job! Keep it up! 🎉');
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleAddHabit = (habit: Habit) => {
    addHabit(habit);
    setHabits([...habits, habit]);
  };

  const handleCompleteHabit = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const now = new Date();
    const lastCompleted = habit.lastCompleted;

    let newStreak = habit.streak;
    if (!lastCompleted) {
      newStreak = 1;
    } else if (isToday(lastCompleted)) {
      return;
    } else {
      const daysDiff = differenceInDays(now, lastCompleted);
      newStreak = daysDiff === 1 ? habit.streak + 1 : 1;
    }

    const updatedHabit = {
      ...habit,
      streak: newStreak,
      lastCompleted: now,
      completedDates: [...habit.completedDates, now],
    };

    updateHabit(habitId, updatedHabit);
    setHabits(habits.map((h) => (h.id === habitId ? updatedHabit : h)));

    showNotification(
      'Habit Completed!',
      `${newStreak} day streak! Keep it going! 🔥`
    );
  };

  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId);
    setHabits(habits.filter((h) => h.id !== habitId));
  };

  const handleAddGoal = (goal: Goal) => {
    addGoal(goal);
    setGoals([...goals, goal]);
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progress = (completedCount / updatedMilestones.length) * 100;

    const updatedGoal = {
      ...goal,
      milestones: updatedMilestones,
      progress,
    };

    updateGoal(goalId, updatedGoal);
    setGoals(goals.map((g) => (g.id === goalId ? updatedGoal : g)));

    if (progress === 100) {
      showNotification('Goal Achieved!', `You completed: ${goal.title}! 🏆`);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId);
    setGoals(goals.filter((g) => g.id !== goalId));
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto px-4 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentPage === 'home' && (
              <HomePage
                tasks={tasks}
                habits={habits}
                goals={goals}
                onCompleteTask={handleCompleteTask}
                onCompleteHabit={handleCompleteHabit}
              />
            )}
            {currentPage === 'tasks' && (
              <TasksPage
                tasks={tasks}
                onAddTask={handleAddTask}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
            {currentPage === 'habits' && (
              <HabitsPage
                habits={habits}
                onAddHabit={handleAddHabit}
                onCompleteHabit={handleCompleteHabit}
                onDeleteHabit={handleDeleteHabit}
              />
            )}
            {currentPage === 'goals' && (
              <GoalsPage
                goals={goals}
                onAddGoal={handleAddGoal}
                onToggleMilestone={handleToggleMilestone}
                onDeleteGoal={handleDeleteGoal}
              />
            )}
            {currentPage === 'profile' && (
              <ProfilePage tasks={tasks} habits={habits} goals={goals} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}
