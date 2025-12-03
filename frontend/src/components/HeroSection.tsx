import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditorVisual } from "@/components/CodeEditorVisual";
import { Database } from "lucide-react";
import { LearningGuideModal } from "./LearningGuideModel";

export function HeroSection() {
  const [openGuide, setOpenGuide] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-card py-20 lg:py-32">
        <div className="container relative">
          <div className="grid lg:grid-cols-[1fr,1.2fr] gap-8 items-center">
            {/* LEFT SECTION */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 via-primary-light/20 to-primary/20 border-2 border-primary/30 transition-all duration-300 shadow-lg">
                <Database className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Master SQL with Interactive Learning
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-fade-in">
                SQLExpert
              </h1>

              <p className="text-lg text-foreground/70 max-w-lg leading-relaxed animate-fade-in font-medium">
                The ultimate resource to prepare for data engineering
                interviews. Everything you need, in one streamlined platform.
              </p>

              {/* BUTTON THAT TRIGGERS MODAL */}
              <div className="animate-fade-in">
                <Button
                  size="lg"
                  onClick={() => setOpenGuide(true)}
                  className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-primary-foreground px-8 py-6 text-lg font-bold"
                >
                  <Database className="mr-2 h-5 w-5" />
                  Start Learning SQL
                </Button>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="relative">
              <CodeEditorVisual />
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <LearningGuideModal
        open={openGuide}
        onClose={() => setOpenGuide(false)}
      />
    </>
  );
}
