import { EventUnit } from "./event-unit";
interface EventControllerHeuristic {
    label: string;
    description: string;
}
interface EventControllerOptions {
    heuristics?: EventControllerHeuristic[];
    verbose?: boolean;
}
export declare class EventController {
    private options;
    constructor(options?: EventControllerOptions);
    shouldRespond(eventUnit: EventUnit, eventBody: any): Promise<boolean>;
    respond(eventUnit: EventUnit, eventBody: any): Promise<any>;
}
export {};
