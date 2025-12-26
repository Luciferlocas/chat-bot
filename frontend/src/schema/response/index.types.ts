import { z } from "zod";
import { ClientResponseSchema, ResponseErrorSchema } from ".";

export type ResponseError = z.infer<typeof ResponseErrorSchema>;

export type ClientResponse<T> = z.infer<
  ReturnType<typeof ClientResponseSchema<T>>
>;
