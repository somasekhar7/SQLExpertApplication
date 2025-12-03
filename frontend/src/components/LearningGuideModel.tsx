import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, BookOpen, Terminal, Trophy, Brain } from "lucide-react";

interface LearningGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export function LearningGuideModal({ open, onClose }: LearningGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            How to Learn SQL on SQLExpert
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6 text-foreground">
          {/* Step 1 */}
          <div className="flex gap-4 items-start">
            <BookOpen className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">
                1. Choose a Learning Path
              </h3>
              <p className="text-sm text-muted-foreground">
                Start with *Fundamentals*, move to *Intermediate*, and finally
                tackle *Advanced* SQL topics. Each path includes structured
                concepts curated for real-world skills.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start">
            <Terminal className="h-8 w-8 text-success shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">
                2. Practice Using the Built-In SQL Editor
              </h3>
              <p className="text-sm text-muted-foreground">
                Solve problems with an interactive SQL editor. Your queries run
                in a sandboxed SQLite engine with instant feedback.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start">
            <CheckCircle className="h-8 w-8 text-warning shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">
                3. Learn Through Real-World Scenarios
              </h3>
              <p className="text-sm text-muted-foreground">
                Problems simulate real interview tasks—joins, aggregations,
                optimization, analytics, and more.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 items-start">
            <Brain className="h-8 w-8 text-destructive shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">
                4. Master Concepts with Explanations & Hints
              </h3>
              <p className="text-sm text-muted-foreground">
                Every concept includes hints, explanations, and reference
                examples to help you understand the “why,” not just the “how.”
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4 items-start">
            <Trophy className="h-8 w-8 text-purple-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">5. Track Your Progress</h3>
              <p className="text-sm text-muted-foreground">
                Each problem updates your completion stats automatically so you
                always know what to study next.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
          >
            Start Learning Now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
