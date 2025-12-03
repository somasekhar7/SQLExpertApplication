import {
  Database,
  Filter,
  BarChart3,
  Layers,
  Link,
  Type,
  GitMerge,
  Search,
  FileCode,
  Calendar,
  Database as DatabaseIcon,
  SplitSquareVertical,
  ListFilter,
  Blocks,
  Table2,
  Settings,
  Lock,
  Eye,
  Gauge,
  FileCog,
} from "lucide-react";

export interface SqlTopic {
  id: string;
  title: string;
  description: string;
  problemCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  icon: React.ComponentType<{ className?: string }>;
  completed?: number;
  category: "fundamentals" | "intermediate" | "advanced";
  concepts: string;
}

export const sqlTopics: SqlTopic[] = [
  // ============================================
  // FUNDAMENTALS
  // ============================================
  {
    id: "data-retrieval",
    title: "Data Retrieval Queries",
    description:
      "Learn how to retrieve data using SELECT, FROM, and WHERE — the foundation of SQL.",
    problemCount: 10,
    difficulty: "Easy",
    estimatedTime: "15–20 min",
    icon: Database,
    category: "fundamentals",
    concepts: "SELECT, FROM, WHERE",
  },
  {
    id: "filtering-sorting",
    title: "Filtering and Sorting Data",
    description:
      "Master ORDER BY, DISTINCT, LIMIT, BETWEEN, and IN to control result sets.",
    problemCount: 10,
    difficulty: "Easy",
    estimatedTime: "20–30 min",
    icon: Filter,
    category: "fundamentals",
    concepts: "ORDER BY, DISTINCT, LIMIT, BETWEEN, IN",
  },
  {
    id: "aggregation-summary",
    title: "Aggregation and Summary Functions",
    description: "Compute aggregates using COUNT, SUM, AVG, MIN, and MAX.",
    problemCount: 10,
    difficulty: "Easy",
    estimatedTime: "25–30 min",
    icon: BarChart3,
    category: "fundamentals",
    concepts: "COUNT, SUM, AVG, MIN, MAX",
  },
  {
    id: "grouping-conditional",
    title: "Grouping and Conditional Aggregation",
    description: "Group records and filter groups using GROUP BY and HAVING.",
    problemCount: 10,
    difficulty: "Medium",
    estimatedTime: "30–40 min",
    icon: Layers,
    category: "fundamentals",
    concepts: "GROUP BY, HAVING",
  },
  {
    id: "intro-joins",
    title: "Introductory Joins",
    description:
      "Learn INNER JOIN, LEFT JOIN, and basic multi-table structures.",
    problemCount: 10,
    difficulty: "Medium",
    estimatedTime: "30–40 min",
    icon: Link,
    category: "fundamentals",
    concepts: "INNER JOIN, LEFT JOIN",
  },
  {
    id: "aliasing-core-functions",
    title: "Column Aliasing & Core SQL Functions",
    description: "Use AS, CONCAT, LENGTH, LOWER, UPPER and transform data.",
    problemCount: 10,
    difficulty: "Easy",
    estimatedTime: "20–25 min",
    icon: Type,
    category: "fundamentals",
    concepts: "AS, CONCAT, LENGTH, UPPER, LOWER",
  },

  // ============================================
  // INTERMEDIATE
  // ============================================
  {
    id: "advanced-joins-multitable",
    title: "Advanced Joins & Multi-Table Logic",
    description:
      "Work with FULL OUTER JOIN, CROSS JOIN, multi-table queries, and join chaining.",
    problemCount: 6,
    difficulty: "Medium",
    estimatedTime: "45–60 min",
    icon: GitMerge,
    category: "intermediate",
    concepts: "FULL OUTER JOIN, CROSS JOIN",
  },
  {
    id: "subqueries-nested-logic",
    title: "Subqueries & Nested Logic",
    description:
      "Use subqueries, correlated queries, EXISTS, and advanced nesting.",
    problemCount: 10,
    difficulty: "Medium",
    estimatedTime: "45–60 min",
    icon: Search,
    category: "intermediate",
    concepts: "IN, EXISTS, Correlated Subqueries",
  },
  {
    id: "conditional-expressions",
    title: "Conditional Expressions",
    description: "Implement business logic with CASE WHEN THEN ELSE END.",
    problemCount: 10,
    difficulty: "Medium",
    estimatedTime: "25–35 min",
    icon: FileCode,
    category: "intermediate",
    concepts: "CASE, WHEN, ELSE",
  },
  {
    id: "string-date-manipulation",
    title: "String & Date Manipulation",
    description:
      "Use SUBSTRING, REPLACE, DATE(), STRFTIME(), EXTRACT, formatting functions.",
    problemCount: 10,
    difficulty: "Easy",
    estimatedTime: "25–35 min",
    icon: Calendar,
    category: "intermediate",
    concepts: "SUBSTRING, REPLACE, DATE, EXTRACT",
  },
  {
    id: "dml-operations",
    title: "DML Operations",
    description:
      "Perform INSERT, UPDATE, DELETE — core table modification operations.",
    problemCount: 6,
    difficulty: "Medium",
    estimatedTime: "35–45 min",
    icon: DatabaseIcon,
    category: "intermediate",
    concepts: "INSERT, UPDATE, DELETE",
  },
  {
    id: "ddl-operations",
    title: "DDL Operations",
    description: "Create and modify schemas using CREATE, DROP, ALTER.",
    problemCount: 5,
    difficulty: "Medium",
    estimatedTime: "35–45 min",
    icon: FileCog,
    category: "intermediate",
    concepts: "CREATE, ALTER, DROP",
  },
  {
    id: "sorting-pagination",
    title: "Sorting & Pagination",
    description:
      "Master advanced ordering, sorting, limits, offsets, and page slicing.",
    problemCount: 7,
    difficulty: "Medium",
    estimatedTime: "20–30 min",
    icon: ListFilter,
    category: "intermediate",
    concepts: "ORDER BY, LIMIT, OFFSET",
  },
  {
    id: "set-operations",
    title: "Set Operations",
    description: "Use UNION, INTERSECT, EXCEPT to combine datasets.",
    problemCount: 6,
    difficulty: "Medium",
    estimatedTime: "25–35 min",
    icon: Blocks,
    category: "intermediate",
    concepts: "UNION, INTERSECT, EXCEPT",
  },
  {
    id: "window-functions",
    title: "Window Functions",
    description:
      "Perform ranking, running totals, partitions, LAG/LEAD operations.",
    problemCount: 7,
    difficulty: "Hard",
    estimatedTime: "1–1.5 hours",
    icon: Table2,
    category: "intermediate",
    concepts: "ROW_NUMBER, RANK, LAG, LEAD",
  },
  {
    id: "complex-aggregation",
    title: "Complex Aggregation Patterns",
    description:
      "Solve multi-step aggregated queries using nested GROUP BY and multi-level summaries.",
    problemCount: 5,
    difficulty: "Medium",
    estimatedTime: "45–60 min",
    icon: SplitSquareVertical,
    category: "intermediate",
    concepts: "Nested GROUP BY, multi-step aggregates",
  },

  // ============================================
  // ADVANCED
  // ============================================
  {
    id: "cte",
    title: "CTE",
    description:
      "Build powerful recursive and non-recursive with CTEs using the WITH clause.",
    problemCount: 6,
    difficulty: "Hard",
    estimatedTime: "1–1.5 hours",
    icon: Blocks,
    category: "advanced",
    concepts: "WITH, Recursive CTE",
  },
  {
    id: "query-optimization",
    title: "Query Optimization",
    description:
      "Optimize performance using indices, execution plans, and cost-based improvements.",
    problemCount: 5,
    difficulty: "Hard",
    estimatedTime: "1 hour",
    icon: Settings,
    category: "advanced",
    concepts: "EXPLAIN PLAN, Indexing",
  },
  {
    id: "triggers",
    title: "Triggers",
    description: "Automate table behavior with BEFORE/AFTER triggers.",
    problemCount: 6,
    difficulty: "Hard",
    estimatedTime: "45–60 min",
    icon: FileCog,
    category: "advanced",
    concepts: "CREATE TRIGGER, BEFORE, AFTER",
  },
  {
    id: "stored-procedures",
    title: "Stored Procedures",
    description: "Build reusable logic using stored procedures and parameters.",
    problemCount: 2,
    difficulty: "Hard",
    estimatedTime: "45–60 min",
    icon: Settings,
    category: "advanced",
    concepts: "CREATE PROCEDURE, EXEC",
  },
  {
    id: "transactions",
    title: "Transactions",
    description:
      "Understand ACID, savepoints, commits, rollbacks, and multi-operation safety.",
    problemCount: 4,
    difficulty: "Hard",
    estimatedTime: "45–60 min",
    icon: Lock,
    category: "advanced",
    concepts: "COMMIT, ROLLBACK, SAVEPOINT",
  },
  {
    id: "security",
    title: "Security",
    description:
      "Explore SQL permissions, privileges, roles, and secure operations.",
    problemCount: 4,
    difficulty: "Hard",
    estimatedTime: "45 min",
    icon: Eye,
    category: "advanced",
    concepts: "GRANT, REVOKE, ROLES",
  },
  {
    id: "views",
    title: "Views",
    description:
      "Build reusable virtual tables using VIEWs for structured querying.",
    problemCount: 4,
    difficulty: "Hard",
    estimatedTime: "30–40 min",
    icon: Table2,
    category: "advanced",
    concepts: "CREATE VIEW, REPLACE VIEW",
  },
  {
    id: "performance",
    title: "Performance",
    description:
      "Analyze DB performance, caching, query cost, and advanced tuning.",
    problemCount: 3,
    difficulty: "Hard",
    estimatedTime: "45–60 min",
    icon: Gauge,
    category: "advanced",
    concepts: "Query cost, Index tuning",
  },
  {
    id: "case-study",
    title: "Case Study",
    description: "End-to-end SQL problem sets covering business scenarios.",
    problemCount: 6,
    difficulty: "Hard",
    estimatedTime: "2–3 hours",
    icon: FileCog,
    category: "advanced",
    concepts: "End-to-End Problem Solving",
  },
];
