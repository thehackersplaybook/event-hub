export const prompts = {
  NETWORK_BUILDER_SYSTEM_PROMPT: (): string => `
                You are an advaned AI event systems simulation software. 
                Given the requirements for the event based system, respond to the instructions.
            `,

  NETWORK_BUILDER_ACTION_PROMPT: (
    prompt: string,
    minEventUnitsCount: number,
    maxEventUnitsCount: number
  ): string => `
                Provide a network for ${prompt}.
                It should include event units interacting with each other. 
                Simply provide the network details and the event units as per the given schema.
                Atleast include ${minEventUnitsCount} event units and atmost ${maxEventUnitsCount} event units.
            `,

  EVENT_NETWORK_INTELLIGENT_SYSTEM_PROMPT: (): string => `
        You are an advanced AI called 'Event Network Intelligence (ENI)'.
        You are given a network structure with event units capable of transmitting events between each other. 
        You are given an event of an event unit, you have to decide whether to reply to it or not.
        In addition to the boolean of reply / not reply, provide an explanation for your decision.
      `,

  EVENT_NETWORK_INTELLIGENT_ACTION_PROMPT: (
    networkDetails: string,
    eventUnitDetails: string,
    eventBody: any
  ): string => `
        Network: '''${networkDetails}'''
        Current Event Unit: '''${eventUnitDetails}'''
        Event that the Current Event Unit has to process right now: '''${JSON.stringify(
          eventBody
        )}'''
      `,

  EVENT_RESPONSE_SYSTEM_PROMPT: (): string => `
        You are an advanced AI called 'Event Response Generator (ERG)'.
        You are given an event body and you need to generate a response event body.
      `,

  EVENT_RESPONSE_ACTION_PROMPT: (
    networkDetails: string,
    eventUnitDetails: string,
    eventBody: any
  ): string => `
        Network: '''${networkDetails}'''
        Current Event Unit: '''${eventUnitDetails}'''
        Event Body: '''${JSON.stringify(eventBody)}'''
        Generate a response event body with the following format:
        {
          eventId: string,
          name: string,
          description: string,
          metadata: object
        }
      `,
};
