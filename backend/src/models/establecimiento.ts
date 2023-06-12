export type Establecimiento = {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  localidad: string;
  provincia: string;
  urlImagen: string | null;
  correo: string;
  idAdministrador: number;
  horariosDeAtencion: string | null;
};

// export type HorarioDeAtencion = {
//   id: number;
//   horaApertura: Date;
//   horaCierre: Date;
//   idEstablecimiento: number;
//   diaDeSemana: string;
// };
