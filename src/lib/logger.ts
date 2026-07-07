export function log(level: "info" | "warn" | "error", message: string, meta?: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {}),
  };

  if (process.env.APP_ENV === "production") {
    console.log(JSON.stringify(entry));
  } else {
    const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "ℹ️";
    console[level](`${prefix} ${message}`, meta ?? "");
  }
}
