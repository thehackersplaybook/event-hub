export declare const prompts: {
    NETWORK_BUILDER_SYSTEM_PROMPT: () => string;
    NETWORK_BUILDER_ACTION_PROMPT: (prompt: string, minEventUnitsCount: number, maxEventUnitsCount: number) => string;
    EVENT_NETWORK_INTELLIGENT_SYSTEM_PROMPT: () => string;
    EVENT_NETWORK_INTELLIGENT_ACTION_PROMPT: (networkDetails: string, eventUnitDetails: string, eventBody: any) => string;
    EVENT_RESPONSE_SYSTEM_PROMPT: () => string;
    EVENT_RESPONSE_ACTION_PROMPT: (networkDetails: string, eventUnitDetails: string, eventBody: any) => string;
    GENERATE_EVENT_ACTION_PROMPT: (networkDetails: string, eventUnitDetails: string, eventLogs: any[]) => string;
};
