import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all todos for the current user
export const getTodos = query({
  args: {
    filter: v.optional(v.union(v.literal("all"), v.literal("active"), v.literal("completed"))),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    let todosQuery = ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.filter === "active") {
      todosQuery = ctx.db
        .query("todos")
        .withIndex("by_user_and_completed", (q) => q.eq("userId", userId).eq("completed", false));
    } else if (args.filter === "completed") {
      todosQuery = ctx.db
        .query("todos")
        .withIndex("by_user_and_completed", (q) => q.eq("userId", userId).eq("completed", true));
    }

    let todos = await todosQuery.collect();

    // Filter by category if specified
    if (args.categoryId) {
      const todoCategories = await ctx.db
        .query("todoCategories")
        .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId!))
        .collect();
      
      const todoIds = new Set(todoCategories.map(tc => tc.todoId));
      todos = todos.filter(todo => todoIds.has(todo._id));
    }

    // Sort by priority (high -> medium -> low) and then by creation time
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return todos.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b._creationTime - a._creationTime;
    });
  },
});

// Create a new todo
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
    categoryIds: v.optional(v.array(v.id("categories"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todoId = await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      completed: false,
      priority: args.priority,
      dueDate: args.dueDate,
      userId,
    });

    // Add category associations if provided
    if (args.categoryIds && args.categoryIds.length > 0) {
      for (const categoryId of args.categoryIds) {
        await ctx.db.insert("todoCategories", {
          todoId,
          categoryId,
          userId,
        });
      }
    }

    return todoId;
  },
});

// Update a todo
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found or access denied");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.completed !== undefined) updates.completed = args.completed;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;

    await ctx.db.patch(args.id, updates);
  },
});

// Delete a todo
export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found or access denied");
    }

    // Delete category associations
    const todoCategories = await ctx.db
      .query("todoCategories")
      .withIndex("by_todo", (q) => q.eq("todoId", args.id))
      .collect();
    
    for (const tc of todoCategories) {
      await ctx.db.delete(tc._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Toggle todo completion
export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found or access denied");
    }

    await ctx.db.patch(args.id, { completed: !todo.completed });
  },
});

// Get todo statistics
export const getTodoStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    const highPriority = todos.filter(t => t.priority === "high" && !t.completed).length;

    return { total, completed, active, highPriority };
  },
});