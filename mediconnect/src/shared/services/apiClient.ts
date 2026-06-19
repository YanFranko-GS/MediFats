import type { ApiResponse } from '../types';

// Simulated async client that mimics real HTTP behavior
const MIN_DELAY = 400;
const MAX_DELAY = 1200;
const ERROR_PROBABILITY = 0.04; // 4%

function randomDelay(): number {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
}

export async function apiClient<T>(
  operation: () => T,
  options: {
    errorProbability?: number;
    delay?: number;
    errorMessage?: string;
  } = {}
): Promise<ApiResponse<T>> {
  const {
    errorProbability = ERROR_PROBABILITY,
    delay = randomDelay(),
    errorMessage = 'Error simulado del servidor. Por favor reintenta.',
  } = options;

  await new Promise((resolve) => setTimeout(resolve, delay));

  // Simulate random errors
  if (Math.random() < errorProbability) {
    throw new Error(errorMessage);
  }

  const data = operation();
  return { data, success: true };
}

// Paginate helper for mock data
export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 20
): { items: T[]; total: number; totalPages: number } {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize),
  };
}
