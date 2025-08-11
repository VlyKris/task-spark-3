import { Doc } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { AddTodoDialog } from "./AddTodoDialog";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos?: Doc<"todos">[];
}

export function TodoList({ todos }: TodoListProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (!todos) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-muted rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <div className="bg-card rounded-xl p-12 border">
          <CheckCircle2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No todos yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first todo to get started with organizing your tasks.
          </p>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Todo
          </Button>
        </div>
        <AddTodoDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
        />
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo, index) => (
        <motion.div
          key={todo._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <TodoItem todo={todo} />
        </motion.div>
      ))}
    </div>
  );
}
