// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/admin/:idAdmin/mejorarSuscripcion`
  | `/admin/:idAdmin/nuevoEstablecimiento`
  | `/admin/:idAdmin/perfil`
  | `/admin/:idAdmin/perfil/cambiarClave`
  | `/admin/:idAdmin/perfil/editar`
  | `/admin/:idAdmin/perfil/editarSuscripcion`
  | `/admin/:idAdmin/perfil/selectEstab`
  | `/admin/:idAdmin/selectEstab`
  | `/auth/clave-olvidada`
  | `/auth/login`
  | `/auth/redirect/google`
  | `/auth/register`
  | `/auth/resetear-clave`
  | `/ests`
  | `/ests/:idEst`
  | `/ests/:idEst/canchas`
  | `/ests/:idEst/canchas/:idCancha`
  | `/ests/:idEst/canchas/:idCancha/disps`
  | `/ests/:idEst/canchas/:idCancha/editar`
  | `/ests/:idEst/canchas/nueva`
  | `/ests/:idEst/editar`
  | `/ests/:idEst/informes`
  | `/ests/:idEst/informes/horarios`
  | `/ests/:idEst/informes/pagos`
  | `/ests/:idEst/reservas`
  | `/ests/:idEst/reservas/:idReserva`
  | `/jugador/:idJugador/perfil`
  | `/jugador/:idJugador/perfil/cambiarClave`
  | `/jugador/:idJugador/perfil/editar`
  | `/jugador/:idJugador/reservas`
  | `/search`
  | `/search/est/:idEst`
  | `/search/est/:idEst/canchas`
  | `/search/est/:idEst/canchas/:idCancha`
  | `/search/est/:idEst/reservar`
  | `/subscribe`
  | `/suscripciones`

export type Params = {
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
  '/ests/:idEst/informes': { idEst: string }
  '/ests/:idEst/informes/horarios': { idEst: string }
  '/ests/:idEst/informes/pagos': { idEst: string }
  '/ests/:idEst/reservas': { idEst: string }
  '/ests/:idEst/reservas/:idReserva': { idEst: string; idReserva: string }
  '/jugador/:idJugador/perfil': { idJugador: string }
  '/jugador/:idJugador/perfil/cambiarClave': { idJugador: string }
  '/jugador/:idJugador/perfil/editar': { idJugador: string }
  '/jugador/:idJugador/reservas': { idJugador: string }
  '/search/est/:idEst': { idEst: string }
  '/search/est/:idEst/canchas': { idEst: string }
  '/search/est/:idEst/canchas/:idCancha': { idEst: string; idCancha: string }
  '/search/est/:idEst/reservar': { idEst: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
