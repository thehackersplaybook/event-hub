interface CliOptions {
    verbose?: boolean;
    prompt?: string;
    env?: string;
}
export declare class Cli {
    private static instance;
    private static DEFAULT_VERBOSE;
    private options;
    private verbose;
    private program;
    private commandMap;
    private constructor();
    private loadEnv;
    private loadDotenvFromPath;
    private loadDotenvDefault;
    private initProgram;
    private initCommandMap;
    private start;
    static getInstance(options?: CliOptions): Cli;
    run(): Promise<void>;
}
export {};
