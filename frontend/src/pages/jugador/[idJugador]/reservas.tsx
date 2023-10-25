import { useReservasByJugadorID } from "@/utils/api";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useCurrentJugador } from "@/hooks";
import { ReservaCard } from "@/components/display";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { CardPayment, StatusScreen, Wallet } from "@mercadopago/sdk-react";

export default function JugadorReservasPage() {
  /*
  Integracion con Mercado Pago
  */
  initMercadoPago("TEST-17f590c3-e4d6-4647-96d2-a52ba3f69b2e");

  const initialization = {
    amount: 150,
    paymentId: "0001",
  };
  const customization = {
    backUrls: {
      error: "<http://localhost:5173/error",
      return: "<http://localhost:5173/homepage",
    },
  };

  const onSubmit = async (formData: any) => {
    // callback llamado al hacer clic en el botón enviar datos
    console.log("Info del form: " + formData.body);

    return new Promise((resolve, reject) => {
      fetch("http://localhost:3001/pagos/process_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((r) => r.json())
        .then((r) => {
          // recibir el resultado del pago
          resolve(r);
        })
        .catch((e) =>
          // manejar la respuesta de error al intentar crear el pago
          reject(e)
        );
    });
  };

  const onError = async (e: any) => {
    // callback llamado para todos los casos de error de Brick
    console.log(e);
  };

  const onReady = async () => {
    /*
    Callback llamado cuando Brick está listo.
    Aquí puedes ocultar cargamentos de su sitio, por ejemplo.
  */
  };

  const { jugador } = useCurrentJugador();
  const { data: reservas } = useReservasByJugadorID(jugador.id);
  console.log(reservas);
  return (
    <>
      <Heading pb="10px" size="lg" textAlign="center">
        Reservas Activas
      </Heading>
      <HStack wrap="wrap" align="center" justify="center">
        {reservas.map((reserva) => (
          <ReservaCard key={reserva.id} reserva={reserva} />
        ))}
      </HStack>
    </>
  );
}
