import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { EstablecimientoMenu } from "@/components/navigation";
import { useParams } from "@/router";
import { useInformePagosPorCancha } from "@/utils/api";
import { FallbackImage } from "@/utils/consts";
import { formatearISOFecha } from "@/utils/dates";
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
} from "@chakra-ui/react";
import { useState } from "react";

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/informes");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  const { data: informe } = useInformePagosPorCancha({
    idEst: Number(idEst),
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });

  const ingresosStat = (label: string, ingresos: number) => {
    return (
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>${ingresos}</StatNumber>
        <StatHelpText>
          {fechaDesde && formatearISOFecha(fechaDesde)} -{" "}
          {fechaHasta && formatearISOFecha(fechaHasta)}
        </StatHelpText>
      </Stat>
    );
  };

  const reservasStat = (label: string, reservas: number) => {
    return (
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{reservas}</StatNumber>
        <StatHelpText>
          {fechaDesde && formatearISOFecha(fechaDesde)} -{" "}
          {fechaHasta && formatearISOFecha(fechaHasta)}
        </StatHelpText>
      </Stat>
    );
  };

  return (
    <>
      <EstablecimientoMenu />
      <HStack mr="16%" ml="16%" mb="20px" mt="30px">
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
        <Box mx="12%">
          <StatGroup width="380px" gap="40px" m="20px auto">
            {ingresosStat("Ingreso total", informe.total)}
            {reservasStat(
              "Reservas recibidas",
              informe.canchas.reduce((acum, c) => acum + c.reservas.length, 0)
            )}
          </StatGroup>
          <Heading size="lg" mb="0.5em" ml="2em">
            Por cancha
          </Heading>
          <HStack wrap="wrap" justify="center">
            {informe.canchas.map((cancha) => (
              <Card key={cancha.id} width="400px" borderRadius="10px">
                <Image
                  src={cancha.urlImagen}
                  fallback={<FallbackImage height="50px" />}
                  height="50px"
                  fit="cover"
                  borderRadius="10px 10px 0 0"
                />
                <CardBody>
                  <Heading size="md">{cancha.nombre}</Heading>
                  <StatGroup>
                    {ingresosStat("Ingresos", cancha.total)}
                    {reservasStat("Reservas", cancha.reservas.length)}
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
