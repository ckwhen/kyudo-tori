import { type ActionResponse } from './types';

export const ERROR_CODES = {
  SYSTEM_UNKNOWN: "err_system_unknown",
  DB_OPERATION_FAILED: "err_db_operation_failed",
  COPY_OPERATION_FAILED: "err_copy_operation_failed",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export function parseServerError(error: unknown): ErrorCode {
  console.error("Server Operation Error:", error);

  if (error instanceof Error) {
    if (error.message.includes("database") || error.message.includes("drizzle")) {
      return ERROR_CODES.DB_OPERATION_FAILED;
    }
  }
  return ERROR_CODES.SYSTEM_UNKNOWN;
}

export async function safeDatabaseCall<T, M = Record<string, unknown>>(
  operation: () => Promise<{ data: T; meta: M }>
): Promise<ActionResponse<T, M>> {
  try {
    const response = await operation();

    return response;
  } catch (error: unknown) {
    const errorCode = parseServerError(error);
    return { errorCode };
  }
}
