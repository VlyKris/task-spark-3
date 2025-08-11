import { AuthButton } from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Star, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full py-6 px-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight">TodoFlow</span>
          </div>
          <AuthButton />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-6xl mx-auto px-4 py-20 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          Organize Your Life
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          A beautiful, simple todo app that helps you stay focused and productive. 
          Organize tasks by priority, set due dates, and track your progress.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <AuthButton 
            trigger={
              <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
                Get Started Free
              </Button>
            }
          />
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl">
            Learn More
          </Button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple yet powerful features to help you manage your tasks efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <CheckCircle className="h-8 w-8" />,
              title: "Simple Task Management",
              description: "Create, edit, and complete tasks with ease. Focus on what matters most."
            },
            {
              icon: <Star className="h-8 w-8" />,
              title: "Priority Levels",
              description: "Set high, medium, or low priority to organize your tasks by importance."
            },
            {
              icon: <Clock className="h-8 w-8" />,
              title: "Due Dates",
              description: "Never miss a deadline with optional due date tracking and reminders."
            },
            {
              icon: <Zap className="h-8 w-8" />,
              title: "Real-time Sync",
              description: "Your tasks sync instantly across all your devices. Always up to date."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-2xl border bg-card/50 backdrop-blur-sm"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4 py-20 text-center"
      >
        <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-12 border">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to get organized?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with TodoFlow.
          </p>
          <AuthButton 
            trigger={
              <Button size="lg" className="text-lg px-12 py-6 rounded-xl">
                Start Your Journey
              </Button>
            }
          />
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TodoFlow</span>
          </div>
          <p className="text-muted-foreground">
            Built with ❤️ for productivity enthusiasts
          </p>
        </div>
      </footer>
    </div>
  );
}