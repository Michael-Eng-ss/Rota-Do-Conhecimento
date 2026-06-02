// Admin service does NOT connect to the database directly.
// It communicates with auth-service and game-service via HTTP.
// This file exists only for consistency with the other services.

export const AUTH_SERVICE_URL  = process.env.AUTH_SERVICE_URL  || 'http://localhost:4001';
export const GAME_SERVICE_URL  = process.env.GAME_SERVICE_URL  || 'http://localhost:4002';
export const QUIZ_SERVICE_URL  = process.env.QUIZ_SERVICE_URL  || 'http://localhost:4003';
export const INFRA_SERVICE_URL = process.env.INFRA_SERVICE_URL || 'http://localhost:4005';
