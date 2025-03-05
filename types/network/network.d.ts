import { EventUnit } from "./event-unit";
export declare class Network {
    private networkId;
    title: string;
    description: string;
    private eventUnits;
    private verbose;
    private static EVENT_UNITS_COUNT_MIN;
    private static EVENT_UNITS_COUNT_MAX;
    constructor(title: string, description: string, eventUnits: EventUnit[], verbose?: boolean);
    getNetworkId(): string;
    private connectEventUnits;
    static fromPrompt(prompt: string, verbose?: boolean): Promise<Network | null>;
    start(): Promise<void>;
    getNetworkDetails(): object;
}
