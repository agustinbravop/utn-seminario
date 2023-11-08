import express, { Router } from "express";
import {
  ReservaHandler,
  crearReservaSchema,
  getReservaQuerySchema,
} from "../handlers/reservas.js";
import {
  validateBody,
  validateIDParams,
  validateQueryParams,
} from "../middlewares/validation";
import { AuthHandler } from "../handlers/auth.js";

export function reservasRouter(
  handler: ReservaHandler,
  authMiddle: AuthHandler
): Router {
  const router = express.Router();

  router.get("/:idRes", validateIDParams("idRes"), handler.getReservaByID());
  router.get(
    "/",
    validateQueryParams(getReservaQuerySchema),
    handler.getReserva()
  );

  router.post(
    "/",
    //SACO EL auth PARA FACILIDAD DE PRUEBAS
    authMiddle.isLogged(),
    validateBody(crearReservaSchema),
    handler.postReserva()
  );

  router.patch(
    "/:idRes/cancelar", //validateIDParams("idRes"),
    //Solo el admin seña por ahora, el metodo de
    //pago hardcodeado es "Efectivo" por ahora
    // authMiddle.isJugador() Ahora puede ser el jugador o el admin quien cancele una reserva
    //validateBody(crearReservaSchema) debería validar el body? Buena pregunta
    handler.cancelarReserva()
  );

  router.patch(
    "/:idRes", //validateIDParams("idRes"),
    //Solo el admin seña por ahora, el metodo de
    //pago hardcodeado es "Efectivo" por ahora
    authMiddle.isAdmin(),
    //validateBody(crearReservaSchema) debería validar el body? Buena pregunta
    handler.seniarReserva()
  );

  router.patch(
    "/pagar/:idRes", //validateIDParams("idRes"),
    //Solo el admin seña por ahora, el metodo de
    //pago hardcodeado es "Efectivo" por ahora
    authMiddle.isAdmin(),
    //validateBody(crearReservaSchema) debería validar el body? Buena pregunta
    handler.pagarReserva()
  );

  return router;
}
