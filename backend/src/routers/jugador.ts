import { Router } from "express";
import { JugadorHandler, modificarJugadorSchema } from "../handlers/jugador.js";
import { validateBody, validateIDParams } from "../middlewares/validation.js";
import { AuthHandler } from "../handlers/auth.js";

export function jugadoresRouter(
  handler: JugadorHandler,
  authMiddle: AuthHandler
): Router {
  const router = Router();

  router.use("/:idJugador", validateIDParams("idJugador"));

  router.get("/:idJugador", authMiddle.isJugador(), handler.getJugadorByID());
  router.patch(
    "/:idJugador",
    authMiddle.isJugador(),
    validateBody(modificarJugadorSchema),
    handler.patchJugador()
  );

  return router;
}
