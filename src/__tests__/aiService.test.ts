/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { AiServiceError } from '../services/aiService';

describe('AiService and Error Handling', () => {
  it('instantiates AiServiceError with message, status code, and rate limit flag', () => {
    const error = new AiServiceError('Rate limit exceeded', 429, true);
    expect(error.message).toBe('Rate limit exceeded');
    expect(error.statusCode).toBe(429);
    expect(error.isRateLimited).toBe(true);
    expect(error.name).toBe('AiServiceError');
    expect(error instanceof Error).toBe(true);
  });

  it('supports non-rate-limited generic server error states', () => {
    const error = new AiServiceError('Internal server error', 500);
    expect(error.message).toBe('Internal server error');
    expect(error.statusCode).toBe(500);
    expect(error.isRateLimited).toBe(false);
  });
});
