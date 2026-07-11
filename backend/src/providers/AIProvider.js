export class AIProvider {
  async generateCompletion(prompt, options = {}) {
    throw new Error("generateCompletion() must be implemented by the provider");
  }
}
