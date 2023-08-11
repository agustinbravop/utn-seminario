import Decimal from "decimal.js";
import { z } from "zod";

export const decimalSchema = z.custom<Decimal>(
  (value: unknown) => new Decimal(value as Decimal.Value)
);
