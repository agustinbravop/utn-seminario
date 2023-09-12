// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/admin/:idAdmin`
  | `/admin/:idAdmin/mejorarSuscripcion`
  | `/admin/:idAdmin/nuevoEstablecimiento`
  | `/admin/:idAdmin/perfil`
  | `/admin/:idAdmin/perfil/cambiarClave`
  | `/admin/:idAdmin/perfil/editar`
  | `/admin/:idAdmin/perfil/editarSuscripcion`
  | `/admin/:idAdmin/perfil/selectEstab`
  | `/admin/:idAdmin/selectEstab`
  | `/ests/:idEst`
  | `/ests/:idEst/canchas`
  | `/ests/:idEst/canchas/:idCancha`
  | `/ests/:idEst/canchas/:idCancha/disps`
  | `/ests/:idEst/canchas/:idCancha/editar`
  | `/ests/:idEst/canchas/nueva`
  | `/ests/:idEst/editar`
  | `/ests/:idEst/reservas`
  | `/jugador/:idJugador`
  | `/jugador/:idJugador/perfil`
  | `/jugador/:idJugador/perfil/cambiarClave`
  | `/jugador/:idJugador/perfil/editar`
  | `/login`
  | `/register`
  | `/subscribe`
  | `/suscripciones`;

export type Params = {
  "/admin/:idAdmin": { idAdmin: string };
  "/admin/:idAdmin/mejorarSuscripcion": { idAdmin: string };
  "/admin/:idAdmin/nuevoEstablecimiento": { idAdmin: string };
  "/admin/:idAdmin/perfil": { idAdmin: string };
  "/admin/:idAdmin/perfil/cambiarClave": { idAdmin: string };
  "/admin/:idAdmin/perfil/editar": { idAdmin: string };
  "/admin/:idAdmin/perfil/editarSuscripcion": { idAdmin: string };
  "/admin/:idAdmin/perfil/selectEstab": { idAdmin: string };
  "/admin/:idAdmin/selectEstab": { idAdmin: string };
  "/ests/:idEst": { idEst: string };
  "/ests/:idEst/canchas": { idEst: string };
  "/ests/:idEst/canchas/:idCancha": { idEst: string; idCancha: string };
  "/ests/:idEst/canchas/:idCancha/disps": { idEst: string; idCancha: string };
  "/ests/:idEst/canchas/:idCancha/editar": { idEst: string; idCancha: string };
  "/ests/:idEst/canchas/nueva": { idEst: string };
  "/ests/:idEst/editar": { idEst: string };
  "/ests/:idEst/reservas": { idEst: string };
  "/jugador/:idJugador": { idJugador: string };
  "/jugador/:idJugador/perfil": { idJugador: string };
  "/jugador/:idJugador/perfil/cambiarClave": { idJugador: string };
  "/jugador/:idJugador/perfil/editar": { idJugador: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
