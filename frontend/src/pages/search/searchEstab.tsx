import EstablecimientoJugador from "@/components/EstablecimientoJugador/EstablecimientoJugador";
import { useBuscarEstablecimientos } from "@/utils/api/establecimientos";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { formatearFecha } from "@/utils/dates";
import { useCurrentJugador } from "@/hooks";
import { DISCIPLINAS } from "@/utils/consts";

type ApiGobProv = {
  provincias: Provincia[];
};

type ApiGobLoc = {
  municipios: Localidad[];
};

type Localidad = { id: number; nombre: string };

type Provincia = {
  centroide: {};
  id: number;
  nombre: string;
};

export default function SearchEstab() {
  const { jugador } = useCurrentJugador();

  const [localidades, setLocalidades] = useState<string[]>([]);
  const [localidad, setLocalidad] = useState(jugador.localidad);
  const [prov, setProv] = useState(jugador.provincia);
  const [deporte, setDeporte] = useState(jugador.disciplina);
  const [nombre, setNombre] = useState("");
  const [dateSelect, setDateSelect] = useState(formatearFecha(new Date()));

  const { data } = useBuscarEstablecimientos({
    localidad: localidad,
    provincia: prov,
    nombre: nombre,
    disciplina: deporte,
    fecha: dateSelect,
  });

  const provincias = useQuery<string[]>(["provincias"], {
    queryFn: () =>
      fetch("https://apis.datos.gob.ar/georef/api/provincias")
        .then((req) => req.json())
        .then(
          (data: ApiGobProv) => data?.provincias?.map((p) => p.nombre) ?? []
        ),
  });

  useEffect(() => {
    fetch(
      `https://apis.datos.gob.ar/georef/api/municipios?provincia=${prov}&campos=nombre&max=150`
    )
      .then((response) => response.json())
      .then((data: ApiGobLoc) => {
        setLocalidades(data?.municipios?.map((m) => m.nombre) ?? []);
      });
  }, [prov]);

  return (
    <>
      <Heading size="md" textAlign="center">
        Buscá un establecimiento para jugar
      </Heading>
      <Box width="100%" display="flex" justifyContent="center">
        <VStack>
          <Box
            bg="#e9eef1"
            mt="15px"
            p="0.3rem"
            width="360px"
            borderRadius="10px"
            display="flex"
            justifyContent="center"
          >
            <VStack gap="0.3rem">
              <HStack spacing="0.3rem">
                <Select
                  bg="white"
                  placeholder="Provincia"
                  mr="0px"
                  focusBorderColor="black"
                  value={prov}
                  onChange={(e) => setProv(e.target.value)}
                  children={provincias.data?.sort().map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                />
                <Select
                  bg="white"
                  ml="0px"
                  value={localidad}
                  placeholder="Localidad"
                  focusBorderColor="black"
                  onChange={(e) => setLocalidad(e.target.value)}
                >
                  {localidades.sort().map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                  <option key="Otra">Otra</option>
                </Select>
              </HStack>
              <Select
                bg="white"
                placeholder="Disciplina"
                value={deporte}
                onChange={(e) => {
                  setDeporte(e.target.value);
                }}
                focusBorderColor="black"
              >
                {DISCIPLINAS.sort().map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
              <Input
                bg="white"
                type="date"
                focusBorderColor="black"
                size="md"
                width="100%"
                onChange={(e) => setDateSelect(e.target.value)}
                value={dateSelect}
              />
              <InputGroup width="100%" bg="white" borderRadius="10px">
                <InputRightElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputRightElement>
                <Input
                  _placeholder={{ color: "#1a202c" }}
                  placeholder="Nombre del establecimiento"
                  size="md"
                  width="100%"
                  onChange={(e) => setNombre(e.target.value)}
                  focusBorderColor="black"
                />
              </InputGroup>
            </VStack>
          </Box>
        </VStack>
      </Box>
      <HStack
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        pt="20px"
        w="330"
      >
        {data.length > 0 ? (
          data.map((est) => (
            <EstablecimientoJugador
              key={est.id}
              establecimiento={est}
              date={dateSelect}
            />
          ))
        ) : (
          <p>No se encontraron establecimientos</p>
        )}
      </HStack>
    </>
  );
}
