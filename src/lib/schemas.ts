import z from "zod";

const eventUnitSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const networkSchema = z.object({
  title: z.string(),
  description: z.string(),
  eventUnits: z.array(eventUnitSchema),
});

const eniShouldRespondSchema = z.object({
  shouldRespond: z.boolean(),
  explanation: z.string(),
});

const eventResponseSchema = z.object({
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
  metadata: z.record(z.any()).optional(),
});

export const schemas = {
  eventUnitSchema,
  networkSchema,
  eniShouldRespondSchema,
  eventResponseSchema,
};
