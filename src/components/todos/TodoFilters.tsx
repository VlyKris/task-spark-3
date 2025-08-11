import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Plus, Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TodoFiltersProps {
  currentFilter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  selectedCategoryId?: string;
  onCategoryChange: (categoryId?: string) => void;
}

export function TodoFilters({
  currentFilter,
  onFilterChange,
  selectedCategoryId,
  onCategoryChange,
}: TodoFiltersProps) {
  const categories = useQuery(api.categories.getCategories);
  const createCategory = useMutation(api.categories.createCategory);
  const deleteCategory = useMutation(api.categories.deleteCategory);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 90%, 65%)`;

    try {
      await createCategory({
        name: newCategoryName.trim(),
        color: randomColor(),
      });
      toast.success("Category created!");
      setNewCategoryName("");
      setIsAdding(false);
    } catch (error) {
      toast.error("Failed to create category.");
    }
  };

  const handleDeleteCategory = async (id: Id<"categories">) => {
    try {
      if (selectedCategoryId === id) {
        onCategoryChange(undefined);
      }
      await deleteCategory({ id });
      toast.success("Category deleted!");
    } catch (error) {
      toast.error("Failed to delete category.");
    }
  };

  const filters = [
    { key: "all" as const, label: "All Tasks", icon: <Circle className="h-4 w-4" /> },
    { key: "active" as const, label: "Active", icon: <Clock className="h-4 w-4" /> },
    { key: "completed" as const, label: "Completed", icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Status Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-xl p-6 border"
      >
        <h3 className="font-semibold mb-4">Filter by Status</h3>
        <div className="space-y-2">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={currentFilter === filter.key ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => onFilterChange(filter.key)}
            >
              {filter.icon}
              {filter.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card rounded-xl p-6 border"
      >
        <h3 className="font-semibold mb-4">Filter by Category</h3>
        <div className="space-y-2">
          <Button
            variant={!selectedCategoryId ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => onCategoryChange(undefined)}
          >
            <Tag className="h-4 w-4" />
            All Categories
          </Button>
          {categories?.map((category) => (
            <div key={category._id} className="flex items-center group">
              <Button
                variant={selectedCategoryId === category._id ? "default" : "ghost"}
                className="w-full justify-start gap-2 flex-1"
                onClick={() => onCategoryChange(category._id)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="truncate">{category.name}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(category._id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {isAdding ? (
            <form onSubmit={handleAddCategory} className="flex gap-2 pt-2">
              <Input
                placeholder="New category..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
              />
              <Button type="submit" size="sm">
                Add
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}