import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { CheckCircle, Plus } from "lucide-react";
import { useState } from "react";
import { UserButton } from "../auth/UserButton";
import { Button } from "../ui/button";
import { AddTodoDialog } from "./AddTodoDialog";
import { TodoFilters } from "./TodoFilters";
import { TodoList } from "./TodoList";
import { TodoStats } from "./TodoStats";

export function TodoApp() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const todos = useQuery(api.todos.getTodos, { 
    filter,
    categoryId: selectedCategoryId as any
  });
  const stats = useQuery(api.todos.getTodoStats);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">TodoFlow</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.name || "User"}!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowAddDialog(true)}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Todo
            </Button>
            <UserButton />
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              <TodoStats stats={stats} />
              <TodoFilters
                currentFilter={filter}
                onFilterChange={setFilter}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={setSelectedCategoryId}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <TodoList todos={todos} />
          </motion.div>
        </div>
      </div>

      <AddTodoDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
