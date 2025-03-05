import { generateObject, generateText, LanguageModel } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

const models: any = {
  openai,
  anthropic,
};

export function getAIModel(modelName: string): LanguageModel {
  const [provider, model] = modelName.split("/");
  if (!models[provider]) {
    throw new Error(`Provider ${provider} not found.`);
  }

  return models[provider](model);
}

export const ai = {
  getAIModel,
  generateObject,
  generateText,
};
