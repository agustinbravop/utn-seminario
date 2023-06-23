import React from "react";
import "./AdmPage.css";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import Modal from "react-overlays/Modal";
import { useState } from "react";
import { JSX } from "react/jsx-runtime";
import { Administrador, Tarjeta } from "../../types";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ApiError, apiRegister } from "../../utils/api";
import TopMenu from "../../components/TopMenu/TopMenu";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  Alert,
  Button,
} from "@chakra-ui/react";

type FormState = Administrador & {
  clave: string;
};

function AdmPage() {
  const [showModal, setShowModal] = useState(false);
  const renderBackdrop = (
    props: JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLDivElement> &
      React.HTMLAttributes<HTMLDivElement>
  ) => <div className="backdrop" {...props} />;
  var handleClose = () => setShowModal(false);
  var handleSuccess = () => {
    console.log(":)");
  };
  const { search } = useLocation();
  const idSuscripcion = Number(
    new URLSearchParams(search).get("idSuscripcion")
  );
  const navigate = useNavigate();

  const [state, setState] = useState<FormState>({
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
  });

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
      autoClose: 5000,
      progress: 1,
      closeOnClick: true,
      hideProgressBar: false,
      draggable: true,
    });
  };
  const validacion = () => {
    let result = false;

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

    if ((state.usuario === "" || state.usuario === null) && result === false) {
      result = true;
      advertencia("El campo Nombre de Usuario no puede estar vacio");
    }

    if ((state.correo === "" || state.correo === null) && result === false) {
      result = true;
      advertencia("El campo correo electronico no puede estar vacio");
    }

    if ((state.clave === "" || state.clave === null) && result === false) {
      result = true;
      advertencia("El campo constraseña no puede estar vacio");
    }
  };

  return (
    <div className="page">
      <TopMenu />
      <form onSubmit={handleSubmit}>
        <div className="margen">
          <h2>Tarjeta de crédito</h2>
          <p>
            Se factura una cuota cada 30 días. Se puede dar de baja en cualquier
            momento.
          </p>
        </div>
        <div className="formulario">
          <PaymentForm tarjeta={state.tarjeta} setTarjeta={setTarjeta} />
        </div>

        <div className="margen">
          <h2>Cuenta</h2>
          <p> Ingrese sus datos a usar para iniciar sesión.</p>
          {isError && (
            <Alert status="error" margin="20px">
              Datos incorrectos. Intente de nuevo
            </Alert>
          )}
        </div>

        <VStack spacing="4" width="400px" justifyContent="center" margin="auto">
          <HStack>
            <FormControl
              variant="floating"
              id="nombre"
              isRequired
              onChange={handleChange}
            >
              <Input placeholder="Nombre" name="nombre" />
              <FormLabel>Nombre</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="apellido"
              isRequired
              onChange={handleChange}
            >
              <Input placeholder="Apellido" name="apellido" />
              <FormLabel>Apellido</FormLabel>
            </FormControl>
          </HStack>
          <FormControl
            variant="floating"
            id="telefono"
            isRequired
            onChange={handleChange}
          >
            <Input placeholder="0" name="telefono" type="tel" />
            <FormLabel>Teléfono</FormLabel>
          </FormControl>
          <FormControl
            variant="floating"
            id="usuario"
            isRequired
            onChange={handleChange}
          >
            <Input placeholder="Usuario" name="usuario" />
            <FormLabel>Nombre de usuario</FormLabel>
          </FormControl>
          <FormControl
            variant="floating"
            id="correo"
            isRequired
            onChange={handleChange}
          >
            <Input placeholder="abc@ejemplo.com" type="email" name="correo" />
            <FormLabel>Correo electrónico</FormLabel>
          </FormControl>
          <FormControl
            variant="floating"
            id="clave"
            isRequired
            onChange={handleChange}
          >
            <Input name="clave" placeholder=" " type="password" />
            <FormLabel>Contraseña</FormLabel>
          </FormControl>

          <div className="centrado">
            <Button
              type="submit"
              className="btn btn-danger"
              onClick={validacion}
            >
              Registrarse
            </Button>
          </div>
        </VStack>
      </form>
      <ToastContainer />

      <Modal
        className="modal"
        show={showModal}
        onHide={handleClose}
        renderBackdrop={renderBackdrop}
      >
        <div>
          <div className="modal-header">
            <div className="modal-title">Confirmar Cancelación</div>
            <div>
              <span className="close-button" onClick={handleClose}>
                x
              </span>
            </div>
          </div>
          <div className="modal-desc">
            <p>¿Desea cancelar?</p>
          </div>
          <div className="modal-footer">
            <button className="secondary-button" onClick={handleClose}>
              Cancelar
            </button>
            <button className="primary-button" onClick={handleSuccess}>
              Aceptar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        className="modal"
        show={showModal}
        onHide={handleClose}
        renderBackdrop={renderBackdrop}
      >
        <div>
          <div className="modal-header">
            <div className="modal-title">Confirmar Cancelación</div>
            <div>
              <span className="close-button" onClick={handleClose}>
                x
              </span>
            </div>
          </div>
          <div className="modal-desc">
            <p>¿Desea cancelar?</p>
          </div>
          <div className="modal-footer">
            <button className="secondary-button" onClick={handleClose}>
              Cancelar
            </button>
            <button className="primary-button" onClick={handleSuccess}>
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default AdmPage;
