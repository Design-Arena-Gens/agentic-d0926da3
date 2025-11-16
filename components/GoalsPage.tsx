'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Target, CheckCircle2, Circle } from 'lucide-react';
import { Goal, Milestone } from '@/lib/types';

interface GoalsPageProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export default function GoalsPage({
  goals,
  onAddGoal,
  onToggleMilestone,
  onDeleteGoal,
}: GoalsPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [milestones, setMilestones] = useState<string[]>(['', '', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const filteredMilestones = milestones
      .filter((m) => m.trim())
      .map((m) => ({
        id: Date.now().toString() + Math.random(),
        title: m.trim(),
        completed: false,
      }));

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      milestones: filteredMilestones,
      progress: 0,
      createdAt: new Date(),
    };

    onAddGoal(newGoal);
    setTitle('');
    setDescription('');
    setMilestones(['', '', '']);
    setShowModal(false);
  };

  const updateMilestone = (index: number, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = value;
    setMilestones(newMilestones);
  };

  const addMilestoneField = () => {
    setMilestones([...milestones, '']);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Goals</h1>
        <motion.button
          onClick={() => setShowModal(true)}
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={24} />
        </motion.button>
      </div>

      {goals.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-gray-500">
            No goals yet. Set a goal to start your journey!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const completedCount = goal.milestones.filter((m) => m.completed).length;
            const totalCount = goal.milestones.length;
            const progressPercent =
              totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            return (
              <motion.div
                key={goal.id}
                className="glass rounded-2xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {goal.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span className="font-medium">
                      {completedCount}/{totalCount} milestones
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-success to-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {goal.milestones.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Milestones
                    </p>
                    {goal.milestones.map((milestone) => (
                      <motion.button
                        key={milestone.id}
                        onClick={() => onToggleMilestone(goal.id, milestone.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {milestone.completed ? (
                          <CheckCircle2
                            size={20}
                            className="text-success flex-shrink-0"
                          />
                        ) : (
                          <Circle
                            size={20}
                            className="text-gray-400 flex-shrink-0"
                          />
                        )}
                        <span
                          className={`text-sm ${
                            milestone.completed
                              ? 'text-gray-500 line-through'
                              : 'text-gray-800'
                          }`}
                        >
                          {milestone.title}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {progressPercent === 100 && (
                  <motion.div
                    className="mt-4 bg-success/10 border border-success rounded-xl p-3 text-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <p className="text-success font-medium">
                      🎉 Goal Completed! Amazing work!
                    </p>
                  </motion.div>
                )}
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
              className="glass rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">New Goal</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:outline-none"
                    placeholder="e.g., Get in shape for summer"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:outline-none resize-none"
                    placeholder="What does success look like?"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Milestones
                  </label>
                  <div className="space-y-2">
                    {milestones.map((milestone, index) => (
                      <input
                        key={index}
                        type="text"
                        value={milestone}
                        onChange={(e) => updateMilestone(index, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:outline-none"
                        placeholder={`Milestone ${index + 1}`}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addMilestoneField}
                      className="w-full py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-primary hover:text-primary transition-colors text-sm"
                    >
                      + Add Another Milestone
                    </button>
                  </div>
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
                    Create Goal
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
