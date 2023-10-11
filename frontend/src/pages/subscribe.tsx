import PaymentForm from "@/components/forms/PaymentForm";
import { useLocation, useNavigate } from "react-router";
import { RegistrarAdmin, useRegistrarAdmin } from "@/utils/api";
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
import {
  InputControl,
  PasswordControl,
  SubmitButton,
} from "@/components/forms";
import { useYupForm } from "@/hooks/useYupForm";

const today = new Date();
const currentYear = today.getFullYear() % 100;

// Valida que la tarjeta no vence antes del mes siguiente al actual.
const validarVencimientoCvv = (value: any) => {
  const [inputMonth, inputYear] = value.split("/").map(Number);
  const currentMonth = today.getMonth() + 1;
  const monthDiff = (inputYear - currentYear) * 12 + inputMonth - currentMonth;
  return monthDiff >= 2;
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
      .required("Obligatorio")
      .test("No debe vencer el mes siguiente", validarVencimientoCvv),
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

  const methods = useYupForm<RegistrarAdmin>({
    validationSchema,
    defaultValues: {
      tarjeta: {
        vencimiento: "",
        numero: "",
        nombre: "",
      },
      idSuscripcion: Number(idSuscripcion),
    },
  });

  const { mutate, isLoading, isError } = useRegistrarAdmin({
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
            <PasswordControl
              label="Contraseña"
              placeholder=" "
              name="clave"
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
