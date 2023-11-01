import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { EstablecimientoMenu } from "@/components/navigation";
import { useParams } from "@/router";
import { useInformePagosPorCancha } from "@/utils/api";
import { FallbackImage } from "@/utils/constants";
import { formatFecha, formatISOFecha } from "@/utils/dates";
import {
  Box,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/informes");
  const [fechaDesde, setFechaDesde] = useState<string>(formatFecha(new Date()));
  const [fechaHasta, setFechaHasta] = useState<string>(formatFecha(new Date()));

  const { data: informe } = useInformePagosPorCancha({
    idEst: Number(idEst),
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });

  return (
    <>
      <EstablecimientoMenu />
      <HStack mr="12%" ml="12%" mb="20px" mt="30px">
        <FormControl variant="floating" width="auto">
          <Input
            type="date"
            placeholder="Fecha desde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
          <FormLabel>Desde</FormLabel>
        </FormControl>
        <FormControl variant="floating" width="auto">
          <Input
            type="date"
            placeholder="Fecha hasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
          <FormLabel>Hasta</FormLabel>
        </FormControl>
      </HStack>

      {!informe ? (
        <LoadingSpinner />
      ) : (
        <Box mx="16%">
          <StatGroup width="fit-content" gap="40px" ml="20px">
            <Stat>
              <StatLabel>
                <Tooltip label="Dinero que se espera recibir al terminar este período de tiempo, si todas las reservas son pagadas">
                  Total estimado
                </Tooltip>
              </StatLabel>
              <StatNumber>${informe.estimado}</StatNumber>
              <StatHelpText>
                {fechaDesde && formatISOFecha(fechaDesde)}
                {" - "}
                {fechaHasta && formatISOFecha(fechaHasta)}
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>
                <Tooltip label="Dinero recibido por el establecimiento hasta ahora">
                  Total ingresado
                </Tooltip>
              </StatLabel>
              <StatNumber>${informe.total}</StatNumber>
              <StatHelpText>
                {fechaDesde && formatISOFecha(fechaDesde)}
                {" - "}
                {fechaHasta && formatISOFecha(fechaHasta)}
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>
                <Tooltip label="Cantidad de reservas que el establecimiento recibió en este período de tiempo">
                  Reservas recibidas
                </Tooltip>
              </StatLabel>
              <StatNumber>
                {informe.canchas.reduce(
                  (acum, c) => acum + c.reservas.length,
                  0
                )}
              </StatNumber>
              <StatHelpText>
                {fechaDesde && formatISOFecha(fechaDesde)} -{" "}
                {fechaHasta && formatISOFecha(fechaHasta)}
              </StatHelpText>
            </Stat>
          </StatGroup>

          <Heading size="lg" my="0.5em" ml="2em">
            Por cancha
          </Heading>
          <HStack wrap="wrap" justify="center">
            {informe.canchas.map((cancha) => (
              <Card key={cancha.id} width="400px" borderRadius="10px">
                <Image
                  src={cancha.urlImagen}
                  fallback={<FallbackImage height="125px" />}
                  height="125px"
                  fit="cover"
                  borderRadius="10px 10px 0 0"
                />
                <CardBody>
                  <Heading size="md">{cancha.nombre}</Heading>
                  <StatGroup mt="0.5em">
                    <Stat>
                      <StatLabel>Estimado</StatLabel>
                      <StatNumber>${cancha.estimado}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Ingresado</StatLabel>
                      <StatNumber>${cancha.total}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Reservas</StatLabel>
                      <StatNumber>{cancha.reservas.length}</StatNumber>
                    </Stat>
                  </StatGroup>
                </CardBody>
              </Card>
            ))}
          </HStack>
        </Box>
      )}
    </>
  );
}
