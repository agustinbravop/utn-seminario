import { EstablecimientoMenu } from "@/components/navigation";
import { Bar, Line } from "react-chartjs-2";
import { Select, HStack, Box, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "@/router";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  HorariosPopularesQuery,
  useDiasDeSemanaPopulares,
  useHorariosPopulares,
} from "@/utils/api";
import { LoadingSpinner } from "@/components/feedback";
import { DIAS, HORARIOS } from "@/utils/constants";
import InformesMenu from "@/components/navigation/InformesMenu";
import { DateControl } from "@/components/forms";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useFormSearchParams } from "@/hooks";
import { formatFecha } from "@/utils/dates";

const CHART_COLOR = "rgba(237, 137, 54, 0.75)";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const defaultValues = {
  desde: formatFecha(new Date()),
  hasta: formatFecha(new Date()),
};

export default function InformeHorariosPage() {
  const { idEst } = useParams("/ests/:idEst/informes/horarios");
  const methods = useForm({ defaultValues });
  const { desde = "", hasta = "" } = useWatch({
    control: methods.control,
    defaultValue: defaultValues,
  });
  useFormSearchParams({ watch: methods.watch, setValue: methods.setValue });

  const [horaInicio, setHoraDesde] = useState("00:00");
  const [horaFin, setHoraHasta] = useState("23:55");

  const query: HorariosPopularesQuery = {
    idEst: Number(idEst),
    horaInicio,
    horaFin,
    fechaDesde: desde,
    fechaHasta: hasta,
  };

  return (
    <Box mx="12%">
      <EstablecimientoMenu />
      <InformesMenu informe="Horarios" />
      <Text>
        Se calculan los horarios y los días de semana más concurridos del
        establecimiento en base a las reservas realizadas en un período dado. No
        se contabilizan las reservas canceladas.
      </Text>

      <FormProvider {...methods}>
        <HStack mb="20px" mt="30px">
          <DateControl w="auto" name="desde" label="Desde" />
          <DateControl w="auto" name="hasta" label="Hasta" />
        </HStack>
      </FormProvider>

      <HStack my="1em">
        <span>Filtrar por horario desde las</span>
        <Select
          maxW="95px"
          name="horaInicio"
          value={horaInicio}
          onChange={(e) => setHoraDesde(e.target.value)}
        >
          {HORARIOS.map((hora) => (
            <option key={hora} value={hora}>
              {hora}
            </option>
          ))}
        </Select>
        <span>hs hasta las</span>
        <Select
          maxW="95px"
          name="horaFin"
          value={horaFin}
          onChange={(e) => setHoraHasta(e.target.value)}
        >
          {HORARIOS.map((hora) => (
            <option key={hora} value={hora}>
              {hora}
            </option>
          ))}
        </Select>
        <span>hs.</span>
      </HStack>

      <VStack gap="2em" justify="center">
        <HorariosChart {...query} />
        <DiasDeSemanaChart {...query} />
      </VStack>
    </Box>
  );
}

function DiasDeSemanaChart({ ...query }: HorariosPopularesQuery) {
  const { data } = useDiasDeSemanaPopulares(query);

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <Bar
      data={{
        labels: [...DIAS],
        datasets: [
          {
            label: "Cantidad de reservas",
            data: data,
            backgroundColor: CHART_COLOR,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Reservas por día de semana",
            align: "center",
          },
        },
        scales: {
          y: { min: 0, ticks: { stepSize: 1 } },
          x: { ticks: { color: "black" }, grid: { lineWidth: 0 } },
        },
      }}
      id="diasDeSemana"
    />
  );
}

function HorariosChart({ ...query }: HorariosPopularesQuery) {
  const { data } = useHorariosPopulares(query);

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <Line
      data={{
        labels: [...HORARIOS].filter(
          (h) =>
            (query.horaInicio ?? "00:00") <= h &&
            h <= (query.horaFin ?? "23:55")
        ),
        datasets: [
          {
            label: "Cantidad de reservas",
            data: data,
            borderColor: CHART_COLOR,
            pointStyle: false,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Reservas por horario",
            align: "center",
          },
        },
        scales: {
          y: { min: 0, ticks: { stepSize: 1 } },
          x: { ticks: { color: "black" } },
        },
      }}
      id="horarios"
    />
  );
}
