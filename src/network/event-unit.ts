import { EventEmitter } from "events";
import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import { StyledLogger } from "../lib";
import { Network } from "./network";
import { EventController } from "./event-controller";

type EventHandler = (eventBody: any) => void;

export class EventUnit extends EventEmitter {
  private eventUnitId: string;
  public name: string;
  public description: string;
  private eventHandlers: EventHandler[] = [];
  private verbose: boolean;
  private parentNetwork: Network | null;
  private eventController: EventController;

  constructor(name: string, description: string, verbose: boolean = false) {
    super();
    this.eventUnitId = uuidv4();
    this.name = name;
    this.description = description;
    this.verbose = verbose;
    this.parentNetwork = null;
    this.eventController = new EventController({ verbose });
  }

  public getEventUnitId(): string {
    return this.eventUnitId;
  }

  public setParentNetwork(network: Network): void {
    this.parentNetwork = network;
  }

  public getParentNetwork(): Readonly<Network> | null {
    return Object.freeze(this.parentNetwork) as Network;
  }

  public async registerEventHandler(handler: EventHandler): Promise<void> {
    StyledLogger.log("Registering event handler", chalk.blue);
    this.eventHandlers.push(handler);
    this.on("event", handler);
  }

  public async broadcastEvent(eventBody: any): Promise<void> {
    StyledLogger.log(
      `Broadcasting event [${this.name}]: ${JSON.stringify(eventBody)}`,
      chalk.yellowBright,
      this.verbose
    );
    this.emit("event", eventBody);
  }

  public async handleEvent(eventBody: any): Promise<void> {
    StyledLogger.log(
      `Handling event [${this.name}]: ${JSON.stringify(eventBody)}`,
      chalk.magentaBright,
      this.verbose
    );
    const response = await this.eventController.shouldRespond(this, eventBody);
    if (response) {
      StyledLogger.log(
        `Event Unit [${this.name}] is responding to the event.`,
        chalk.magentaBright,
        this.verbose
      );
      const responseEvent = await this.eventController.respond(this, eventBody);
      this.broadcastEvent(responseEvent);
    }
  }
}
