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
  localidad: string;
  provincia: string;
  urlImagen?: string;
  correo: string;
  idAdministrador: number;
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
  horaInicio: string;
  horaFin: string;
  minutosReserva: number;
  precioReserva: number;
  precioSenia?: number | undefined;
  disciplina: string;
  dias: Dia[];
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
