import { useParams } from "react-router";
import { Box, Button, HStack, Heading, Tabs } from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import { useCanchasByEstablecimientoID } from "@/utils/api/canchas";
import * as Yup from "yup";
import {
  VStack,
  Alert,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import { ConfirmSubmitButton, InputControl, SelectControl, SubmitButton } from "@/components/forms";
import {  RegistrarReserva } from "@/utils/api/auth";
import { useYupForm } from "@/hooks/useYupForm";
import { Link } from "react-router-dom";
import { DIAS, DISCIPLINAS, DURACION_RESERVA, HORAS } from "@/utils/consts";

const validationSchema = Yup.object({
  horario: Yup.string().required("Obligatorio"),
  cancha: Yup.string().required("Obligatorio"),
  duracion: Yup.string().required("Obligatorio"),
});

export default function ReservarEstablecimiento() {
  const { idEst } = useParams();

  const { data } = useEstablecimientoByID(Number(idEst));
  const { data: canchas} = useCanchasByEstablecimientoID(
    Number(idEst)
  );

  const toast = useToast();

  const methods = useYupForm<RegistrarReserva>({
    validationSchema,
  });

  /*
    const { mutate, isLoading, isError } = useRegistrarJugador({
        onSuccess: () => {
        toast({
            title: "Cuenta registrada correctamente.", 
            description: "Inicie sesión para continuar.",
            status: "success",
        });
        navigate("/login");
        },
        onError: () => {
        toast({
            title: "Error al registrar su cuenta.",
            description: `Intente de nuevo.`,
            status: "error",
        });
        },
    });
*/

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
          <SelectControl minWidth="160px"
                label="Horario "
                name="horario"
                isRequired
              >
                {HORAS.map((hora, i) => (
                  <option key={i} value={hora}>
                    {hora}
                  </option>
                ))}
              </SelectControl>
              <SelectControl minWidth="160px"
                label="Duración "
                name="duracion"
                isRequired
              >
                {DURACION_RESERVA.map((duracion, i) => (
                  <option key={i} value={duracion}>
                    {duracion}
                  </option>
                ))}
            </SelectControl>
          </HStack>
          <HStack>
          <SelectControl minWidth="160px"
                label="Cancha "
                name="cancha"
                isRequired
              >
                {canchas.map((cancha, i) => (
                  <option key={i} value={cancha.nombre}>
                    {cancha.nombre}
                  </option>
                ))}
              </SelectControl>
              <SelectControl minWidth="160px"
                label="Duración "
                name="duracion"
                isRequired
              >
                {DURACION_RESERVA.map((hora, i) => (
                  <option key={i} value={hora}>
                    {hora}
                  </option>
                ))}
            </SelectControl>
          </HStack>
          <ConfirmSubmitButton header="Datos reserva"
                onSubmit={()=> console.log(methods.getValues())}
                body= {
                <>
                 <VStack
                    as="form" 
                    spacing="4"
                    width="-webkit-fit-content"
                    justifyContent="center"
                    margin="auto"
                    >
                        <HStack spacing="20px">
                        <Text> Hora inicio {methods.getValues("horario")} </Text>
                        <Text> Hora fin {methods.getValues("horario") } </Text>

                    </HStack>

                </VStack>             
                </>
                }

                > Rerservar </ConfirmSubmitButton>
        </VStack>
      </FormProvider>
      <Box>
      </Box>
    </>
  );
}
