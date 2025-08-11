import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { AlertTriangle, Calendar, CheckCircle2, Circle, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EditTodoDialog } from "./EditTodoDialog";

interface TodoItemProps {
  todo: Doc<"todos">;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const handleToggle = async () => {
    try {
      await toggleTodo({ id: todo._id });
      toast.success(todo.completed ? "Task marked as active" : "Task completed!");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo({ id: todo._id });
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="h-4 w-4" />;
      case "medium": return <Circle className="h-4 w-4" />;
      case "low": return <Circle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-card rounded-xl p-6 border transition-all ${
        todo.completed ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggle}
            className="mt-1"
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3
                className={`font-medium mb-1 ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`text-sm mb-3 ${
                    todo.completed ? "line-through text-muted-foreground" : "text-muted-foreground"
                  }`}
                >
                  {todo.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs">
                <div className={`flex items-center gap-1 ${getPriorityColor(todo.priority)}`}>
                  {getPriorityIcon(todo.priority)}
                  <span className="capitalize">{todo.priority}</span>
                </div>
                {todo.dueDate && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(todo.dueDate), "MMM d, yyyy")}</span>
                  </div>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <EditTodoDialog
        todo={todo}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </motion.div>
  );
}
