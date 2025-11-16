'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { Task, TaskCategory } from '@/lib/types';
import { format } from 'date-fns';

interface TasksPageProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TasksPage({
  tasks,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
}: TasksPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('homework');
  const [reminder, setReminder] = useState('');

  const categories: { value: TaskCategory; label: string; color: string }[] = [
    { value: 'homework', label: 'Homework', color: 'bg-blue-500' },
    { value: 'workout', label: 'Workout', color: 'bg-green-500' },
    { value: 'personal', label: 'Personal', color: 'bg-purple-500' },
    { value: 'study', label: 'Study', color: 'bg-yellow-500' },
    { value: 'other', label: 'Other', color: 'bg-gray-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      completed: false,
      reminder: reminder ? new Date(reminder) : undefined,
      createdAt: new Date(),
    };

    onAddTask(newTask);
    setTitle('');
    setCategory('homework');
    setReminder('');
    setShowModal(false);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Daily Tasks</h1>
        <motion.button
          onClick={() => setShowModal(true)}
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={24} />
        </motion.button>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Active ({activeTasks.length})
        </h2>
        {activeTasks.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-gray-500">No active tasks. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTasks.map((task, index) => {
              const categoryColor = categories.find(c => c.value === task.category)?.color;

              return (
                <motion.div
                  key={task.id}
                  className="glass rounded-2xl p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className="w-6 h-6 mt-1 rounded-full border-2 border-primary flex-shrink-0 hover:bg-primary transition-colors"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`${categoryColor} text-white text-xs px-2 py-1 rounded-full`}
                        >
                          {task.category}
                        </span>
                        {task.reminder && (
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock size={12} />
                            {format(task.reminder, 'MMM d, h:mm a')}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Completed ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            {completedTasks.map((task) => {
              const categoryColor = categories.find(c => c.value === task.category)?.color;

              return (
                <motion.div
                  key={task.id}
                  className="glass rounded-2xl p-4 opacity-60"
                  layout
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 mt-1 rounded-full bg-success border-2 border-success flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 line-through">
                        {task.title}
                      </p>
                      <span
                        className={`${categoryColor} text-white text-xs px-2 py-1 rounded-full inline-block mt-2`}
                      >
                        {task.category}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">New Task</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:outline-none"
                    placeholder="What do you need to do?"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                          category === cat.value
                            ? `${cat.color} text-white shadow-lg scale-105`
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:outline-none"
                  />
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
                    Add Task
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
