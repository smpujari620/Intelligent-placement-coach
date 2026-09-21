import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Trophy,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { RoadmapWeek, RoadmapTask } from "../types";

interface RoadmapPlannerProps {
  roadmap: RoadmapWeek[];
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  targetRole: string;
}

export const RoadmapPlanner: React.FC<RoadmapPlannerProps> = ({
  roadmap,
  completedTaskIds,
  onToggleTask,
  targetRole,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | "all">("all");
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  // Calculate overall progress
  const allTasks: RoadmapTask[] = [];
  roadmap.forEach((week) => {
    week.days?.forEach((day) => {
      day.tasks?.forEach((task) => allTasks.push(task));
    });
  });

  const totalTasks = allTasks.length;
  const completedCount = allTasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const toggleDayExpanded = (dayNum: number) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const handleTaskCheck = (taskId: string) => {
    const isNowCompleted = !completedTaskIds.includes(taskId);
    onToggleTask(taskId);

    if (isNowCompleted) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.8 },
      });
    }
  };

  const filteredWeeks =
    selectedWeek === "all" ? roadmap : roadmap.filter((w) => w.week === selectedWeek);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Programming":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Technical Skills":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
      case "Aptitude":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Mock Interview":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "Domain Knowledge":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-700/60 text-slate-300 border-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Dynamic Progress Banner */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Calendar className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Personalized Preparation Roadmap
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Day-wise and week-wise roadmap structured to bridge your actual skill gaps for{" "}
              <strong className="text-indigo-300">{targetRole}</strong>. Mark tasks as completed to
              track your live preparation progress.
            </p>
          </div>

          {/* Dynamic Progress Indicator */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Preparation Progress</span>
              <span className="font-mono font-bold text-indigo-400">{progressPercent}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{completedCount} of {totalTasks} tasks finished</span>
              {progressPercent === 100 && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> All Done!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Week Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Filter by Week:</span>
          <button
            onClick={() => setSelectedWeek("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              selectedWeek === "all"
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            All 4 Weeks
          </button>
          {roadmap.map((week) => (
            <button
              key={week.week}
              onClick={() => setSelectedWeek(week.week)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                selectedWeek === week.week
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              Week {week.week}
            </button>
          ))}
        </div>
      </div>

      {/* Weeks & Days Timeline */}
      <div className="space-y-6">
        {filteredWeeks.map((week) => (
          <div
            key={week.week}
            className="bg-slate-800/60 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Week Header */}
            <div className="p-5 bg-slate-900/60 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                    Week {week.week}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">{week.title}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  <strong className="text-slate-300">Target Focus:</strong> {week.focus}
                </p>
              </div>

              <div className="text-xs font-mono text-slate-400">
                {week.days?.reduce(
                  (acc, d) =>
                    acc + d.tasks.filter((t) => completedTaskIds.includes(t.id)).length,
                  0
                )}{" "}
                / {week.days?.reduce((acc, d) => acc + d.tasks.length, 0)} Tasks Done
              </div>
            </div>

            {/* Days in Week */}
            <div className="p-5 space-y-4">
              {week.days?.map((day) => {
                const isExpanded = expandedDays[day.day] ?? true;
                const dayTasksCompleted = day.tasks.filter((t) =>
                  completedTaskIds.includes(t.id)
                ).length;
                const isDayComplete =
                  day.tasks.length > 0 && dayTasksCompleted === day.tasks.length;

                return (
                  <div
                    key={day.day}
                    className={`rounded-xl border transition-all ${
                      isDayComplete
                        ? "bg-emerald-950/20 border-emerald-500/30"
                        : "bg-slate-900/50 border-slate-700/60"
                    }`}
                  >
                    {/* Day Header */}
                    <div
                      onClick={() => toggleDayExpanded(day.day)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 rounded-xl transition-colors select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                            isDayComplete
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {isDayComplete ? <Check className="w-4 h-4" /> : `D${day.day}`}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{day.title}</h4>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getCategoryColor(
                                day.category
                              )}`}
                            >
                              {day.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-400">
                          {dayTasksCompleted} / {day.tasks.length}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Day Task Items */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 space-y-2 border-t border-slate-800/60">
                        {day.tasks.map((task) => {
                          const isDone = completedTaskIds.includes(task.id);
                          return (
                            <div
                              key={task.id}
                              onClick={() => handleTaskCheck(task.id)}
                              className={`p-3 rounded-lg border flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${
                                isDone
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-slate-300"
                                  : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 text-slate-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                                )}
                                <span
                                  className={`text-xs ${
                                    isDone ? "line-through text-slate-400 font-normal" : "font-medium"
                                  }`}
                                >
                                  {task.task}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 shrink-0">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{task.duration}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
