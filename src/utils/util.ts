import { Schema } from "../../typings/types";

export * from "./date";
export * from "./color";

export const validateSchema = <T extends Schema>(schema: T[]): T[] => {
    return schema.filter((s): s is T => s.isValid());
  }
  