import "./AdmPage.css";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import { Administrador, Tarjeta } from "../../types";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ApiError, apiRegister } from "../../utils/api";
import TopMenu from "../../components/TopMenu/TopMenu";
import * as Yup from "yup";
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  Alert,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";

type FormState = Administrador & {
  clave: string;
};

function AdmPage() {
  const { search } = useLocation();
  const idSuscripcion = Number(
    new URLSearchParams(search).get("idSuscripcion")
  );
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate, isLoading, isError } = useMutation<
    Administrador,
    ApiError,
    FormState
  >({
    mutationFn: ({ clave, ...admin }) => apiRegister(admin, clave),
    onSuccess: () => {
      toast({
        title: "Cuenta registrada correctamente.",
        description: `Inicie sesión para continuar.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al registrar su cuenta.",
        description: `Intente de nuevo.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

<<<<<<< HEAD
  const { mutate, isError } = useMutation<Administrador, ApiError, FormState>({
    mutationFn: ({ clave, ...admin }) => apiRegister(admin, clave),
    onSuccess: () => navigate("/landing"),
  });

  const setTarjeta = (t: Tarjeta) => {
    setState({ ...state, tarjeta: t });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(state);
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(state);
  };

  const advertencia = (message: string) => {
    toast.warning(message, {
      position: "top-center",
<<<<<<< HEAD
      autoClose:5000,
      progress:1, 
      closeOnClick: true, 
      hideProgressBar: false, 
      draggable: true
    })
  }
  const validacion = () => { 
    let result=false; 
 
    if ((state.nombre==='' || state.nombre===null) && result===false) { 
      result=true; 
      advertencia("El campo Nombre no puede estar vacio")
    }

    if ((state.apellido==='' || state.apellido === null) && result===false) { 
      result=true
      advertencia("El campo Apellido no puede estar vacio")
=======
      autoClose: 5000,
      progress: 1,
      closeOnClick: true,
      hideProgressBar: false,
      draggable: true,
    });
  };
  const validacion = () => {
    let result = false;
>>>>>>> e198ec05b17acca930ee3ae08b128ead3971ff1f

    if ((state.nombre === "" || state.nombre === null) && result === false) {
      result = true;
      advertencia("El campo Nombre no puede estar vacio");
    }

    if (
      (state.apellido === "" || state.apellido === null) &&
      result === false
    ) {
      result = true;
      advertencia("El campo Apellido no puede estar vacio");
    }

    if (
      (state.telefono === "" || state.telefono === null) &&
      result === false
    ) {
      result = true;
      advertencia("El campo telefono no puede estar vacio");
    }
=======
  const { values, setValues, errors, handleSubmit, handleChange } =
    useFormik<FormState>({
      initialValues: {
        nombre: "",
        apellido: "",
        usuario: "",
        telefono: "",
        clave: "",
        correo: "",
        tarjeta: {
          cvv: 0,
          vencimiento: "",
          nombre: "",
          numero: "",
        },
        suscripcion: {
          id: idSuscripcion,
          nombre: "",
          limiteEstablecimientos: 0,
          costoMensual: 0,
        },
      },
      onSubmit: (values) => mutate(values),
      validationSchema: Yup.object({
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
            .min(100, "Solo 3 o 4 dígitos")
            .max(9_999, "Solo 3 o 4 dígitos"),
          vencimiento: Yup.string().matches(
            /\d\d\/\d\d\d?\d?/,
            "Usar formato MM/AA o MM/AAAA"
          ),
          nombre: Yup.string().required("Obligatorio"),
          numero: Yup.string()
            .matches(/[0-9]+/, "Debe ser un número")
            .min(15, "Deben ser entre 15 y 19 dígitos")
            .max(19, "Deben ser entre 15 y 19 dígitos")
            .required("Obligatorio"),
        }),
      }),
    });
>>>>>>> 864bc67d86a3944c8a491f418f84937631672d97

  const setTarjeta = (t: Tarjeta) => {
    setValues({ ...values, tarjeta: t });
  };

  return (
    <div className="page">
      <TopMenu />
<<<<<<< HEAD
      <div className="margen">
        <h2>Tarjeta de credito</h2>
        <p>
          Se factura una cuota cada 30 días. Se puede dar de baja en cualquier
          momento.
        </p>
      </div>

      <br />

      <div className="formulario">
        <Form style={{ width: "50%", marginLeft: "4%" }}>
          <Form.Group>
            <PaymentForm tarjeta={state.tarjeta} setTarjeta={setTarjeta} />
          </Form.Group>
        </Form>
      </div>

      <div className="margen">
        <h2>Cuenta</h2>
        <p> Ingrese sus datos a usar para iniciar sesión.</p>
        {isError  && <Alert variant="danger" dismissible> Datos Incorrectos. Intente de Nuevo</Alert>}
       
      </div>

      <br />

      <div className="formulario">
        <Form style={{ width: "34%" }} onSubmit={handleSubmit}>
          <Form.Group>
            <Container>
              <Row>
                <Col>
                  <FloatingLabel
                    controlId="floatingNombre"
                    label="Nombre"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="nombre"
                      onChange={handleChange}
                      placeholder="Nombre"
                      required
                    />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel
                    controlId="floatingApellido"
                    label="Apellido"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="apellido"
                      onChange={handleChange}
                      placeholder="Apellido"
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FloatingLabel
                    controlId="floatingTelefono"
                    label="Teléfono"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="telefono"
                      onChange={handleChange}
                      placeholder="Teléfono"
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>
=======
      <form onSubmit={handleSubmit}>
        <div className="margen">
          <h2>Tarjeta de crédito</h2>
          <p>
            Se factura una cuota cada 30 días. Se puede dar de baja en cualquier
            momento.
          </p>
        </div>
        <div className="formulario">
          <PaymentForm
            tarjeta={values.tarjeta}
            setTarjeta={setTarjeta}
            errors={errors.tarjeta}
          />
        </div>
>>>>>>> e198ec05b17acca930ee3ae08b128ead3971ff1f

        <div className="margen">
          <h2>Cuenta</h2>
          <p> Ingrese sus datos a usar para iniciar sesión.</p>
        </div>

        <VStack spacing="4" width="400px" justifyContent="center" margin="auto">
          <HStack>
            <FormControl
              variant="floating"
              id="nombre"
              isRequired
              isInvalid={!!errors.nombre && !!values.nombre}
            >
              <Input
                value={values.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                name="nombre"
              />
              <FormLabel>Nombre</FormLabel>
              <FormErrorMessage>{errors.nombre}</FormErrorMessage>
            </FormControl>
            <FormControl
              variant="floating"
              id="apellido"
              isRequired
              isInvalid={!!errors.apellido && !!values.apellido}
            >
              <Input
                value={values.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                name="apellido"
              />
              <FormLabel>Apellido</FormLabel>
              <FormErrorMessage>{errors.apellido}</FormErrorMessage>
            </FormControl>
          </HStack>
          <FormControl
            variant="floating"
            id="telefono"
            isRequired
            isInvalid={!!errors.telefono && !!values.telefono}
          >
            <Input
              value={values.telefono}
              onChange={handleChange}
              placeholder="0"
              name="telefono"
              type="tel"
            />
            <FormLabel>Teléfono</FormLabel>
            <FormErrorMessage>{errors.telefono}</FormErrorMessage>
          </FormControl>
          <FormControl
            variant="floating"
            id="usuario"
            isRequired
            isInvalid={!!errors.usuario && !!values.usuario}
          >
            <Input
              value={values.usuario}
              onChange={handleChange}
              placeholder="Usuario"
              name="usuario"
            />
            <FormLabel>Nombre de usuario</FormLabel>
            <FormErrorMessage>{errors.usuario}</FormErrorMessage>
          </FormControl>
          <FormControl
            variant="floating"
            id="correo"
            isRequired
            isInvalid={!!errors.correo && !!values.correo}
          >
            <Input
              value={values.correo}
              onChange={handleChange}
              placeholder="abc@ejemplo.com"
              type="email"
              name="correo"
            />
            <FormLabel>Correo electrónico</FormLabel>
            <FormErrorMessage>{errors.correo}</FormErrorMessage>
          </FormControl>
          <FormControl
            variant="floating"
            id="clave"
            isRequired
            isInvalid={!!errors.clave && !!values.clave}
          >
            <Input
              value={values.clave}
              onChange={handleChange}
              name="clave"
              placeholder=" "
              type="password"
            />
            <FormLabel>Contraseña</FormLabel>
            <FormErrorMessage>{errors.clave}</FormErrorMessage>
          </FormControl>

          <div className="centrado">
            <Button
              type="submit"
              className="btn btn-danger"
              isLoading={isLoading}
            >
              Registrarse
            </Button>
          </div>
          {isError && (
            <Alert status="error">
              Error al intentar registrar su cuenta. Intente de nuevo
            </Alert>
          )}
        </VStack>
      </form>
    </div>
  );
}
export default AdmPage;
