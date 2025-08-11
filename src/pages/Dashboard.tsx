// TODO: THIS IS THE DEFAULT DASHBOARD PAGE THAT THE USER WILL SEE AFTER AUTHENTICATION. ADD MAIN FUNCTIONALITY HERE.
// This is the entry point for users who have just signed in

import { TodoApp } from "@/components/todos/TodoApp";
import { Protected } from "@/lib/protected-page";

export default function Dashboard() {
  return (
    <Protected>
      <TodoApp />
    </Protected>
  );
}