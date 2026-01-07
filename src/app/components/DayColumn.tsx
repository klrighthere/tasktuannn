import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { TaskCard } from "./TaskCard";

interface Task {
  id: string;
  title: string;
  dayOfWeek: string;
  completed: boolean;
  createdAt: string;
}

interface DayColumnProps {
  day: string;
  dayLabel: string;
  tasks: Task[];
  onAddTask: (day: string) => void;
  onToggleTask: (id: string, completed: boolean) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export function DayColumn({
  day,
  dayLabel,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: DayColumnProps) {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{dayLabel}</h3>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 border-0"
            onClick={() => onAddTask(day)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-blue-100">
          {totalCount > 0 ? `${completedCount}/${totalCount} hoàn thành` : 'Chưa có task'}
        </div>
      </div>
      
      <div className="flex-1 p-3 space-y-2 min-h-[200px] max-h-[500px] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            Chưa có công việc
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
