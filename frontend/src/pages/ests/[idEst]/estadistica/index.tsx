import { EstablecimientoMenu } from "@/components/navigation";
import { Bar } from "react-chartjs-2";
import {
  Select,
  Container,
  HStack,
  Heading,
  Center,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "@/router";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useEstadisticasHorarios } from "@/utils/api";
import { Horarios } from "./horas";
import { LoadingSpinner } from "@/components/feedback";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Bars() {
  const ArrayHorarios = Horarios();
  const { idEst } = useParams("/ests/:idEst/estadistica");
  console.log(idEst);
  const dias = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
  ];

  const [desde, setDesde] = useState("00:00");
  const [hasta, setHasta] = useState("23:55");
  const { data: estadistica } = useEstadisticasHorarios({
    idEst: Number(idEst),
    horaInicio: desde,
    horaFinal: hasta,
  });

  function ObtenerMayorValor() {
    const ArrayDias = Array();
    ArrayDias.push(estadistica?.Domingo);
    ArrayDias.push(estadistica?.Lunes);
    ArrayDias.push(estadistica?.Martes);
    ArrayDias.push(estadistica?.Miercoles);
    ArrayDias.push(estadistica?.Jueves);
    ArrayDias.push(estadistica?.Viernes);
    ArrayDias.push(estadistica?.Sabado);
    let max = 0;
    ArrayDias.forEach((item) => {
      if (item >= max) {
        max = item;
      }
    });
    return max;
  }
  var misoptions = {
    responsive: true,
    animation: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Cantidad de reservas por rango horarios",
        align: "center",
      },
    },

    scales: {
      y: {
        min: 0,
        max: ObtenerMayorValor(),
      },
      x: {
        ticks: { color: "black" },
      },
    },
  };

  var midata = {
    labels: dias,
    datasets: [
      {
        label: "Cantidad de Reservas",
        data: estadistica,
        backgroundColor: "rgba(0, 220, 195, 0.5)",
      },
    ],
  };

  return (
    <div>
      <div>
        <EstablecimientoMenu></EstablecimientoMenu>
      </div>

      <Container maxW="md">
        <Box>
          <Center>
            <Heading as="h5" size="md" style={{ margin: "0.2rem" }}>
              Filtros de Horarios
            </Heading>
          </Center>
          <HStack>
            <span>DESDE:</span>
            <Select
              maxW="100"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            >
              {ArrayHorarios.map((hora, index) => (
                <option key={index} value={hora}>
                  {hora}
                </option>
              ))}
            </Select>
            <br />
            <br />
            <span>HASTA:</span>
            <Select
              maxW="100"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            >
              {ArrayHorarios.map((hora, index) => (
                <option key={index} value={hora}>
                  {hora}
                </option>
              ))}
            </Select>
          </HStack>
        </Box>
      </Container>
      {!estadistica ? (
        <LoadingSpinner></LoadingSpinner>
      ) : (
        <div
          className="bg-light mx-auto px-2 border border-2 border-primary"
          style={{ width: "700px", height: "400px" }}
        >
          <Bar data={midata} options={misoptions} />
        </div>
      )}
    </div>
  );
}
