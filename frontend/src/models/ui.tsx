import { Disponibilidad, Suscripcion } from ".";

export type SuscripcionUI = Suscripcion & {
  icono: React.ReactElement;
};

/**
 * Agrega 'minutosReserva' para que el usuario no tenga que crear
 * muchas disponibilidades repetitivas.
 * La Disponibilidad del back end no tiene el campo 'minutosReserva'.
 *
 * Una disponibilidad ingresada por el usuario en el form que sea
 *  de 15hs a 18hs con reservas de 60min se transforma a 3
 * disponibilidades, de 15hs a 16hs, de 16hs a 17hs y de 17hs a 18hs.
 */
export type DisponibilidadForm = Omit<Disponibilidad, "id"> & {
  id?: number | undefined;
  minutosReserva: number;
};
