import React from "react";
import "./NewCourt.css";
import Modal from "react-overlays/Modal";
import { useState } from "react";
import { JSX } from "react/jsx-runtime";
import { Administrador, Cancha } from "../../models";
import { useLocation, useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "../../utils/api";
import TopMenu from "../../components/TopMenu/TopMenu";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { CrearCanchaReq, crearCancha } from "../../utils/api/canchas";

type FormState = CrearCanchaReq & {
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
  const { idEst } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<FormState>({
    nombre: "",
    descripcion: "",
    estaHabilitada: true,
    idEstablecimiento: Number(idEst),
    imagen: undefined,
    disciplinas: [],
  });

  const { mutate, isError } = useMutation<Cancha, ApiError, FormState>({
    mutationFn: ({ imagen, ...cancha }) => crearCancha(cancha, imagen),
    onSuccess: () => navigate("/landing"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(state);
    setState({ ...state, [name]: value });
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      imagen: e.target.files ? e.target.files[0] : undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(state);
  };

  return (
    <div className="page">
      <TopMenu />
      <div className="centrado">
        <br />
        <h1>Nueva cancha</h1>
      </div>
      <br />
      <form onSubmit={handleSubmit}>
        <VStack spacing="4" width="500px" justifyContent="center" margin="auto">
          <FormControl
            variant="floating"
            id="nombre"
            isRequired
            onChange={handleChange}
          >
            <Input placeholder="Nombre" name="nombre" />
            <FormLabel>Nombre de la cancha</FormLabel>
          </FormControl>
          <FormControl
            variant="floating"
            id="descripcion"
            isRequired
            onChange={handleChange}
          >
            <Input placeholder="Descripción" name="descripcion" />
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
        <div className="centrado">
          <br />
          <Button type="submit" className="btn btn-danger">
            Crear cancha
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewCourt;

/*
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
                  </option>
                ))}
              </Select>
              <FormLabel>Hora inicio</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="reserva"
              isRequired
              onChange={handleChange}
            >
              <Input placeholder=" " name="reserva" />
              <FormLabel>Precio de la reserva</FormLabel>
            </FormControl>
          </HStack>

          <HStack width="600px">
            <FormControl
              variant="floating"
              id="hora-fin"
              isRequired
              onChange={handleChange}
            >
              <Select placeholder="Seleccione una opcion">
                {horas.map((hora) => (
                  <option key={hora.value} value={hora.value}>
                    {hora.label}
                  </option>
                ))}
              </Select>
              <FormLabel>Hora fin</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="precioseña"
              isRequired
              onChange={handleChange}
            >
              <Input placeholder=" " name="precioseña" />
              <FormLabel>Precio de la seña</FormLabel>
            </FormControl>
          </HStack>
        </VStack>
        <div className="margen">
          <p> Seleccionar los días para la disponibilidad.</p>
        </div>
        <br />
        <div className="centrado2">
          <SelectableButton children="Lunes" />
          <SelectableButton children="Martes" />
          <SelectableButton children="Miercoles" />
          <SelectableButton children="Jueves" />
          <SelectableButton children="Viernes" />
          <SelectableButton children="Sabado" />
          <SelectableButton children="Domingo" />
        </div>
        <br />
        <br />

          <div className="centrado">
          */
