import { EventEmitter } from "events";
import { Network } from "./network";
type EventHandler = (eventBody: any) => void;
export declare class EventUnit extends EventEmitter {
    private eventUnitId;
    name: string;
    description: string;
    private eventHandlers;
    private verbose;
    private parentNetwork;
    private eventController;
    constructor(name: string, description: string, verbose?: boolean);
    getEventUnitId(): string;
    setParentNetwork(network: Network): void;
    getParentNetwork(): Readonly<Network> | null;
    registerEventHandler(handler: EventHandler): Promise<void>;
    broadcastEvent(eventBody: any): Promise<void>;
    handleEvent(eventBody: any): Promise<void>;
}
export {};
