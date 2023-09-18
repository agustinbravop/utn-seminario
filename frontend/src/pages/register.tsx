import { useNavigate } from "react-router";
import * as Yup from "yup";
import {
  Heading,
  VStack,
  Alert,
  Text,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { FormProvider, useWatch } from "react-hook-form";
import { InputControl, SubmitButton, SelectControl } from "@/components/forms";
import { RegistrarJugador, useRegistrarJugador } from "@/utils/api/auth";
import { useYupForm } from "@/hooks/useYupForm";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { DISCIPLINAS } from "@/utils/consts";
import { useLocalidadesByProvincia, useProvincias } from "@/utils/api/geo";

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
        marginTop="100px"
        marginBottom="60px"
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
              label="Nombre de usuario"
              placeholder="usuario"
              minWidth="180px"
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
          >
            {DISCIPLINAS.map((disciplina, i) => (
              <option key={i} value={disciplina}>
                {disciplina}
              </option>
            ))}
          </SelectControl>
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
