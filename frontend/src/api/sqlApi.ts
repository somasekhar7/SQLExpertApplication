// sqlApi.ts
import api from "@/api/axiosInstance";

// ---- Core types ----
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Mode = "read" | "write";

export type SqlValue = string | number | boolean | null;
export interface SqlRow {
  [column: string]: SqlValue;
}

// What submitSQL returns per test case
export interface TestCaseResult {
  name: string;
  passed: boolean;
  expectedSample: SqlRow[];
  gotSample: SqlRow[];
  diffCount: number;
  error?: string;
}

// What GET /api/questions/:slug returns
export interface QuestionDetail {
  setupSQL: string;
  _id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  description: string;
  hints: string[];
  schemaPreview?: string[];
  mode: Mode;
  points?: number;
  createdAt?: string;
  updatedAt?: string;
  testCases: {
    name: string;
    ordered?: boolean;
    maxRows?: number;
    checkType: string;
  }[];
  savedSQL: string;
  // assuming you decided to send this from backend for logged-in users
  solutionSQL?: string;
}

// ---- API calls ----

export interface RunSQLResponse {
  success: boolean;
  columns: string[];
  rows: SqlRow[];
  error?: string;
}

export interface SubmitSQLResponse {
  status: "passed" | "failed" | "error";
  cases: TestCaseResult[];
  // submission object exists but we don't need it here
}

export interface AIHelpResponse {
  title?: string;
  explanation: string;
  steps?: string;
  sampleSQL?: string;
}

export const fetchQuestionBySlug = async (
  slug: string
): Promise<QuestionDetail> => {
  const { data } = await api.get<QuestionDetail>(`/questions/${slug}`);
  return data;
};

export const runSQLQuery = async (
  slug: string,
  userSQL: string
): Promise<RunSQLResponse> => {
  const { data } = await api.post<RunSQLResponse>("/submissions/run", {
    slug,
    userSQL,
  });
  return data;
};

export const submitSQLQuery = async (
  slug: string,
  userSQL: string
): Promise<SubmitSQLResponse> => {
  const { data } = await api.post<SubmitSQLResponse>("/submissions/submit", {
    slug,
    userSQL,
  });
  return data;
};

export const getAIHelp = async (
  slug: string,
  userQuestion?: string
): Promise<AIHelpResponse> => {
  const { data } = await api.post<AIHelpResponse>(
    `/questions/${slug}/ai-help`,
    {
      question: userQuestion || "",
    }
  );
  return data;
};

export interface QuestionSummary {
  _id?: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string; // e.g. "Data Retrieval Queries"
  tags: string[]; // e.g. ["SELECT", "FROM", "WHERE"]
  createdAt?: string;
}

export const fetchQuestions = async (
  topic?: string
): Promise<QuestionSummary[]> => {
  // GET /api/questions/list-questions
  const { data } = await api.get<QuestionSummary[]>(
    "/questions/list-questions"
  );

  // Optional filter by category/topic on the frontend
  if (topic) {
    return data.filter((q) => q.category === topic);
  }

  return data;
};

export async function fetchSolutionBySlug(slug: string) {
  const res = await api.get(`/questions/${slug}/solution`, {
    withCredentials: true,
  });
  return res.data; // { solutionSQL: string, ... }
}

export const fetchProgressStats = async () => {
  const res = await api.get("/user/progress", { withCredentials: true });
  return res.data;
};
