import { useParams, useLocation } from "react-router";
import { Box, Button, HStack, Heading, Tabs } from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import { useCanchasByEstablecimientoID } from "@/utils/api/canchas";
import * as Yup from "yup";
import { VStack, Alert, Text, useToast } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import {
  ConfirmSubmitButton,
  InputControl,
  SelectControl,
  SubmitButton,
} from "@/components/forms";
import { RegistrarReserva } from "@/utils/api/auth";
import { useYupForm } from "@/hooks/useYupForm";
import { Link } from "react-router-dom";
import { DIAS, DISCIPLINAS, DURACION_RESERVA, HORAS } from "@/utils/consts";
import { useEffect, useState } from "react";
import { formatearFecha } from "@/utils/dates";

const validationSchema = Yup.object({
  horario: Yup.string().required("Obligatorio"),
  cancha: Yup.string().required("Obligatorio"),
  duracion: Yup.string().required("Obligatorio"),
  deporte: Yup.string().required("Obligatorio"),
});

export default function ReservarEstablecimiento() {
  const { idEst } = useParams();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const date = formatearFecha(searchParams.get("date"));

  const [cancha, setCancha] = useState("");
  const [duration, setDuration] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [disc, setDisc] = useState("");
  const [canchaData, setCanchaData] = useState();

  useEffect(() => {
    console.log("Cambio de cancha", cancha);
    setCanchaData(() =>
      canchas.find((canchaA) => Number(cancha) === Number(canchaA.id))
    );
    console.log(canchaData);
  }, [cancha]);

  useEffect(() => {
    console.log(canchaData);
  }, [canchaData]);

  function sumarTiempo(tiempoHHMM, minutos) {
    // Convertir tiempoHHMM a minutos
    const tiempoArray = tiempoHHMM.split(":");
    const horas = parseInt(tiempoArray[0], 10);
    const minutosOriginales = parseInt(tiempoArray[1], 10);
    const tiempoEnMinutos = horas * 60 + minutosOriginales;

    // Sumar los minutos
    const tiempoTotalEnMinutos = tiempoEnMinutos + parseInt(minutos, 10);

    // Calcular las nuevas horas y minutos
    const nuevasHoras = Math.floor(tiempoTotalEnMinutos / 60);
    const nuevosMinutos = tiempoTotalEnMinutos % 60;

    // Formatear el resultado
    const horasFormateadas = nuevasHoras.toString().padStart(2, "0");
    const minutosFormateados = nuevosMinutos.toString().padStart(2, "0");

    return `${horasFormateadas}:${minutosFormateados}`;
  }

  const { data } = useEstablecimientoByID(Number(idEst));
  const { data: canchas } = useCanchasByEstablecimientoID(Number(idEst));

  useEffect(() => {
    console.log(canchas);
  }, [canchas]);

  const methods = useYupForm<RegistrarReserva>({
    validationSchema,
  });

  return (
    <>
      <Heading textAlign="center" paddingBottom="12" mt="40px">
        Reservar {data?.nombre}
      </Heading>

      <FormProvider {...methods}>
        <VStack
          as="form"
          spacing="4"
          width="-webkit-fit-content"
          justifyContent="center"
          margin="auto"
          my="5px"
        >
          <HStack>
            <SelectControl
              minWidth="160px"
              label="Horario "
              name="horario"
              placeholder="Elegir"
              isRequired
              onChange={(e) => setHoraInicio(e.target.value)}
            >
              {HORAS.map((hora, i) => (
                <option key={i} value={hora}>
                  {hora}
                </option>
              ))}
            </SelectControl>
            <SelectControl
              minWidth="160px"
              label="Duración "
              name="duracion"
              placeholder="Elegir"
              isRequired
              onChange={(e) => setDuration(e.target.value)}
            >
              {DURACION_RESERVA.map((duracion, i) => (
                <option key={i} value={duracion}>
                  {duracion}
                </option>
              ))}
            </SelectControl>
          </HStack>
          <HStack>
            <SelectControl
              minWidth="160px"
              label="Cancha "
              name="cancha"
              placeholder="Elegir"
              isRequired
              onChange={(e) => setCancha(e.target.value)}
            >
              {canchas.map((cancha, i) => {
                console.log(cancha);
                return (
                  <option key={i} value={cancha.id}>
                    {cancha.nombre}
                  </option>
                );
              })}
            </SelectControl>
            <SelectControl
              minWidth="160px"
              label="Deporte "
              name="deporte"
              placeholder="Elegir"
              isRequired
              onChange={(e) => setDisc(e.target.value)}
            >
              {canchaData?.disciplinas
                ? [...new Set(canchaData.disciplinas)].map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))
                : null}
            </SelectControl>
          </HStack>
          <ConfirmSubmitButton
            header="Datos reserva"
            onSubmit={() => console.log(methods.getValues())}
            body={
              <>
                <VStack
                  as="form"
                  spacing="4"
                  width="-webkit-fit-content"
                  justifyContent="center"
                  margin="auto"
                >
                  <HStack spacing="20px">
                    <Text>
                      {" "}
                      Fecha: <strong> {date} </strong>{" "}
                    </Text>
                    <Text>
                      {" "}
                      Precio: <strong> $1500 </strong>
                    </Text>
                  </HStack>

                  <HStack spacing="20px">
                    <Text>
                      {" "}
                      Hora inicio <strong>{horaInicio} hs</strong>
                    </Text>
                    <Text>
                      {" "}
                      Hora fin{" "}
                      <strong>{sumarTiempo(horaInicio, duration)} hs</strong>
                    </Text>
                  </HStack>
                  <HStack spacing="20px">
                    {/* <Text> Cancha {methods.getValues("cancha")} </Text> */}
                    <Text>
                      {" "}
                      Cancha <strong>{canchaData?.nombre}</strong>{" "}
                    </Text>
                    <Text>
                      {" "}
                      Deporte <strong>{disc}</strong>{" "}
                    </Text>
                  </HStack>
                </VStack>
              </>
            }
          >
            {" "}
            Rerservar{" "}
          </ConfirmSubmitButton>
        </VStack>
      </FormProvider>
      <Box></Box>
    </>
  );
}
