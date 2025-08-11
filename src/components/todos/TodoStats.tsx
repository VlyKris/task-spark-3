import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react";

interface TodoStatsProps {
  stats?: {
    total: number;
    completed: number;
    active: number;
    highPriority: number;
  };
}

export function TodoStats({ stats }: TodoStatsProps) {
  if (!stats) {
    return (
      <div className="bg-card rounded-xl p-6 border">
        <h3 className="font-semibold mb-4">Overview</h3>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded animate-pulse w-20" />
              <div className="h-4 bg-muted rounded animate-pulse w-8" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: <Circle className="h-4 w-4" />,
      color: "text-muted-foreground",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      label: "Active",
      value: stats.active,
      icon: <Clock className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      label: "High Priority",
      value: stats.highPriority,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl p-6 border"
    >
      <h3 className="font-semibold mb-4">Overview</h3>
      <div className="space-y-3">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className={item.color}>{item.icon}</span>
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
            <span className="font-medium">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
