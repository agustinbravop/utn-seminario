// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

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
  | `/ests/:idEst/reservas/:idReserva`
  | `/ests/:idEst/reservas/prueba`
  | `/jugador/:idJugador`
  | `/jugador/:idJugador/est/:idEst`
  | `/jugador/:idJugador/est/:idEst/canchas`
  | `/jugador/:idJugador/est/:idEst/canchas/:idCancha`
  | `/jugador/:idJugador/est/:idEst/reservar`
  | `/jugador/:idJugador/perfil`
  | `/jugador/:idJugador/perfil/cambiarClave`
  | `/jugador/:idJugador/perfil/editar`
  | `/jugador/:idJugador/reservas`
  | `/login`
  | `/play/:idEst/canchas/:idCancha/vistaJugadorCancha`
  | `/play/:idEst/vistaJugador`
  | `/register`
  | `/search/searchEstab`
  | `/subscribe`
  | `/suscripciones`

export type Params = {
  '/admin/:idAdmin': { idAdmin: string }
  '/admin/:idAdmin/mejorarSuscripcion': { idAdmin: string }
  '/admin/:idAdmin/nuevoEstablecimiento': { idAdmin: string }
  '/admin/:idAdmin/perfil': { idAdmin: string }
  '/admin/:idAdmin/perfil/cambiarClave': { idAdmin: string }
  '/admin/:idAdmin/perfil/editar': { idAdmin: string }
  '/admin/:idAdmin/perfil/editarSuscripcion': { idAdmin: string }
  '/admin/:idAdmin/perfil/selectEstab': { idAdmin: string }
  '/admin/:idAdmin/selectEstab': { idAdmin: string }
  '/ests/:idEst': { idEst: string }
  '/ests/:idEst/canchas': { idEst: string }
  '/ests/:idEst/canchas/:idCancha': { idEst: string; idCancha: string }
  '/ests/:idEst/canchas/:idCancha/disps': { idEst: string; idCancha: string }
  '/ests/:idEst/canchas/:idCancha/editar': { idEst: string; idCancha: string }
  '/ests/:idEst/canchas/nueva': { idEst: string }
  '/ests/:idEst/editar': { idEst: string }
  '/ests/:idEst/reservas': { idEst: string }
  '/ests/:idEst/reservas/:idReserva': { idEst: string; idReserva: string }
  '/ests/:idEst/reservas/prueba': { idEst: string }
  '/jugador/:idJugador': { idJugador: string }
  '/jugador/:idJugador/est/:idEst': { idJugador: string; idEst: string }
  '/jugador/:idJugador/est/:idEst/canchas': { idJugador: string; idEst: string }
  '/jugador/:idJugador/est/:idEst/canchas/:idCancha': { idJugador: string; idEst: string; idCancha: string }
  '/jugador/:idJugador/est/:idEst/reservar': { idJugador: string; idEst: string }
  '/jugador/:idJugador/perfil': { idJugador: string }
  '/jugador/:idJugador/perfil/cambiarClave': { idJugador: string }
  '/jugador/:idJugador/perfil/editar': { idJugador: string }
  '/jugador/:idJugador/reservas': { idJugador: string }
  '/play/:idEst/canchas/:idCancha/vistaJugadorCancha': { idEst: string; idCancha: string }
  '/play/:idEst/vistaJugador': { idEst: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
