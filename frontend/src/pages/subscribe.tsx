import PaymentForm from "@/components/PaymentForm/PaymentForm";
import { Administrador } from "@/models";
import { useLocation, useNavigate } from "react-router";
import { ApiError } from "@/utils/api";
import { RegistrarAdmin, apiRegister } from "@/utils/api/auth";
import * as Yup from "yup";
import {
  HStack,
  VStack,
  Alert,
  useToast,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import { InputControl, SubmitButton } from "@/components/forms";
import useMutationForm from "@/hooks/useMutationForm";

type FormState = RegistrarAdmin & {
  clave: string;
};

const validationSchema = Yup.object({
  nombre: Yup.string().required("Obligatorio"),
  apellido: Yup.string().required("Obligatorio"),
  usuario: Yup.string().required("Obligatorio"),
  telefono: Yup.string().required("Obligatorio"),
  clave: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("Obligatorio"),
  correo: Yup.string()
    .email("Formato de correo inválido")
    .required("Obligatorio"),
  tarjeta: Yup.object({
    cvv: Yup.number()
      .min(100, "3 o 4 dígitos")
      .max(9_999, "3 o 4 dígitos")
      .required("Obligatorio"),
    vencimiento: Yup.string()
      .matches(/\d\d\/\d\d\d?\d?/, "formato 'MM/AA'")
      .required("Obligatorio"),
    nombre: Yup.string().required("Obligatorio"),
    numero: Yup.string()
      .matches(/[0-9]+/, "Debe ser un número")
      .min(15, "Deben ser entre 15 y 19 dígitos")
      .max(19, "Deben ser entre 15 y 19 dígitos")
      .required("Obligatorio"),
  }),
  idSuscripcion: Yup.number().required(),
});

export default function SubscribePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { search } = useLocation();
  const idSuscripcion = new URLSearchParams(search).get("idSuscripcion");

  const { methods, mutate, isLoading, isError } = useMutationForm<
    Administrador,
    ApiError,
    FormState
  >({
    validationSchema,
    mutationFn: (registrarAdmin) => apiRegister(registrarAdmin),
    onSuccess: () => {
      toast({
        title: "Cuenta registrada correctamente.",
        description: "Inicie sesión para continuar.",
        status: "success",
        isClosable: true,
      });
      navigate("/login");
    },
    onError: () => {
      toast({
        title: "Error al registrar su cuenta.",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
    defaultValues: {
      tarjeta: {
        cvv: undefined,
        vencimiento: "",
        numero: "",
        nombre: "",
      },
      idSuscripcion: Number(idSuscripcion),
    },
    mode: "onTouched",
  });

  return (
    <>
      <Box m="50px">
        <FormProvider {...methods}>
          <Heading size="md">Tarjeta de crédito</Heading>
          <Text>
            Se le facturará una cuota cada 30 días, desde el momento en el que
            se registra su cuenta. Se puede dar de baja en cualquier momento.
          </Text>
          <PaymentForm />

          <Heading size="md">Cuenta</Heading>
          <Text> Ingrese sus datos. Los usará para iniciar sesión.</Text>

          <VStack
            as="form"
            onSubmit={methods.handleSubmit((values) => mutate(values))}
            spacing="4"
            width="400px"
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

            <SubmitButton isLoading={isLoading}>Registrarse</SubmitButton>
            {isError && (
              <Alert status="error">
                Error al intentar registrar su cuenta. Intente de nuevo
              </Alert>
            )}
          </VStack>
        </FormProvider>
      </Box>
    </>
  );
}
