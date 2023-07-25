import PaymentForm from "../../components/PaymentForm/PaymentForm";
import { Administrador } from "../../models";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "../../utils/api";
import { RegistrarAdmin, apiRegister } from "../../utils/api/auth";
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
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputControl, SubmitButton } from "../../components/forms";

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
      .nullable()
      .required("Obligatorio"),
  }),
  idSuscripcion: Yup.number().required(),
});

function AdmPage() {
  const { search } = useLocation();
  const idSuscripcion = Number(
    new URLSearchParams(search).get("idSuscripcion")
  );
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate, isError } = useMutation<Administrador, ApiError, FormState>({
    mutationFn: (registrarAdmin) => apiRegister(registrarAdmin),
    onSuccess: () => {
      toast({
        title: "Cuenta registrada correctamente.",
        description: `Inicie sesión para continuar.`,
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
  });

  const methods = useForm<FormState>({
    resolver: yupResolver<FormState>(validationSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      usuario: "",
      telefono: "",
      clave: "",
      correo: "",
      tarjeta: {
        cvv: NaN,
        vencimiento: "",
        nombre: "",
        numero: "",
      },
      idSuscripcion: idSuscripcion,
    },
    mode: "onTouched",
  });
  console.log(methods.getValues());

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

            <SubmitButton>Registrarse</SubmitButton>
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
export default AdmPage;
