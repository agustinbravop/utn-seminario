import EstablecimientoJugador from "@/components/EstablecimientoJugador/EstablecimientoJugador";
import { Busqueda } from "@/models";
import { useEstablecimientosPlayer } from "@/utils/api/establecimientos";
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
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const [filtro, setFiltro] = useState("");
  const [localidades, setLocalidades] = useState<string[]>([]);
  const [localidad, setLocalidad] = useState("");
  const [prov, setProv] = useState("");
  const [deporte, setDeporte] = useState("");

  const [nombre, setNombre] = useState("");
<<<<<<< HEAD
  
  const obtenerFechaActual = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [dateSelect, setDateSelect] = useState(obtenerFechaActual)
=======

  const obtenerFechaActual = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [dateSelect, setDateSelect] = useState(obtenerFechaActual);

  const { data } = useEstablecimientosPlayer({
    localidad: localidad,
    provincia: prov,
    nombre: nombre,
    disciplina: deporte,
    fecha: dateSelect,
  });

  useEffect(() => {
    queryClient.refetchQueries(["establecimientos", "jugador"]); //No esta haciendo el refetch :(
    console.log(nombre, prov, localidad, deporte);
  }, [nombre || prov || localidad || deporte || dateSelect]);
>>>>>>> f6c9295f56b4c6ddb6e642cb3c5bf51556222896

  const { data } = useEstablecimientosPlayer({
    localidad: localidad,
    provincia: prov,
    nombre: nombre,
    disciplina: deporte,
    fecha: dateSelect
  });


  useEffect(() => {
    queryClient.refetchQueries(["establecimientos", "jugador"]); //No esta haciendo el refetch :(
    console.log(nombre, prov, localidad, deporte)
  }, [nombre || prov || localidad || deporte || dateSelect])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

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
        Busca tu establecimieto deportivo
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
                  placeholder="Localidad"
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
                onChange={(e) => {
                  setDeporte(e.target.value);
                }}
              >
                <option key="Basket">Basket</option>
                <option key="Futbol">Fútbol</option>
                <option key="Tenis">Tenis</option>
                <option key="Padel">Padel</option>
                <option key="Otra">Otra</option>
              </Select>
              <Input
                bg="white"
                type="date"
                focusBorderColor="lightblue"
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
                  focusBorderColor="lightblue"
                  _placeholder={{ color: "#1a202c" }}
                  placeholder="Nombre del establecimiento"
                  size="md"
                  width="100%"
                  // onChange={handleChange
                  onChange={(e) => {
                    setNombre(e.target.value);
                  }}
                  // value={filtro}
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
        {data.map((est) => (
          <EstablecimientoJugador
            key={est.id}
            establecimiento={est}
            date={dateSelect}
          />
        ))}
      </HStack>
    </>
  );
}
