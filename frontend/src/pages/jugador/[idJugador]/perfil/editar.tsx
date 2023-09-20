import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Box,
  useToast,
  Center,
  Button,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useModificarJugador } from "@/utils/api/auth";
import { FormProvider, useWatch } from "react-hook-form";
import { InputControl, ConfirmSubmitButton, SelectControl } from "@/components/forms";
import { useNavigate } from "react-router";
import { useCurrentJugador, useYupForm } from "@/hooks";
import { useLocalidadesByProvincia, useProvincias } from "@/utils/api/geo";
import { useEffect } from "react";
import { DISCIPLINAS } from "@/utils/consts";

const validationSchema = Yup.object({
  id: Yup.number(),
  nombre: Yup.string().required("Debe ingresar su nombre"),
  apellido: Yup.string().required("Debe ingresar su apellido"),
  telefono: Yup.string().required("Debe ingresar su telefono"),
  correo: Yup.string()
    .email("Formato erroneo")
    .required("Debe tener un correo"),
  usuario: Yup.string().required("Debe ingresar un nombre de usuario"),
});


export default function JugadorEditarPerfilPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const { jugador } = useCurrentJugador();


  const { data: provincias } = useProvincias();

  const methods = useYupForm({ validationSchema, resetValues: jugador });
  const { mutate, isLoading } = useModificarJugador({
    onSuccess: () => {
      toast({
        title: "Perfil actualizado",
        description: "Perfil actualizado exitosamente.",
        status: "success",
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al intentar editar el perfil",
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  const provincia = useWatch({ name: "provincia", control: methods.control });
  const { data: localidades } = useLocalidadesByProvincia(provincia);
  useEffect(() => {
    methods.resetField("localidad");
  }, [provincia, methods]);

  return (
    <Card m="auto" maxWidth="400px" height="70%" mt="5%">
      <CardHeader>
        <Heading size="lg" textAlign="center">
          Editar Perfil
        </Heading>
      </CardHeader>
      <CardBody marginTop="28px">
        <FormProvider {...methods}>
          <Stack
            divider={<StackDivider />}
            spacing="2.5"
            marginTop="-2rem"
            as="form"
          >
            <Box>
              <Heading size="xs">Nombre</Heading>
              <InputControl isRequired name="nombre" />
            </Box>
            <Box>
              <Heading size="xs">Apellido</Heading>
              <InputControl isRequired name="apellido" />
            </Box>
            <Box>
              <Heading size="xs">Usuario</Heading>
              <InputControl isRequired name="usuario" />
            </Box>
            <Box>
              <Heading size="xs">Correo</Heading>
              <InputControl isRequired name="correo" />
            </Box>
            <Box>
              <Heading size="xs">Teléfono</Heading>
              <InputControl isRequired name="telefono" />
            </Box>
            <Box>
              <Heading size="xs">Provincia</Heading>
              <SelectControl
                name="provincia"
                placeholder="Provincia"
                isRequired
                children={provincias?.sort().map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              />
            </Box>
            <Box>
              <Heading size="xs">Localidad</Heading>
            <SelectControl
                name="localidad"
                placeholder="Localidad"
                isRequired
              >
                {localidades.sort().map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
                <option key="Otra" value="Otra">
                  Otra
                </option>
              </SelectControl>
            </Box>
            <Box>
              <Heading size="xs">Disciplina</Heading>
            <SelectControl
                name="disciplina"
                placeholder="Disciplina"
                isRequired
              >
                {DISCIPLINAS.sort().map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </SelectControl>
            </Box>
            <Center>
              <Button onClick={() => navigate(-1)} mr={15}>
                Cancelar
              </Button>
              <ConfirmSubmitButton
                header="Modificar"
                body="¿Está seguro de modificar la información de su perfil?"
                onSubmit={methods.handleSubmit((values) => mutate(values))}
                isLoading={isLoading}
              >
                Guardar
              </ConfirmSubmitButton>
            </Center>
          </Stack>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
