import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Task {
  id: string;
  title: string;
  dayOfWeek: string;
  completed: boolean;
  createdAt: string;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, dayOfWeek: string) => void;
  initialDay?: string;
  editTask?: Task | null;
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

export function TaskDialog({
  open,
  onOpenChange,
  onSave,
  initialDay,
  editTask,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState(initialDay || "monday");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDayOfWeek(editTask.dayOfWeek);
    } else {
      setTitle("");
      setDayOfWeek(initialDay || "monday");
    }
  }, [editTask, initialDay, open]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), dayOfWeek);
      setTitle("");
      setDayOfWeek(initialDay || "monday");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editTask ? "Chỉnh sửa task" : "Thêm task mới"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Tên công việc</Label>
            <Input
              id="title"
              placeholder="Nhập tên công việc..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="day">Ngày trong tuần</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger id="day">
                <SelectValue placeholder="Chọn ngày" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {editTask ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
