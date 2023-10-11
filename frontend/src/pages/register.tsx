import { useNavigate } from "react-router";
import * as Yup from "yup";
import {
  Heading,
  VStack,
  Alert,
  Text,
  HStack,
  useToast,
  Box,
} from "@chakra-ui/react";
import { FormProvider, useWatch } from "react-hook-form";
import { InputControl, SubmitButton, SelectControl } from "@/components/forms";
import { RegistrarJugador, useRegistrarJugador } from "@/utils/api";
import { useYupForm } from "@/hooks/useYupForm";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { DISCIPLINAS } from "@/utils/constants";
import { useLocalidadesByProvincia, useProvincias } from "@/utils/api";

const validationSchema = Yup.object({
  nombre: Yup.string().required("Obligatorio"),
  apellido: Yup.string().required("Obligatorio"),
  usuario: Yup.string().required("Obligatorio"),
  telefono: Yup.string().required("Obligatorio"),
  correo: Yup.string()
    .email("Formato de correo inválido")
    .required("Obligatorio"),
  clave: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("Obligatorio"),
  localidad: Yup.string().optional(),
  provincia: Yup.string().optional(),
  disciplina: Yup.string().optional(),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const methods = useYupForm<RegistrarJugador>({
    validationSchema,
  });

  const { data: provincias } = useProvincias();

  const provincia = useWatch({ name: "provincia", control: methods.control });
  const { data: localidades } = useLocalidadesByProvincia(provincia);
  useEffect(() => {
    methods.resetField("localidad");
  }, [provincia, methods]);

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

  return (
    <>
      <Heading
        textAlign="center"
        size="2xl"
        fontSize="40px"
        mt="60px"
        mb="60px"
      >
        Registrarse en Play Finder
      </Heading>
      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit((values) => mutate(values))}
          spacing="4"
          width="-webkit-fit-content"
          maxW="400px"
          justifyContent="center"
          margin="auto"
          my="20px"
        >
          <Box alignSelf="start">
            <Heading size="md">Perfil</Heading>
            <Text alignSelf="start">
              Con estos datos podés acceder a tu cuenta.
            </Text>
          </Box>
          <HStack>
            <InputControl
              label="Nombre"
              placeholder="Nombre"
              name="nombre"
              isRequired
            />
            <InputControl
              label="Apellido"
              placeholder="Apellido"
              name="apellido"
              isRequired
            />
          </HStack>
          <HStack>
            <InputControl
              label="Usuario"
              placeholder="usuario"
              name="usuario"
              isRequired
            />
            <InputControl
              label="Teléfono"
              placeholder="..."
              name="telefono"
              type="tel"
              isRequired
            />
          </HStack>
          <InputControl
            label="Correo electrónico"
            placeholder="abc@ejemplo.com"
            name="correo"
            type="email"
            isRequired
          />
          <InputControl
            label="Contraseña"
            placeholder=" "
            name="clave"
            type="password"
            isRequired
          />
          <Box alignSelf="start" mt="20px">
            <Heading size="md">Preferencias</Heading>
            <Text alignSelf="start">
              Estos datos opcionales nos facilitan mostrarte las canchas que más
              te puedan interesar.
            </Text>
          </Box>
          <HStack>
            <SelectControl
              name="provincia"
              label="Provincia"
              placeholder="Provincia"
              children={provincias?.sort().map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            />
            <SelectControl
              name="localidad"
              label="Localidad"
              placeholder="Localidad"
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
          </HStack>
          <SelectControl
            placeholder="Seleccionar disciplina "
            name="disciplina"
            label="Disciplina"
          >
            {DISCIPLINAS.map((disciplina, i) => (
              <option key={i} value={disciplina}>
                {disciplina}
              </option>
            ))}
          </SelectControl>
          <SubmitButton isLoading={isLoading}>Registrarse</SubmitButton>
          {isError && (
            <Alert status="error" margin="20px">
              Error al intentar registrarse. Intente de nuevo.
            </Alert>
          )}
          <Text>
            ¿Ya tiene una cuenta?{" "}
            <Link to="/login" style={{ color: "blue" }}>
              Inicie sesión
            </Link>
          </Text>
        </VStack>
      </FormProvider>
    </>
  );
}
