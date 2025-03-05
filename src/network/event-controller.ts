import { ai, prompts, schemas, StyledLogger } from "../lib";
import { EventUnit } from "./event-unit";
import chalk from "chalk";

interface EventControllerHeuristic {
  label: string;
  description: string;
}

interface EventControllerOptions {
  heuristics?: EventControllerHeuristic[];
  verbose?: boolean;
}

export class EventController {
  private options: EventControllerOptions;

  constructor(options?: EventControllerOptions) {
    this.options = options || {
      heuristics: [],
      verbose: false,
    };
  }

  public async shouldRespond(
    eventUnit: EventUnit,
    eventBody: any
  ): Promise<boolean> {
    try {
      const network = eventUnit.getParentNetwork();
      const networkDetails = JSON.stringify(network?.getNetworkDetails());
      const eventUnitDetails = JSON.stringify({
        id: eventUnit.getEventUnitId(),
        name: eventUnit.name,
        description: eventUnit.description,
      });

      const { object } = await ai.generateObject({
        model: ai.getAIModel("openai/gpt-4o"),
        system: prompts.EVENT_NETWORK_INTELLIGENT_SYSTEM_PROMPT(),
        prompt: prompts.EVENT_NETWORK_INTELLIGENT_ACTION_PROMPT(
          networkDetails,
          eventUnitDetails,
          eventBody
        ),
        schema: schemas.eniShouldRespondSchema,
      });

      const shouldRespond = object.shouldRespond;

      StyledLogger.log(
        `ENI[${
          eventUnit.name
        }] has decided that the event unit should respond: ${
          shouldRespond ? "Yes" : "No"
        }`,
        chalk.cyanBright,
        this.options.verbose
      );

      StyledLogger.log(
        `ENI[${eventUnit.name}] Explanation: ${object.explanation}`,
        chalk.cyanBright,
        this.options.verbose
      );

      return shouldRespond;
    } catch (error) {
      StyledLogger.logError(
        "Failed to check decision for responding, defaulting to random behaviour.",
        chalk.red,
        this.options.verbose
      );
      const shouldRespond = Math.random() > 0.5;
      return shouldRespond;
    }
  }

  public async respond(eventUnit: EventUnit, eventBody: any): Promise<any> {
    try {
      const network = eventUnit.getParentNetwork();
      const networkDetails = JSON.stringify(network?.getNetworkDetails());
      const eventUnitDetails = JSON.stringify({
        id: eventUnit.getEventUnitId(),
        name: eventUnit.name,
        description: eventUnit.description,
      });

      const { object } = await ai.generateObject({
        model: ai.getAIModel("openai/gpt-4o"),
        system: prompts.EVENT_RESPONSE_SYSTEM_PROMPT(),
        prompt: prompts.EVENT_RESPONSE_ACTION_PROMPT(
          networkDetails,
          eventUnitDetails,
          eventBody
        ),
        schema: schemas.eventResponseSchema,
      });

      const responseEventBody = {
        eventId: object.eventId,
        name: object.name,
        description: object.description,
        metadata: object.metadata,
      };

      StyledLogger.log(
        `Generated response event body: ${JSON.stringify(responseEventBody)}`,
        chalk.greenBright,
        this.options.verbose
      );

      return responseEventBody;
    } catch (error) {
      StyledLogger.logError(
        "Failed to generate response event body.",
        chalk.red,
        this.options.verbose
      );
      throw error;
    }
  }
}
