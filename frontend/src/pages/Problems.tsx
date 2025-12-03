import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
} from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchQuestions } from "@/api/sqlApi";

// ---------- Types ----------
interface Question {
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string; // topic name, e.g. "Data Retrieval Queries"
  tags: string[];
}

// ---------- Constants ----------

// Level → topics mapping (must match question.category values)
const levelOrder = ["Fundamentals", "Intermediate", "Advanced"] as const;

const normalizeConcept = (name: string) => {
  for (const level of levelOrder) {
    for (const concept of conceptsByLevel[level]) {
      if (concept.toLowerCase().trim() === name.toLowerCase().trim()) {
        return concept;
      }
    }
  }
  return null;
};

const conceptsByLevel: Record<(typeof levelOrder)[number], string[]> = {
  Fundamentals: [
    "Data Retrieval Queries",
    "Filtering and Sorting Data",
    "Aggregation and Summary Functions",
    "Grouping and Conditional Aggregation",
    "Introductory Joins",
    "Column Aliasing & Core SQL Functions",
  ],
  Intermediate: [
    "Advanced Joins & Multi-Table Logic",
    "Subqueries & Nested Logic",
    "Conditional Expressions",
    "String & Date Manipulation",
    "DML Operations",
    "DDL Operations",
    "Sorting & Pagination",
    "Set Operations",
    "Window Functions",
    "Complex Aggregation Patterns",
  ],
  Advanced: [
    "CTE",
    "Query Optimization",
    "Triggers",
    "Stored Procedures",
    "Transactions",
    "Security",
    "Views",
    "Performance",
    "Case Study",
  ],
};

const difficultyColors: Record<Question["difficulty"], string> = {
  Easy: "text-emerald-500 border-emerald-500",
  Medium: "text-amber-500 border-amber-500",
  Hard: "text-rose-500 border-rose-500",
};

const levelEmoji: Record<(typeof levelOrder)[number], string> = {
  Fundamentals: "🟢",
  Intermediate: "🟡",
  Advanced: "🔵",
};

const estimatedTimeByDiff: Record<Question["difficulty"], number> = {
  Easy: 5,
  Medium: 8,
  Hard: 12,
};

const conceptDescriptions: Record<string, string> = {
  "Data Retrieval Queries": "SELECT, FROM, WHERE",
  "Filtering and Sorting Data": "ORDER BY, DISTINCT, LIMIT, BETWEEN, IN",
  "Aggregation and Summary Functions": "COUNT, SUM, AVG, MIN, MAX",
  "Grouping and Conditional Aggregation": "GROUP BY, HAVING",
  "Introductory Table Joins": "INNER JOIN, LEFT JOIN, RIGHT JOIN",
  "Column Aliasing and Core SQL Functions": "AS, CONCAT, LENGTH, UPPER, LOWER",
  "Advanced Joins and Set Operations":
    "FULL OUTER JOIN, UNION, INTERSECT, EXCEPT",
  "Subqueries and Nested Logic": "IN, EXISTS, Correlated Subqueries",
  "Conditional Expressions": "CASE, WHEN, THEN, ELSE",
  "String and Date Manipulation": "SUBSTRING, REPLACE, DATE_FORMAT, EXTRACT",
  "Data Manipulation Statements": "INSERT, UPDATE, DELETE",
  "Analytical and Window Functions":
    "ROW_NUMBER, RANK, DENSE_RANK, PARTITION BY",
  "Common Table Expressions (CTEs)": "WITH clause, Recursive CTEs",
  "Query Optimization and Indexing":
    "Indexes, Query Optimization, Execution Plans",
  "Database Normalization and Schema Design":
    "1NF, 2NF, 3NF, Entity Relationships",
  "Transactions and Concurrency Control":
    "COMMIT, ROLLBACK, SAVEPOINT, ACID Properties",
  "Stored Procedures and Triggers": "CREATE PROCEDURE, CREATE TRIGGER, EXECUTE",
  "JSON and Advanced Data Types": "JSON_EXTRACT, JSON_OBJECT, ARRAY Functions",
};

// ---------- Component ----------

const Problems = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 solved problems from backend (for checkmarks + concept progress)
  const solvedSlugs = useAppSelector((state) => state.auth.solvedSlugs ?? []);

  // 🔢 progress stats from backend (/user/progress via authSlice.fetchProfile)
  const progressStats = useAppSelector(
    (state) => state.auth.user?.progressStats
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [openLevels, setOpenLevels] = useState<string[]>(["Fundamentals"]);
  const [openConcepts, setOpenConcepts] = useState<string[]>([]);

  // ---------- Load questions from backend ----------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ---------- Handle deep linking to specific concept ----------

  useEffect(() => {
    const state = location.state as { openConcept?: string } | undefined;
    if (!state?.openConcept) return;

    const conceptName = normalizeConcept(state.openConcept);
    if (!conceptName) return;

    // find which level it belongs to
    let conceptLevel: string | null = null;
    for (const level of levelOrder) {
      if (conceptsByLevel[level].includes(conceptName)) {
        conceptLevel = level;
        break;
      }
    }

    if (conceptLevel) {
      setOpenLevels((prev) => [...new Set([...prev, conceptLevel])]);
      setOpenConcepts((prev) => [...new Set([...prev, conceptName])]);

      setTimeout(() => {
        const el = document.getElementById(
          `concept-${conceptName.replace(/\s+/g, "-").toLowerCase()}`
        );
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }

    window.history.replaceState({}, document.title);
  }, [location.state]);

  // ---------- Derived stats (header cards) from backend progress ----------
  const easySolved = progressStats?.easySolved ?? 0;
  const mediumSolved = progressStats?.mediumSolved ?? 0;
  const hardSolved = progressStats?.hardSolved ?? 0;

  const totalEasy = progressStats?.totalEasy ?? 0;
  const totalMedium = progressStats?.totalMedium ?? 0;
  const totalHard = progressStats?.totalHard ?? 0;

  const totalSolved = easySolved + mediumSolved + hardSolved;
  const totalQuestionsFromBackend = totalEasy + totalMedium + totalHard;
  const totalQuestions =
    totalQuestionsFromBackend > 0
      ? totalQuestionsFromBackend
      : questions.length;

  const isProblemSolved = (slug: string) => solvedSlugs.includes(slug);

  const toggleLevel = (level: string) => {
    setOpenLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const toggleConcept = (concept: string) => {
    setOpenConcepts((prev) =>
      prev.includes(concept)
        ? prev.filter((c) => c !== concept)
        : [...prev, concept]
    );
  };

  const getLevelProgress = (level: string) => {
    const topics = conceptsByLevel[level as (typeof levelOrder)[number]] || [];
    const levelProblems = questions.filter((q) => topics.includes(q.category));
    const solvedCount = levelProblems.filter((p) =>
      isProblemSolved(p.slug)
    ).length;
    return { solved: solvedCount, total: levelProblems.length };
  };

  const getConceptProgress = (concept: string) => {
    const conceptProblems = questions.filter((p) => p.category === concept);
    const solvedCount = conceptProblems.filter((p) =>
      isProblemSolved(p.slug)
    ).length;
    return { solved: solvedCount, total: conceptProblems.length };
  };

  const getConceptDescription = (concept: string, problems: Question[]) => {
    if (problems.length > 0 && problems[0].tags?.length) {
      return problems[0].tags.join(", ");
    }
    return conceptDescriptions[concept] || "";
  };

  const handleOpenProblem = (slug: string) => {
    // route stays /problem/:param – param name doesn't matter
    navigate(`/problem/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 text-center text-muted-foreground">
          Loading questions...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">SQL Problems</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Progress
                  </p>
                  <div className="text-4xl font-bold mb-1">
                    {totalSolved} / {totalQuestions}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalQuestions === 0
                      ? "0% completed"
                      : `${Math.round(
                          (totalSolved / totalQuestions) * 100
                        )}% completed`}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Easy</p>
                  <div className="text-4xl font-bold text-emerald-500 mb-1">
                    {easySolved}
                  </div>
                  <p className="text-xs text-muted-foreground">completed</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Medium</p>
                  <div className="text-4xl font-bold text-amber-500 mb-1">
                    {mediumSolved}
                  </div>
                  <p className="text-xs text-muted-foreground">completed</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-500/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Hard</p>
                  <div className="text-4xl font-bold text-rose-500 mb-1">
                    {hardSolved}
                  </div>
                  <p className="text-xs text-muted-foreground">completed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Problems Organized by Level */}
        <div className="space-y-6">
          {levelOrder.map((level) => {
            const levelProgress = getLevelProgress(level);
            const isLevelOpen = openLevels.includes(level);
            const concepts = conceptsByLevel[level];

            return (
              <Card key={level} className="border-2">
                <Collapsible
                  open={isLevelOpen}
                  onOpenChange={() => toggleLevel(level)}
                >
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {isLevelOpen ? (
                            <ChevronDown className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-6 w-6 text-muted-foreground" />
                          )}
                          <div className="text-left flex-1">
                            <CardTitle className="text-2xl flex items-center gap-3">
                              <span>{levelEmoji[level]}</span>
                              <span>{level}</span>
                            </CardTitle>
                            <div className="flex items-center gap-4 mt-3">
                              <Progress
                                value={
                                  levelProgress.total === 0
                                    ? 0
                                    : (levelProgress.solved /
                                        levelProgress.total) *
                                      100
                                }
                                className="w-64 h-2"
                              />
                              <span className="text-sm text-muted-foreground font-normal">
                                {levelProgress.solved} / {levelProgress.total}{" "}
                                solved
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-6 pb-6 space-y-4">
                      {concepts.map((concept) => {
                        const conceptProblems = questions.filter(
                          (p) => p.category === concept
                        );
                        const conceptProgress = getConceptProgress(concept);
                        const isConceptOpen = openConcepts.includes(concept);
                        const description = getConceptDescription(
                          concept,
                          conceptProblems
                        );

                        return (
                          <Card
                            key={concept}
                            id={`concept-${concept
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`}
                            className="border-border bg-muted/20"
                          >
                            <Collapsible
                              open={isConceptOpen}
                              onOpenChange={() => toggleConcept(concept)}
                            >
                              <CollapsibleTrigger className="w-full">
                                <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg">
                                  <div className="flex items-center gap-3 flex-1">
                                    {isConceptOpen ? (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <div className="text-left flex-1">
                                      <h3 className="font-semibold text-lg">
                                        {concept}
                                      </h3>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {description}
                                      </p>
                                      <div className="flex items-center gap-3 mt-2">
                                        <Progress
                                          value={
                                            conceptProgress.total === 0
                                              ? 0
                                              : (conceptProgress.solved /
                                                  conceptProgress.total) *
                                                100
                                          }
                                          className="w-48 h-1.5"
                                        />
                                        <span className="text-xs text-muted-foreground">
                                          {conceptProgress.solved} /{" "}
                                          {conceptProgress.total}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CollapsibleTrigger>

                              <CollapsibleContent>
                                <div className="px-4 pb-4 space-y-2">
                                  {conceptProblems.map((problem) => {
                                    const solved = isProblemSolved(
                                      problem.slug
                                    );
                                    const estimatedTime =
                                      estimatedTimeByDiff[problem.difficulty];

                                    return (
                                      <div
                                        key={problem.slug}
                                        className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${
                                          solved
                                            ? "bg-primary/5 border-primary/30"
                                            : "bg-card"
                                        }`}
                                        onClick={() =>
                                          handleOpenProblem(problem.slug)
                                        }
                                      >
                                        <div className="flex items-center gap-4 flex-1">
                                          {solved ? (
                                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                          ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                          )}

                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <h4 className="font-medium">
                                                {problem.title}
                                              </h4>
                                              <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                  difficultyColors[
                                                    problem.difficulty
                                                  ]
                                                }`}
                                              >
                                                {problem.difficulty}
                                              </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                              <span>
                                                <Clock className="inline h-3 w-3 mr-1" />
                                                {estimatedTime} min
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <Button variant="ghost" size="sm">
                                          {solved ? "Review" : "Solve"}
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </Card>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Problems;
