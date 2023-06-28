import React from "react";
import './NewCourt.css';
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
import { Textarea } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  Alert,
  Button,
} from "@chakra-ui/react";
import SelectableButton from "../../components/SelectableButton/SelectableButton";

type FormState = Administrador & {
  clave: string;
  imagen: File | undefined;
};

function NewCourt() {
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
      imagen: undefined, // Agregar la propiedad 'imagen' con valor undefined
    });
    
    const { mutate, isError } = useMutation<Administrador, ApiError, FormState>({
      mutationFn: ({ clave, ...admin }) => apiRegister(admin, clave),
      onSuccess: () => navigate("/landing"),
    });

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

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setState({
        ...state,
        imagen: e.target.files ? e.target.files[0] : undefined,
      });
    };

    const horas = [
      { value: 'option1', label: '1:00hs' },
      { value: 'option2', label: '2:00hs' },
      { value: 'option3', label: '3:00hs' },
      { value: 'option4', label: '4:00hs' },
      { value: 'option5', label: '5:00hs' },
      { value: 'option6', label: '6:00hs' },
      { value: 'option7', label: '7:00hs' },
      { value: 'option8', label: '8:00hs' },
      { value: 'option9', label: '9:00hs' },
      { value: 'option10', label: '10:00hs' },
      { value: 'option11', label: '11:00hs' },
      { value: 'option12', label: '12:00hs' },
      { value: 'option13', label: '13:00hs' },
      { value: 'option14', label: '14:00hs' },
      { value: 'option15', label: '15:00hs' },
      { value: 'option16', label: '16:00hs' },
      { value: 'option17', label: '17:00hs' },
      { value: 'option18', label: '18:00hs' },
      { value: 'option19', label: '19:00hs' },
      { value: 'option20', label: '20:00hs' },
      { value: 'option21', label: '21:00hs' },
      { value: 'option22', label: '22:00hs' },
      { value: 'option23', label: '23:00hs' },
      { value: 'option24', label: '24:00hs' }
    ];
    
    const disciplinas = [
      { value: 'futbol', label: 'Fútbol' },
      { value: 'basquetbol', label: 'Básquetbol' },
      { value: 'tenis', label: 'Tenis' },
      { value: 'natacion', label: 'Natación' },
      { value: 'atletismo', label: 'Atletismo' },
      { value: 'gimnasia', label: 'Gimnasia' },
      { value: 'volleyball', label: 'Volleyball' },
      { value: 'boxeo', label: 'Boxeo' },
      { value: 'karate', label: 'Karate' },
      { value: 'hockey', label: 'Hockey' },
      { value: 'rugby', label: 'Rugby' },
      { value: 'padel', label: 'Pádel' },
      { value: 'squash', label: 'Squash' },
      { value: 'beisbol', label: 'Béisbol' },
      { value: 'softbol', label: 'Softbol' }
    ];
    
    return (
      <div className="page">
        <TopMenu />
          <div className="centrado">
          <br/>
            <h1>Nueva cancha</h1>
            </div>
            <br/>
            <form onSubmit={handleSubmit}>
            <VStack spacing="4" width="500px" justifyContent="center" margin="auto">
            <FormControl
              variant="floating"
              id="telefono"
              isRequired
              onChange={handleChange}>
              <Input placeholder="Cancha1" name="telefono" type="tel" />
              <FormLabel>Nombre de cancha</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="usuario"
              isRequired
              onChange={handleChange}>
              <Textarea placeholder=' ' />
              <FormLabel>Descripción</FormLabel>
            </FormControl>
            <Input
                  type="file"
                  name="imagen"
                  onChange={handleImagenChange}
                  accept="image/*"
                  sx={{
                    "::file-selector-button": {
                      height: 10,
                      padding: 0,
                      mr: 4,
                      background: "none",
                      border: "none",
                      fontWeight: "bold",
                    },
                  }}
            />
          </VStack>
          <div className="formulario"> </div>
          <div className="margen">
            <h3>Disponibilidad horaria</h3>
            <p> En qué rangos horarios la cancha estará disponible y para qué disciplinas.</p>
            {isError && (
              <Alert status="error" margin="20px">
                Datos incorrectos. Intente de nuevo
              </Alert>
            )}
            <Button > Agregar disponibilidad + </Button>
          </div>
            <br/>
          <VStack spacing="4" width="900px" justifyContent="center" margin="auto">
            <HStack width="600px">
              <FormControl
                variant="floating"
                id="nombre"
                isRequired
                onChange={handleChange}>
                <Select placeholder='Seleccione una opcion'>
                {disciplinas.map((disciplina) => (
                  <option key={disciplina.value} value={disciplina.value}>
                    {disciplina.label}
                  </option>))
              }
              </Select>
                <FormLabel>Disciplina</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="duracionreserva"
                isRequired
                onChange={handleChange}>
                <Input placeholder=" " name="duracionreserva" />
                <FormLabel>Duracion de la reserva</FormLabel>
              </FormControl>
            </HStack>
            <HStack width="600px">
              <FormControl
                variant="floating"
                id="hora-inicio"
                isRequired
                onChange={handleChange}>
                <Select placeholder='Seleccione una opcion'>
                {horas.map((hora) => (
                  <option key={hora.value} value={hora.value}>
                    {hora.label}
                  </option>))
                  }
                </Select>
                <FormLabel>Hora inicio</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="reserva"
                isRequired
                onChange={handleChange}>
                <Input placeholder=" " name="reserva" />
                <FormLabel>Precio de la reserva</FormLabel>
              </FormControl>
            </HStack>
          
            <HStack width="600px">
              <FormControl
                variant="floating"
                id="hora-fin"
                isRequired
                onChange={handleChange}>
                <Select placeholder='Seleccione una opcion'>
                {horas.map((hora) => (
                  <option key={hora.value} value={hora.value}>
                    {hora.label}
                  </option>))
                }
              </Select>
                <FormLabel>Hora fin</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="precioseña"
                isRequired
                onChange={handleChange}>
                <Input placeholder=" " name="precioseña" />
                <FormLabel>Precio de la seña</FormLabel>
              </FormControl>
            </HStack>
          </VStack>
          <div className="margen">
            <p> Seleccionar los días para  la disponibilidad.</p>
          </div>
            <br/>
          <div className="centrado2">
            <SelectableButton children= 'Lunes'/>
            <SelectableButton children= 'Martes'/>
            <SelectableButton children= 'Miercoles'/>
            <SelectableButton children= 'Jueves'/>
            <SelectableButton children= 'Viernes'/>
            <SelectableButton children= 'Sabado'/>
            <SelectableButton children= 'Domingo'/>
          </div>
            <br/>
            <br/>

          <div className="centrado">
            <Button
              type="submit"
              className="btn btn-danger"
              onClick={validacion}>
                Registrarse
            </Button>
          </div>    
        </form>
        <ToastContainer />
      </div>
    );
}

export default NewCourt;
