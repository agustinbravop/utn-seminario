import { RequestHandler } from "express";
import { BuscarPagosQuery, PagoService } from "../services/pagos.js";
import { z } from "zod";
import { MercadoPagoConfig, Payment } from "mercadopago";
import mercadopago from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken:
    "TEST-6924020176251309-101511-a0fb4ec9e56f8f56e00ccb2ca7137a32-1158801954",
});
const payments = new Payment(client);

export const buscarPagosQuerySchema = z.object({
  idCancha: z.coerce.number().int().optional(),
  idEst: z.coerce.number().int().optional(),
  fechaDesde: z.coerce
    .string()
    .optional()
    .transform((data) => data && new Date(data).toISOString()),
  fechaHasta: z.coerce
    .string()
    .optional()
    .transform((data) => data && new Date(data).toISOString()),
});

export class PagoHandler {
  private service: PagoService;
  constructor(service: PagoService) {
    this.service = service;
  }

  getPagoByID(): RequestHandler {
    return async (req, res) => {
      const id = Number(req.params.idPago);

      const est = await this.service.getByID(id);
      res.status(200).json(est);
    };
  }

  buscarPagos(): RequestHandler {
    return async (_req, res) => {
      const filtros: BuscarPagosQuery = res.locals.query;
      const pagos = await this.service.buscar(filtros);
      res.status(200).json(pagos);
    };
  }

  crearPago(): RequestHandler {
    return async (req, res) => {
      const paymentData = req.body;

      // Luego, crea un nuevo objeto con "transaction_amount" como una cadena
      const newPaymentData = {
        ...paymentData,
        description: "Esta es una reserva",
      };
      console.log(newPaymentData)
      // Crea el pago
      payments
        .create(newPaymentData)
        .then((p) => {
          console.log("Pago creado con éxito.");
          console.log("ID del pago:", p.id);
          console.log("Redirige al usuario a la siguiente URL:");
          console.log(p.payer);
        })
        .catch(error => {
          console.error("No se pudo crear el pago. Detalles:", error);
        });
    };
  }
}
