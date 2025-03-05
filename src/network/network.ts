import { EventUnit } from "./event-unit";
import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import { ai, prompts, schemas, StyledLogger } from "../lib";

export class Network {
  private networkId: string;
  public title: string;
  public description: string;
  private eventUnits: EventUnit[];
  private verbose: boolean;
  private static EVENT_UNITS_COUNT_MIN = 2;
  private static EVENT_UNITS_COUNT_MAX = 10;

  constructor(
    title: string,
    description: string,
    eventUnits: EventUnit[],
    verbose: boolean = false
  ) {
    this.networkId = uuidv4();
    this.title = title;
    this.description = description;
    this.eventUnits = eventUnits;
    this.verbose = verbose;
    this.connectEventUnits();
  }

  public getNetworkId(): string {
    return this.networkId;
  }

  private connectEventUnits(): void {
    StyledLogger.log("Connecting event units.", chalk.blue, this.verbose);

    this.eventUnits.forEach((unit) => {
      unit.setParentNetwork(this);
    });

    this.eventUnits.forEach((unit) => {
      this.eventUnits.forEach((otherUnit) => {
        if (unit !== otherUnit) {
          unit.registerEventHandler(async (eventBody) => {
            StyledLogger.log(
              `Event received by ${unit.name} from ${
                otherUnit.name
              }: ${JSON.stringify(eventBody)}`,
              chalk.green,
              this.verbose
            );
            await otherUnit.handleEvent(eventBody);
          });
        }
      });
    });
  }

  public static async fromPrompt(
    prompt: string,
    verbose = false
  ): Promise<Network | null> {
    try {
      if (verbose) {
        StyledLogger.log(
          `Generating network from prompt: '${prompt}'...`,
          chalk.green,
          verbose
        );
      }

      const { object } = await ai.generateObject({
        model: ai.getAIModel("openai/gpt-4o"),
        system: prompts.NETWORK_BUILDER_SYSTEM_PROMPT(),
        prompt: prompts.NETWORK_BUILDER_ACTION_PROMPT(
          prompt,
          Network.EVENT_UNITS_COUNT_MIN,
          Network.EVENT_UNITS_COUNT_MAX
        ),
        schema: schemas.networkSchema,
      });

      if (verbose) {
        StyledLogger.log(
          `Network object generated from '${prompt}': ${JSON.stringify(
            object,
            null,
            2
          )}`,
          chalk.green,
          verbose
        );
      }

      const network = new Network(
        object.title,
        object.description,
        object.eventUnits.map(
          (unit: { name: string; description: string }) =>
            new EventUnit(unit.name, unit.description, verbose)
        )
      );

      return network;
    } catch (error) {
      StyledLogger.logError(
        `Error creating network from prompt - '${prompt}': ${String(error)}`,
        chalk.red,
        verbose
      );
      console.error(error);
      return null;
    }
  }

  public async start(): Promise<void> {
    try {
      StyledLogger.log("Starting network.", chalk.green);
      const randomEventUnit =
        this.eventUnits[Math.floor(Math.random() * this.eventUnits.length)];
      const { object: randomEvent } = await ai.generateObject({
        model: ai.getAIModel("openai/gpt-4o"),
        system: prompts.EVENT_RESPONSE_SYSTEM_PROMPT(),
        prompt: prompts.EVENT_RESPONSE_ACTION_PROMPT(
          JSON.stringify(this.getNetworkDetails()),
          JSON.stringify({
            id: randomEventUnit.getEventUnitId(),
            name: randomEventUnit.name,
            description: randomEventUnit.description,
          }),
          {
            eventId: uuidv4(),
            name: "INIT_EVENT",
            description:
              "This is the start event which is invisible, generate the 'INIT_EVENT' as a response to this event.",
            metadata: {},
          }
        ),
        schema: schemas.eventResponseSchema,
      });
      randomEventUnit.broadcastEvent(randomEvent);
    } catch (error) {
      StyledLogger.logError("Failed to start network.", chalk.red);
      console.error(error);
      process.exit(1);
    }
  }

  public getNetworkDetails(): object {
    return {
      networkId: this.networkId,
      title: this.title,
      description: this.description,
      eventUnits: this.eventUnits.map((unit) => ({
        name: unit.name,
        description: unit.description,
        parentNetwork: unit.getParentNetwork()?.getNetworkId(),
      })),
    };
  }
}
