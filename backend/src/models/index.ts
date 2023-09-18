import Decimal from "decimal.js";
import { z } from "zod";

export const decimalSchema = z.custom<Decimal>((value) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  return new Decimal(value as Decimal.Value);
});
