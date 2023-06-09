import { Suscripcion } from "./suscripcion";
import { Tarjeta } from "./tarjeta";

export type Administrador = {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  usuario: string;
  tarjeta: Tarjeta;
  suscripcion: Suscripcion | null;
};
