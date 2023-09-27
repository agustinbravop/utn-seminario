import EstablecimientoJugador from "@/components/EstablecimientoJugador/EstablecimientoJugador";
import { useBuscarEstablecimientos } from "@/utils/api/establecimientos";
import { SearchIcon } from "@chakra-ui/icons";
import {
  HStack,
  Heading,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { formatearFecha } from "@/utils/dates";
import { useCurrentJugador, useYupForm } from "@/hooks";
import { useWatch } from "react-hook-form";
import { DISCIPLINAS, QuestionImage } from "@/utils/consts";
import { useLocalidadesByProvincia, useProvincias } from "@/utils/api/geo";
import { InputControl, SelectControl } from "@/components/forms";
import { Busqueda } from "@/models";
import { FormProvider } from "react-hook-form";
import DateControl from "@/components/forms/DateControl";
import { useEffect } from "react";

export default function SearchEstab() {
  const { jugador } = useCurrentJugador();
  const provincias = useProvincias();

  const methods = useYupForm<Busqueda>({
    defaultValues: {
      localidad: jugador.localidad,
      provincia: jugador.provincia,
      disciplina: jugador.disciplina,
      fecha: formatearFecha(new Date()),
    },
  });

  const values = useWatch({ control: methods.control });
  const { data: ests } = useBuscarEstablecimientos({ ...values });
  const { data: localidades } = useLocalidadesByProvincia(values.provincia);
  useEffect(() => {
    // Evitar que la localidad quede desincronizada con los Select de la interfaz.
    if (!localidades.includes(values.localidad ?? "")) {
      methods.setValue("localidad", undefined);
    }
  }, [values.localidad, localidades, methods]);

  return (
    <>
      <Heading size="md" textAlign="center">
        Buscá un establecimiento para jugar
      </Heading>
      <FormProvider {...methods}>
        <VStack
          gap="0.3rem"
          bg="#e9eef1"
          mt="15px"
          mx="auto"
          p="0.3rem"
          width="360px"
          borderRadius="10px"
        >
          <HStack spacing="0.3rem">
            <SelectControl
              name="provincia"
              borderRadius="10px"
              bg="white"
              placeholder="Provincia"
              mr="0px"
            >
              {provincias.data?.sort().map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </SelectControl>
            <SelectControl
              name="localidad"
              bg="white"
              borderRadius="10px"
              ml="0px"
              placeholder="Localidad"
              value={values.localidad}
            >
              {localidades.sort().map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
              <option key="Otra">Otra</option>
            </SelectControl>
          </HStack>
          <SelectControl
            borderRadius="10px"
            name="disciplina"
            bg="white"
            placeholder="Disciplina"
          >
            {DISCIPLINAS.sort().map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </SelectControl>
          <DateControl
            bg="white"
            borderRadius="10px"
            name="fecha"
            size="md"
            width="100%"
          />
          <InputControl
            bg="white"
            borderRadius="10px"
            name="nombre"
            rightElement={
              <InputRightElement>
                <SearchIcon color="gray.300" />
              </InputRightElement>
            }
            _placeholder={{ color: "#1a202c" }}
            placeholder="Nombre del establecimiento"
            size="md"
            width="100%"
          />
        </VStack>
      </FormProvider>
      <HStack flexWrap="wrap" justifyContent="center" pt="20px" w="330">
        {ests.length > 0 ? (
          ests.map((est) => (
            <EstablecimientoJugador
              key={est.id}
              establecimiento={est}
              date={values.fecha ?? formatearFecha(new Date())}
            />
          ))
        ) : (
          <VStack>
            <QuestionImage />
            <Text>No se encontraron establecimientos.</Text>
          </VStack>
        )}
      </HStack>
    </>
  );
}
