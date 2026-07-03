// Phase 2 switchover: when NEXT_PUBLIC_API_BASE_URL is set, all judgment
// traffic goes to the standalone backend; otherwise the Next.js route
// handlers in src/app/api/* serve the same contract.
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const apiUrl = (path: string) => `${API_BASE}${path}`;
