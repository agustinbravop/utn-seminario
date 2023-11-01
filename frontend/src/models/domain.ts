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

export type Jugador = {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  usuario: string;
  localidad?: string;
  provincia?: string;
  disciplina?: string;
};

export type Cancha = {
  id: number;
  nombre: string;
  descripcion: string;
  habilitada: boolean;
  urlImagen?: string;
  idEstablecimiento: number;
  disciplinas: string[];
  disponibilidades: Disponibilidad[];
};

export type Establecimiento = {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  habilitado: boolean;
  localidad: string;
  provincia: string;
  urlImagen?: string;
  correo: string;
  idAdministrador: number;
  disciplinas: string[];
  horariosDeAtencion: string | undefined;
};

export type HorarioDeAtencion = {
  id: number;
  horaApertura: Date;
  horaCierre: Date;
  idEstablecimiento: number;
  diaDeSemana: string;
};

export type Disponibilidad = {
  id: number;
  horaInicio: string;
  horaFin: string;
  precioReserva: number;
  precioSenia?: number | undefined;
  disciplina: string;
  dias: Dia[];
  idCancha: number;
};

export type Dia =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";

export type Suscripcion = {
  id: number;
  nombre: string;
  limiteEstablecimientos: number;
  costoMensual: number;
};

export type Tarjeta = {
  id: number;
  nombre: string;
  numero: string;
  cvv: number;
  vencimiento: string;
};

export type Reserva = {
  id: number;
  fechaReservada: string;
  fechaCreada: string;
  precio: number;
  senia?: number;
  idPagoReserva?: number;
  pagoReserva?: Pago;
  idPagoSenia?: number;
  pagoSenia?: Pago;
  jugador: Jugador;
  disponibilidad: Disponibilidad & {
    cancha: Cancha & { establecimiento: Establecimiento };
  };
};

export type Pago = {
  id: number;
  monto: number;
  fechaPago: string;
  idMetodoDePago: string;
};
