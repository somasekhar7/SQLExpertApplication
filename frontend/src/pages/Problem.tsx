// ------------------------------------------
//  Problem.tsx (FINAL UPDATED VERSION)
// ------------------------------------------
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import {
  runSQLQuery,
  submitSQLQuery,
  fetchQuestionBySlug,
  QuestionDetail,
  SqlRow,
  TestCaseResult,
  // 🔽 make sure you implement this in sqlApi.ts
  fetchSolutionBySlug,
} from "@/api/sqlApi";

import {
  Play,
  Save,
  Bot,
  Clock,
  Trophy,
  Lightbulb,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Table,
  Eye,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";

import { useAppSelector } from "@/hooks/useAppSelector";

// ------------------------------------------------------------
// Helper: Parse SQLite schema from setupSQL (table names only)
// ------------------------------------------------------------
function extractTableNames(setupSQL: string): string[] {
  const names: string[] = [];
  const createRegex = /CREATE TABLE\s+(\w+)\s*\(/gi;
  let match;
  while ((match = createRegex.exec(setupSQL)) !== null) {
    names.push(match[1]);
  }
  return names;
}

type TablePreview = {
  table: string;
  columns: string[];
  rows: SqlRow[];
};

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
const Problem = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { user } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [code, setCode] = useState<string>("");
  const [loadingQuestion, setLoadingQuestion] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [outputRows, setOutputRows] = useState<SqlRow[]>([]);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [testsPassed, setTestsPassed] = useState<boolean | null>(null);

  // Table preview state (from setupSQL → sandbox → SELECT * LIMIT 10)
  const [tablePreview, setTablePreview] = useState<TablePreview[]>([]);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  // Solution tab
  const [solutionSQL, setSolutionSQL] = useState<string | null>(null);
  const [solutionLoading, setSolutionLoading] = useState<boolean>(false);
  const [solutionError, setSolutionError] = useState<string | null>(null);

  // Left tab state so we can lazy-load solution
  const [activeTab, setActiveTab] = useState<
    "description" | "hints" | "solution"
  >("description");

  // ------------------------------------------------------------
  // Load question
  // ------------------------------------------------------------
  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        setLoadingQuestion(true);
        setSolutionSQL(null);
        setTablePreview([]);
        setSolutionError(null);
        setActiveTab("description");

        const q = await fetchQuestionBySlug(slug);
        setQuestion(q);

        if (q.savedSQL && q.savedSQL.trim() !== "") {
          setCode(q.savedSQL);
        } else {
          setCode("-- Write your SQL here\n");
        }

        setOutputRows([]);
        setTestResults([]);
        setTestsPassed(null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load question");
      } finally {
        setLoadingQuestion(false);
      }
    })();
  }, [slug]);

  // ------------------------------------------------------------
  // Build table preview (real data) from setupSQL
  // ------------------------------------------------------------
  useEffect(() => {
    if (!slug || !question?.setupSQL) return;

    const tableNames = extractTableNames(question.setupSQL);
    if (tableNames.length === 0) {
      setTablePreview([]);
      return;
    }

    (async () => {
      try {
        setPreviewLoading(true);
        const previews: TablePreview[] = [];

        for (const tName of tableNames) {
          try {
            // Only first 10 rows, as per your choice (Option 2)
            const res = await runSQLQuery(slug, `SELECT * FROM ${tName};`);

            if (res.success && res.rows && res.rows.length > 0) {
              const cols = Object.keys(res.rows[0]);
              previews.push({
                table: tName,
                columns: cols,
                rows: res.rows,
              });
            } else {
              previews.push({
                table: tName,
                columns: [],
                rows: [],
              });
            }
          } catch (err) {
            console.error("Preview error for table:", tName, err);
            previews.push({
              table: tName,
              columns: [],
              rows: [],
            });
          }
        }

        setTablePreview(previews);
      } finally {
        setPreviewLoading(false);
      }
    })();
  }, [slug, question?.setupSQL]);

  // ------------------------------------------------------------
  // Lazy load solution once Solution tab is opened
  // ------------------------------------------------------------
  useEffect(() => {
    if (
      activeTab !== "solution" ||
      !isLoggedIn ||
      !slug ||
      solutionSQL !== null ||
      solutionLoading
    ) {
      return;
    }

    (async () => {
      try {
        setSolutionLoading(true);
        setSolutionError(null);

        // Expecting backend: GET /api/questions/:slug/solution
        const res = await fetchSolutionBySlug(slug);
        const sql =
          (res as { solutionSQL?: string }).solutionSQL ||
          "-- No solution available for this question.";
        setSolutionSQL(sql);
      } catch (err) {
        console.error("Failed to load solution", err);
        setSolutionError("Failed to load solution");
      } finally {
        setSolutionLoading(false);
      }
    })();
  }, [activeTab, isLoggedIn, slug, solutionSQL, solutionLoading]);

  if (loadingQuestion) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 text-center">
          <p className="text-muted-foreground">Question not found</p>
        </div>
      </div>
    );
  }

  const disableActions = !isLoggedIn;

  // ------------------------------------------------------------
  // Run SQL
  // ------------------------------------------------------------
  const handleRunCode = async () => {
    if (!isLoggedIn) return toast.error("Login required");
    if (!slug) return;

    setIsRunning(true);
    setOutputRows([]);
    setTestsPassed(null);

    try {
      const res = await runSQLQuery(slug, code);
      if (!res.success) {
        toast.error(res.error || "Query failed");
      } else {
        setOutputRows(res.rows || []);
      }
    } catch {
      toast.error("Execution failed");
    }

    setIsRunning(false);
  };

  // ------------------------------------------------------------
  // Submit SQL
  // ------------------------------------------------------------
  const handleSubmit = async () => {
    if (!isLoggedIn) return toast.error("Login required");
    if (!slug) return;

    setIsRunning(true);
    setTestsPassed(null);

    try {
      const res = await submitSQLQuery(slug, code);
      setTestResults(res.cases || []);

      if (res.status === "passed") {
        setTestsPassed(true);
        toast.success("All test cases passed! 🎉");
      } else {
        setTestsPassed(false);
        toast.error("Some test cases failed");
      }
    } catch {
      toast.error("Submission failed");
    }

    setIsRunning(false);
  };

  // ------------------------------------------------------------
  // Reset code
  // ------------------------------------------------------------
  const handleResetCode = () => {
    if (question.savedSQL && question.savedSQL.trim() !== "") {
      setCode(question.savedSQL);
    } else {
      setCode("-- Write your SQL here\n");
    }

    setOutputRows([]);
    setTestResults([]);
    setTestsPassed(null);
  };

  // ------------------------------------------------------------
  // UI COLORS
  // ------------------------------------------------------------
  const difficultyColors: Record<QuestionDetail["difficulty"], string> = {
    Easy: "bg-emerald-600/20 text-emerald-400",
    Medium: "bg-amber-600/20 text-amber-400",
    Hard: "bg-red-600/20 text-red-400",
  };

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/problems")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Problems
        </Button>

        <ResizablePanelGroup direction="horizontal" className="min-h-[85vh]">
          {/* LEFT: PROBLEM */}
          <ResizablePanel minSize={30} defaultSize={45}>
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">{question.title}</h1>
                  <Badge className={difficultyColors[question.difficulty]}>
                    {question.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    {question.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> 5 min
                  </span>
                </div>
              </div>

              {/* Tabs: Description + Hints + Solution */}
              <Tabs
                value={activeTab}
                onValueChange={(v) =>
                  setActiveTab(v as "description" | "hints" | "solution")
                }
                className="h-full overflow-y-auto"
              >
                <TabsList
                  className={`mx-6 mt-4 grid ${
                    isLoggedIn ? "grid-cols-3" : "grid-cols-2"
                  }`}
                >
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="hints">
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Hints ({question.hints.length})
                  </TabsTrigger>

                  {isLoggedIn && (
                    <TabsTrigger value="solution">
                      <Eye className="h-4 w-4 mr-1" />
                      Solution
                    </TabsTrigger>
                  )}
                </TabsList>

                {/* DESCRIPTION + TABLE PREVIEW (stacked, like LeetCode) */}
                <TabsContent value="description" className="p-6 space-y-6">
                  {/* Problem text */}
                  <section>
                    <p className="prose prose-sm dark:prose-invert">
                      {question.description}
                    </p>
                  </section>

                  {/* Table preview below description */}
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <Table className="h-4 w-4" />
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Sample Tables (first 10 rows)
                      </h2>
                    </div>

                    {previewLoading && (
                      <p className="text-xs text-muted-foreground">
                        Loading sample data...
                      </p>
                    )}

                    {!previewLoading && tablePreview.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No tables defined for this question.
                      </p>
                    )}

                    <div className="space-y-4 mt-2">
                      {tablePreview.map((tp) => (
                        <Card key={tp.table} className="border-border/50">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Table className="h-4 w-4" />
                              {tp.table}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {tp.rows.length === 0 ? (
                              <p className="text-xs text-muted-foreground">
                                No sample rows available.
                              </p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs border">
                                  <thead className="bg-muted/40">
                                    <tr>
                                      {tp.columns.map((col) => (
                                        <th
                                          key={col}
                                          className="border-b px-2 py-1 text-left"
                                        >
                                          {col}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {tp.rows.map((row, idx) => (
                                      <tr key={idx} className="border-b">
                                        {tp.columns.map((col) => (
                                          <td
                                            key={col}
                                            className="px-2 py-1 align-top"
                                          >
                                            {row[col] === null
                                              ? "NULL"
                                              : String(row[col])}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                </TabsContent>

                {/* HINTS */}
                <TabsContent value="hints" className="p-6">
                  {question.hints.map((hint, i) => (
                    <Card key={i} className="border-border/50 mb-3">
                      <CardContent className="p-4 text-sm">{hint}</CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* SOLUTION (from backend /questions/:slug/solution) */}
                {isLoggedIn && (
                  <TabsContent value="solution" className="p-6">
                    <Card className="border-warning/30 bg-warning/5">
                      <CardHeader>
                        <CardTitle className="text-warning flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Official Solution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {solutionLoading && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading solution...
                          </div>
                        )}
                        {solutionError && (
                          <p className="text-sm text-destructive">
                            {solutionError}
                          </p>
                        )}
                        {!solutionLoading && !solutionError && solutionSQL && (
                          <pre className="bg-code-bg p-4 rounded-lg text-sm font-mono overflow-x-auto">
                            <code>{solutionSQL}</code>
                          </pre>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* RIGHT SIDE: EDITOR */}
          <ResizablePanel minSize={40} defaultSize={55}>
            <div className="h-full flex flex-col">
              {/* Editor Header */}
              <div className="p-4 border-b border-border flex justify-between bg-muted/20">
                <h3 className="font-semibold">SQL Editor</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleResetCode}>
                    Reset
                  </Button>

                  <Button size="sm" variant="outline">
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              </div>

              {/* MONACO EDITOR */}
              <div className="h-[60%]">
                <Editor
                  height="100%"
                  defaultLanguage="sql"
                  theme={theme === "dark" ? "vs-dark" : "vs"}
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                  }}
                />
              </div>

              <Separator />

              {/* OUTPUT + TESTS */}
              <div className="h-[40%] overflow-hidden">
                <Tabs defaultValue="output" className="h-full">
                  <div className="flex justify-between p-3 border-b">
                    <TabsList>
                      <TabsTrigger value="output">Output</TabsTrigger>
                      <TabsTrigger value="tests">Test Results</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                      {/* AI opens dedicated screen */}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={disableActions}
                        onClick={() => navigate(`/ai/${slug}`)}
                      >
                        <Bot className="h-4 w-4 mr-1" /> AI Feedback
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRunCode}
                        disabled={isRunning || disableActions}
                      >
                        {isRunning ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Play className="h-4 w-4 mr-1" />
                        )}
                        Run
                      </Button>

                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground"
                        onClick={handleSubmit}
                        disabled={isRunning || disableActions}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>

                  {/* OUTPUT */}
                  <TabsContent
                    value="output"
                    className="p-3 h-full overflow-y-auto"
                  >
                    {outputRows.length === 0 ? (
                      <div className="text-center text-muted-foreground pt-10">
                        Run your query to see results
                      </div>
                    ) : (
                      <table className="w-full text-sm border">
                        <thead className="bg-muted/40">
                          <tr>
                            {Object.keys(outputRows[0]).map((c) => (
                              <th key={c} className="p-2 border-b text-left">
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {outputRows.map((row, i) => (
                            <tr key={i} className="border-b">
                              {Object.values(row).map((v, j) => (
                                <td key={j} className="p-2">
                                  {v === null ? "NULL" : String(v)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </TabsContent>

                  {/* TEST RESULTS */}
                  <TabsContent
                    value="tests"
                    className="p-3 h-full overflow-y-auto space-y-2"
                  >
                    {testResults.length === 0 ? (
                      <p className="text-muted-foreground text-center pt-10">
                        Submit your SQL to see test results
                      </p>
                    ) : (
                      testResults.map((t, i) => (
                        <Card key={i} className="border">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              {t.passed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="font-medium text-sm">
                                {t.name}
                              </span>
                            </div>

                            {!t.passed && (
                              <div className="text-xs text-muted-foreground">
                                <p>
                                  Expected: {JSON.stringify(t.expectedSample)}
                                </p>
                                <p>Got: {JSON.stringify(t.gotSample)}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Problem;
