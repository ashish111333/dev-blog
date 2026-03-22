import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __devBlogSql: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL;
export const hasDatabase = Boolean(connectionString);

export function getSql() {
  if (!connectionString) {
    return null;
  }

  const sql =
    global.__devBlogSql ??
    postgres(connectionString, {
      ssl: "require",
      max: 1
    });

  if (process.env.NODE_ENV !== "production") {
    global.__devBlogSql = sql;
  }

  return sql;
}
