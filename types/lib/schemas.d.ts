import z from "zod";
export declare const schemas: {
    eventUnitSchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
    }, {
        name: string;
        description: string;
    }>;
    networkSchema: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        eventUnits: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
        }, {
            name: string;
            description: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        description: string;
        title: string;
        eventUnits: {
            name: string;
            description: string;
        }[];
    }, {
        description: string;
        title: string;
        eventUnits: {
            name: string;
            description: string;
        }[];
    }>;
    eniShouldRespondSchema: z.ZodObject<{
        shouldRespond: z.ZodBoolean;
        explanation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        shouldRespond: boolean;
        explanation: string;
    }, {
        shouldRespond: boolean;
        explanation: string;
    }>;
    eventResponseSchema: z.ZodObject<{
        eventId: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        eventId: string;
        metadata?: Record<string, any> | undefined;
    }, {
        name: string;
        description: string;
        eventId: string;
        metadata?: Record<string, any> | undefined;
    }>;
};
