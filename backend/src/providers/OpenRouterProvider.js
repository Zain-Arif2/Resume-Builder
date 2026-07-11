import { AIProvider } from './AIProvider.js';
import { env } from '../config/env.js';
import { aiLogger } from '../config/logger.js';
import { ApiError } from '../utils/ApiError.js';

export class OpenRouterProvider extends AIProvider {
  constructor() {
    super();
    this.baseUrl = env.ai.openrouter.baseUrl;
    this.apiKey = env.ai.openrouter.apiKey;
    this.model = env.ai.openrouter.model;
  }

  async generateCompletion(prompt, options = {}) {
    const start = Date.now();
    const model = options.model || this.model;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': env.clientUrl,
        'X-Title': 'AI Resume Builder',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 800,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      aiLogger.error({ status: response.status, errorBody }, 'OpenRouter request failed');
      throw ApiError.internal('AI provider request failed');
    }

    const data = await response.json();
    console.log("========== OPENROUTER RESPONSE ==========");
console.dir(data, { depth: null });
console.log("========================================");
    const durationMs = Date.now() - start;
    const content = data.choices?.[0]?.message?.content?.trim() || '';
    console.log("CONTENT:", JSON.stringify(content));
    const usage = data.usage || {};

    aiLogger.info(
      { model, durationMs, promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens },
      'AI completion generated'
    );

    return {
      content,
      model,
      usage: {
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0,
      },
      durationMs,
    };
  }
}
