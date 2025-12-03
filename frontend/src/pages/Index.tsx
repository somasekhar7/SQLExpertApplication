import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SqlTopicCard } from "@/components/SqlTopicCard";
import { CoffeeContribution } from "@/components/CoffeeContribution";
import { sqlTopics } from "@/data/sqlTopics";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();

  const handleStartLearning = (conceptTitle: string) => {
    navigate("/problems", { state: { openConcept: conceptTitle } });
  };

  const [openSections, setOpenSections] = useState({
    fundamentals: true,
    intermediate: true,
    advanced: true,
  });

  const fundamentalTopics = sqlTopics.filter(
    (t) => t.category === "fundamentals"
  );
  const intermediateTopics = sqlTopics.filter(
    (t) => t.category === "intermediate"
  );
  const advancedTopics = sqlTopics.filter((t) => t.category === "advanced");

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <section className="py-20">
        <div className="container">
          {/* -------------------- FUNDAMENTALS -------------------- */}
          <Collapsible
            open={openSections.fundamentals}
            onOpenChange={() => toggleSection("fundamentals")}
            className="mb-12"
          >
            <CollapsibleTrigger className="flex items-center gap-3 mb-6 w-full">
              <Badge className="bg-success/10 text-success">Fundamentals</Badge>
              <h3 className="text-xl font-semibold">Start Your SQL Journey</h3>
              <ChevronDown
                className={`ml-auto transition ${
                  openSections.fundamentals ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fundamentalTopics.map((topic) => (
                  <SqlTopicCard
                    key={topic.id}
                    title={topic.title}
                    description={topic.description}
                    problemCount={topic.problemCount}
                    difficulty={topic.difficulty}
                    estimatedTime={topic.estimatedTime}
                    icon={<topic.icon className="h-5 w-5" />}
                    completed={topic.completed}
                    concepts={topic.concepts}
                    onStartLearning={() => handleStartLearning(topic.title)}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* -------------------- INTERMEDIATE -------------------- */}
          <Collapsible
            open={openSections.intermediate}
            onOpenChange={() => toggleSection("intermediate")}
            className="mb-12"
          >
            <CollapsibleTrigger className="flex items-center gap-3 mb-6 w-full">
              <Badge className="bg-warning/10 text-warning">Intermediate</Badge>
              <h3 className="text-xl font-semibold">
                Build Advanced SQL Skills
              </h3>
              <ChevronDown
                className={`ml-auto transition ${
                  openSections.intermediate ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {intermediateTopics.map((topic) => (
                  <SqlTopicCard
                    key={topic.id}
                    title={topic.title}
                    description={topic.description}
                    problemCount={topic.problemCount}
                    difficulty={topic.difficulty}
                    estimatedTime={topic.estimatedTime}
                    icon={<topic.icon className="h-5 w-5" />}
                    completed={topic.completed}
                    concepts={topic.concepts}
                    onStartLearning={() => handleStartLearning(topic.title)}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* -------------------- ADVANCED -------------------- */}
          <Collapsible
            open={openSections.advanced}
            onOpenChange={() => toggleSection("advanced")}
            className="mb-12"
          >
            <CollapsibleTrigger className="flex items-center gap-3 mb-6 w-full">
              <Badge className="bg-destructive/10 text-destructive">
                Advanced
              </Badge>
              <h3 className="text-xl font-semibold">
                Master Complex SQL Concepts
              </h3>
              <ChevronDown
                className={`ml-auto transition ${
                  openSections.advanced ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advancedTopics.map((topic) => (
                  <SqlTopicCard
                    key={topic.id}
                    title={topic.title}
                    description={topic.description}
                    problemCount={topic.problemCount}
                    difficulty={topic.difficulty}
                    estimatedTime={topic.estimatedTime}
                    icon={<topic.icon className="h-5 w-5" />}
                    completed={topic.completed}
                    concepts={topic.concepts}
                    onStartLearning={() => handleStartLearning(topic.title)}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      <CoffeeContribution />
    </div>
  );
};

export default Index;
