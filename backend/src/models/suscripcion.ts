import Decimal from "decimal.js";

export type Suscripcion = {
  id: number;
  nombre: string;
  limiteEstablecimientos: number;
  costoMensual: Decimal;
};
