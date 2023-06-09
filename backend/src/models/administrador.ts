import { Suscripcion } from "./suscripcion.js";
import { Tarjeta } from "./tarjeta.js";

export type Administrador = {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  usuario: string;
  tarjeta: Tarjeta;
  suscripcion: Suscripcion;
};
