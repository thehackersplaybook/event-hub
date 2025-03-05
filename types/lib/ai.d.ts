import { generateObject, generateText, LanguageModel } from "ai";
export declare function getAIModel(modelName: string): LanguageModel;
export declare const ai: {
    getAIModel: typeof getAIModel;
    generateObject: typeof generateObject;
    generateText: typeof generateText;
};
