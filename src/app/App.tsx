import { useState, useEffect } from "react";
import { DayColumn } from "./components/DayColumn";
import { TaskDialog } from "./components/TaskDialog";
import { Calendar, RefreshCw } from "lucide-react";
import { Button } from "./components/ui/button";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Task {
  id: string;
  title: string;
  dayOfWeek: string;
  completed: boolean;
  createdAt: string;
}

const DAYS = [
  { value: "monday", label: "Thứ Hai" },
  { value: "tuesday", label: "Thứ Ba" },
  { value: "wednesday", label: "Thứ Tư" },
  { value: "thursday", label: "Thứ Năm" },
  { value: "friday", label: "Thứ Sáu" },
  { value: "saturday", label: "Thứ Bảy" },
  { value: "sunday", label: "Chủ Nhật" },
];

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e1ba9efb`;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | undefined>();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks from server
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Không thể tải danh sách task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create or update task
  const handleSaveTask = async (title: string, dayOfWeek: string) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await fetch(`${API_BASE_URL}/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ title, dayOfWeek }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || "Failed to update task");
        }

        const data = await response.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? data.task : t))
        );
        toast.success("Đã cập nhật task");
      } else {
        // Create new task
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ title, dayOfWeek, completed: false }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || "Failed to create task");
        }

        const data = await response.json();
        setTasks((prev) => [...prev, data.task]);
        toast.success("Đã thêm task mới");
      }

      setDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Không thể lưu task");
    }
  };

  // Toggle task completion
  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to update task");
      }

      const data = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error("Không thể cập nhật trạng thái task");
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to delete task");
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Đã xóa task");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Không thể xóa task");
    }
  };

  // Open dialog to add task
  const handleAddTask = (day: string) => {
    setSelectedDay(day);
    setEditingTask(null);
    setDialogOpen(true);
  };

  // Open dialog to edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setSelectedDay(task.dayOfWeek);
    setDialogOpen(true);
  };

  // Get tasks for a specific day
  const getTasksForDay = (day: string) => {
    return tasks.filter((task) => task.dayOfWeek === day);
  };

  // Calculate weekly stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quản lý Task Tuần
                </h1>
                <p className="text-sm text-gray-500">
                  {completedTasks}/{totalTasks} task hoàn thành ({completionRate}%)
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTasks}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-gray-500">Đang tải...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {DAYS.map((day) => (
              <DayColumn
                key={day.value}
                day={day.value}
                dayLabel={day.label}
                tasks={getTasksForDay(day.value)}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingTask(null);
            setSelectedDay(undefined);
          }
        }}
        onSave={handleSaveTask}
        initialDay={selectedDay}
        editTask={editingTask}
      />
    </div>
  );
}
