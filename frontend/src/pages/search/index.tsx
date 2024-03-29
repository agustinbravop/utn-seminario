import { EstablecimientoCardJugador } from "@/components/display";
import {
  BusquedaEstablecimientos,
  useBuscarEstablecimientos,
  useLocalidadesByProvincia,
} from "@/utils/api";
import { floatingLabelActiveStyles } from "@/themes/components";
import { SearchIcon } from "@chakra-ui/icons";
import {
  FormLabel,
  HStack,
  Heading,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { formatFecha } from "@/utils/dates";
import { useYupForm, useBusqueda, useFormSearchParams } from "@/hooks";
import { useWatch, FormProvider } from "react-hook-form";
import { DISCIPLINAS } from "@/utils/constants";
import { InputControl, SelectControl } from "@/components/forms";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/feedback";
import {
  DateControl,
  SelectProvinciaControl,
  SelectLocalidadControl,
} from "@/components/forms";
import { QuestionAlert } from "@/components/media-and-icons";

export default function BuscarEstablecimientosPage() {
  const { filtros, updateFiltros, setFiltro } = useBusqueda();
  const methods = useYupForm<BusquedaEstablecimientos>({
    defaultValues: { ...filtros, nombre: "" },
  });
  const values = useWatch({ control: methods.control });
  useEffect(() => {
    updateFiltros(values);
  }, [values, updateFiltros]);
  // Si `useFormSearchParams()` va antes del `useEffect()` no se cargan las preferencias del usuario.
  useFormSearchParams({ watch: methods.watch, setValue: methods.setValue });

  const { data: ests, isFetched } = useBuscarEstablecimientos({
    ...values,
    disciplina: values.disciplina || undefined,
  });
  const { data: localidades } = useLocalidadesByProvincia(values.provincia);
  useEffect(() => {
    // Evita que la localidad quede desincronizada con los `Select` de la interfaz.
    if (!localidades.includes(values.localidad ?? "")) {
      methods.setValue("localidad", undefined);
      setFiltro("localidad", "");
    }
  }, [values.localidad, localidades, methods, setFiltro]);

  return (
    <>
      <Heading size="lg" textAlign="center">
        Buscá un establecimiento para jugar
      </Heading>
      <FormProvider {...methods}>
        <VStack
          gap="0.65rem"
          bg="#e9eef1"
          mt="1.5em"
          mx="auto"
          p="0.3rem"
          maxWidth="360px"
          borderRadius="10px"
        >
          <HStack spacing="0.3rem">
            <SelectProvinciaControl
              name="provincia"
              placeholder="Todas"
              borderRadius="10px"
              bg="white"
              mr="0px"
            />
            <SelectLocalidadControl
              name="localidad"
              placeholder="Todas"
              borderRadius="10px"
              bg="white"
              ml="0px"
              value={values.localidad}
              provincia={values.provincia}
            />
          </HStack>
          <SelectControl
            label="Disciplina"
            name="disciplina"
            placeholder="Todas"
            borderRadius="10px"
            bg="white"
          >
            {DISCIPLINAS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </SelectControl>
          <DateControl
            name="fecha"
            label="Fecha"
            bg="white"
            borderRadius="10px"
            size="md"
            w="100%"
            min={formatFecha(new Date())}
          />
          <InputControl
            name="nombre"
            placeholder="Nombre"
            bg="white"
            borderRadius="10px"
            size="md"
            w="100%"
            label={
              <FormLabel sx={{ ...floatingLabelActiveStyles }}>
                Establecimiento
              </FormLabel>
            }
            rightElement={
              <InputRightElement>
                <SearchIcon color="gray" />
              </InputRightElement>
            }
          />
        </VStack>
      </FormProvider>

      <HStack
        maxW="1400px"
        m="auto"
        pt="20px"
        justify="center"
        flexWrap="wrap"
        gap="1.5em"
      >
        {ests.length > 0 ? (
          ests.map((est) => (
            <EstablecimientoCardJugador
              key={est.id}
              establecimiento={est}
              fecha={values.fecha ?? formatFecha(new Date())}
            />
          ))
        ) : isFetched ? (
          <QuestionAlert>
            No se encontraron establecimientos con esos filtros.
          </QuestionAlert>
        ) : (
          <LoadingSpinner />
        )}
      </HStack>
    </>
  );
}
