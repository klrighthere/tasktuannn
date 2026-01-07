import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Trash2, Pencil } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dayOfWeek: string;
  completed: boolean;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  return (
    <div className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
        id={`task-${task.id}`}
      />
      <label
        htmlFor={`task-${task.id}`}
        className={`flex-1 cursor-pointer text-sm ${
          task.completed ? 'line-through text-gray-400' : 'text-gray-700'
        }`}
      >
        {task.title}
      </label>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-4 w-4 text-blue-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
}
