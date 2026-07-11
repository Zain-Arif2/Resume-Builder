import { OpenRouterProvider } from './OpenRouterProvider.js';
import { env } from '../config/env.js';

let providerInstance;

export function getAIProvider() {
  if (providerInstance) return providerInstance;

  switch (env.ai.provider) {
    case 'openrouter':
      providerInstance = new OpenRouterProvider();
      break;
    // Future: case 'gemini': providerInstance = new GeminiProvider(); break;
    // Future: case 'openai': providerInstance = new OpenAIProvider(); break;
    default:
      throw new Error(`Unknown AI provider: ${env.ai.provider}`);
  }

  return providerInstance;
}
