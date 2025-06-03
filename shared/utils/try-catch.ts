/**
 * Represents a successful operation result
 * @template T - The type of the successful data
 */
type Success<T> = {
  data: T;
  error: null;
};

/**
 * Represents a failed operation result
 * @template E - The type of the error
 */
type Failure<E> = {
  data: null;
  error: E;
};

/**
 * Union type representing either a successful or failed operation result
 * @template T - The type of the successful data
 * @template E - The type of the error (defaults to Error)
 */
type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Wraps an async operation in a try-catch block and returns a Result type
 * instead of throwing errors. This allows for safer error handling without
 * needing explicit try-catch blocks in calling code.
 * 
 * @template T - The type of the successful data
 * @template E - The type of the error (defaults to Error)
 * @param promise - The promise to execute safely
 * @returns A Promise that resolves to either Success or Failure result
 * 
 * @example
 * ```typescript
 * const result = await tryCatch(fetch('/api/data'));
 * if (result.error) {
 *   console.error('Request failed:', result.error);
 * } else {
 *   console.log('Data:', result.data);
 * }
 * ```
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

/**
 * Synchronous version of tryCatch for non-async operations.
 * Wraps a synchronous function call in a try-catch block and returns
 * a Result type instead of throwing errors.
 * 
 * @template T - The type of the successful data
 * @template E - The type of the error (defaults to Error)
 * @param fn - The synchronous function to execute safely
 * @returns Either Success or Failure result
 * 
 * @example
 * ```typescript
 * const result = tryCatchSync(() => JSON.parse(jsonString));
 * if (result.error) {
 *   console.error('Parse failed:', result.error);
 * } else {
 *   console.log('Parsed data:', result.data);
 * }
 * ```
 */
export function tryCatchSync<T, E = Error>(
  fn: () => T,
): Result<T, E> {
  try {
    const data = fn();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

/**
 * Export types for use in other files
 */
export type { Result, Success, Failure }; 