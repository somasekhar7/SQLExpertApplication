import Database from "better-sqlite3";

/**
 * Allow only safe SQL depending on mode.
 *
 * mode = "read":
 *   - Only SELECT / WITH
 *   - No INSERT/UPDATE/DELETE/DDL/transactions
 *
 * mode = "write":
 *   - Allow DDL/DML needed for exercises (CREATE/INSERT/UPDATE/DELETE/etc.)
 *   - Still block dangerous stuff (ATTACH, PRAGMA, VACUUM)
 */
export function isQuerySafe(sql, mode = "read") {
  const cleaned = sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();

  // Only one statement allowed
  if (cleaned.split(";").filter(Boolean).length > 1) return false;

  if (mode === "read") {
    // Read Mode → SELECT/WITH only
    const forbiddenRead =
      /\b(insert|update|delete|create|drop|alter|replace|pragma|attach|detach|vacuum|begin|commit|rollback)\b/i;

    if (forbiddenRead.test(cleaned)) return false;

    return /^\s*(with|select)\b/i.test(cleaned);
  }

  if (mode === "write") {
    // Write mode → Allow CREATE TRIGGER, VIEW, INSERT, UPDATE, etc.
    // But block dangerous DB ops
    const forbiddenWrite =
      /\b(attach|detach|vacuum|pragma|alter\s+database|drop\s+database)\b/i;

    if (forbiddenWrite.test(cleaned)) return false;

    // Write mode allows almost anything safe
    return true;
  }

  return false;
}

export function normalizeRows(rows) {
  return rows.map((r) => {
    const obj = {};
    Object.keys(r)
      .sort()
      .forEach((k) => {
        const v = r[k];
        if (v instanceof Date) obj[k] = v.toISOString();
        else if (typeof v === "bigint") obj[k] = v.toString();
        else if (typeof v === "number") {
          // ⭐ FIX: stabilize SQLite floating numbers
          obj[k] = Number(v.toFixed(2));
        } else obj[k] = v;
      });
    return obj;
  });
}

export function sortRowsForCompare(rows) {
  const key = (o) => JSON.stringify(o);
  return [...rows].sort((a, b) =>
    key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0
  );
}

export function runInIsolatedSQLite({ setupSQL, userSQL, maxRows = 1000 }) {
  const db = new Database(":memory:");

  try {
    db.exec(setupSQL);

    const trimmed = userSQL.trim().replace(/;+\s*$/, "");

    if (/^\s*(select|with)\b/i.test(trimmed)) {
      // // Query mode
      // const rows = db.prepare(trimmed + ` LIMIT ${maxRows}`).all();
      // return { rows };
      // If user already included LIMIT, do not append another one
      let finalSQL = trimmed;

      const hasLimit = /\blimit\b/i.test(trimmed);
      if (!hasLimit) {
        finalSQL += ` LIMIT ${maxRows}`;
      }

      const rows = db.prepare(finalSQL).all();
      return { rows };
    } else {
      // Command mode
      db.exec(trimmed);
      return { rows: [] };
    }
  } finally {
    db.close();
  }
}
