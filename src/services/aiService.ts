/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CelebrationEvent } from '../types/event';

export interface GeneratePlanPayload {
  eventType: string;
  title: string;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  styleVibe: string;
  specialRequirements?: string;
}

export interface RefineRecommendation {
  title: string;
  description: string;
  impact?: string;
}

export interface RefineSectionResponse {
  recommendations: RefineRecommendation[];
  summaryNotes: string;
}

export class AiServiceError extends Error {
  public statusCode?: number;
  public isRateLimited: boolean;

  constructor(message: string, statusCode?: number, isRateLimited = false) {
    super(message);
    this.name = 'AiServiceError';
    this.statusCode = statusCode;
    this.isRateLimited = isRateLimited;
  }
}

/**
 * Service to orchestrate server-side GenAI operations with strict typing and timeout protection.
 */
export const aiService = {
  /**
   * Generates a complete celebration blueprint via Gemini 3.8 Flash.
   */
  async generateEventBlueprint(
    payload: GeneratePlanPayload,
    timeoutMs = 60000
  ): Promise<Partial<CelebrationEvent>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch('/api/ai/generate-event-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        throw new AiServiceError(
          'AI generation rate limit reached. Please wait a few moments before submitting again.',
          429,
          true
        );
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new AiServiceError(
          errJson.error || `Server returned error (${response.status})`,
          response.status
        );
      }

      const data = await response.json();
      if (!data.success || !data.plan) {
        throw new AiServiceError(data.error || 'Invalid blueprint payload received.');
      }

      return data.plan;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof AiServiceError) {
        throw err;
      }
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new AiServiceError('AI Blueprint request timed out. Please try again.', 408);
      }
      throw new AiServiceError(
        err instanceof Error ? err.message : 'Failed to connect to AI planning service.'
      );
    }
  },

  /**
   * Refines a specific event planning section with targeted expert recommendations.
   */
  async refineSection(
    eventContext: {
      title: string;
      type: string;
      guestCount: number;
      totalBudget: number;
      currency: string;
    },
    sectionName: string,
    instruction: string,
    timeoutMs = 30000
  ): Promise<RefineSectionResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch('/api/ai/refine-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventContext, sectionName, instruction }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        throw new AiServiceError('Too many AI requests. Please slow down.', 429, true);
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new AiServiceError(
          errJson.error || `Server error during refinement (${response.status})`,
          response.status
        );
      }

      const data = await response.json();
      return (
        data.result || {
          recommendations: [],
          summaryNotes: 'No recommendations generated.',
        }
      );
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof AiServiceError) throw err;
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new AiServiceError('Refinement request timed out.', 408);
      }
      throw new AiServiceError(
        err instanceof Error ? err.message : 'Refinement service unavailable.'
      );
    }
  },
};
