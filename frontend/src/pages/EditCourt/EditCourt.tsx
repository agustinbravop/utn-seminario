import React, { useEffect } from "react";
import Modal from "react-overlays/Modal"; //AGREGAR EL MODAL DE "¿SEGURO?"
import { useState } from "react";
import { JSX } from "react/jsx-runtime";
import { Cancha } from "../../models";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "../../utils/api";
import { Container, Heading, Textarea, useToast } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  Button,
} from "@chakra-ui/react";
import SelectableButton from "../../components/SelectableButton/SelectableButton";
import {
  ModificarCanchaReq,
  getCanchaByID,
  modificarCancha,
} from "../../utils/api/canchas";
import { readLocalStorage } from "../../utils/storage/localStorage";
import { JWT } from "../../utils/api";

type FormState = ModificarCanchaReq & {
  imagen: File | undefined;
};

function EditCourt() {
  //ACA TA EL MODAL :)

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

  const { idEst, idCancha } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [state, setState] = useState<FormState>({
    id: Number(idCancha),
    nombre: "",
    descripcion: "",
    estaHabilitada: true,
    idEstablecimiento: Number(idEst),
    imagen: undefined,
    disciplinas: [],
  });

  console.log("idCancha:", Number(idCancha), typeof Number(idCancha));
  console.log("idEst:", Number(idEst), typeof Number(idEst));

  const { mutate } = useMutation<Cancha, ApiError, FormState>({
    mutationFn: ({ imagen, ...cancha }) => modificarCancha(cancha, imagen),
    onSuccess: () => navigate(-1),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(state);
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form State:", state);
    mutate(state);
  };

  const advertencia = (message: string) => {
    toast({
      title: message,
      status: "warning",
      duration: 9000,
      isClosable: true,
    });
  };
  const validacion = () => {
    let result = false;

    if ((state.nombre === "" || state.nombre === null) && result === false) {
      result = true;
      advertencia("El campo Nombre no puede estar vacio");
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      imagen: e.target.files ? e.target.files[0] : undefined,
    });
  };

  useEffect(() => {
    const cargarCancha = async () => {
      const c = await getCanchaByID(Number(idEst), Number(idCancha));
      console.log(c);

      setState({ ...c, imagen: undefined });
    };
    cargarCancha();
  }, [idEst, idCancha]);

  const token = readLocalStorage<JWT>("token");

  const horas = [
    { value: "option1", label: "1:00hs" },
    { value: "option2", label: "2:00hs" },
    { value: "option3", label: "3:00hs" },
    { value: "option4", label: "4:00hs" },
    { value: "option5", label: "5:00hs" },
    { value: "option6", label: "6:00hs" },
    { value: "option7", label: "7:00hs" },
    { value: "option8", label: "8:00hs" },
    { value: "option9", label: "9:00hs" },
    { value: "option10", label: "10:00hs" },
    { value: "option11", label: "11:00hs" },
    { value: "option12", label: "12:00hs" },
    { value: "option13", label: "13:00hs" },
    { value: "option14", label: "14:00hs" },
    { value: "option15", label: "15:00hs" },
    { value: "option16", label: "16:00hs" },
    { value: "option17", label: "17:00hs" },
    { value: "option18", label: "18:00hs" },
    { value: "option19", label: "19:00hs" },
    { value: "option20", label: "20:00hs" },
    { value: "option21", label: "21:00hs" },
    { value: "option22", label: "22:00hs" },
    { value: "option23", label: "23:00hs" },
    { value: "option24", label: "24:00hs" },
  ];

  const disciplinas = [
    { value: "futbol", label: "Fútbol" },
    { value: "basquetbol", label: "Básquetbol" },
    { value: "tenis", label: "Tenis" },
    { value: "natacion", label: "Natación" },
    { value: "atletismo", label: "Atletismo" },
    { value: "gimnasia", label: "Gimnasia" },
    { value: "volleyball", label: "Volleyball" },
    { value: "boxeo", label: "Boxeo" },
    { value: "karate", label: "Karate" },
    { value: "hockey", label: "Hockey" },
    { value: "rugby", label: "Rugby" },
    { value: "padel", label: "Pádel" },
    { value: "squash", label: "Squash" },
    { value: "beisbol", label: "Béisbol" },
    { value: "softbol", label: "Softbol" },
  ];

  return (
    <>
      <Heading m="40px" textAlign="center">
        Editar Cancha
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="4" width="500px" justifyContent="center" margin="auto">
          <FormControl
            variant="floating"
            id="telefono"
            isRequired
            onChange={handleChange}
          >
            <Input
              value={state.nombre}
              placeholder="Cancha"
              name="telefono"
              type="tel"
            />
            <FormLabel>Nombre de cancha</FormLabel>
          </FormControl>
          <FormControl
            variant="floating"
            id="usuario"
            isRequired
            onChange={handleChange}
          >
            <Textarea value={state.descripcion} placeholder=" " />
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
        <Heading size="md" mt="20px">
          Disponibilidad horaria
        </Heading>
        <p>
          En qué rangos horarios la cancha estará disponible y para qué
          disciplinas.
        </p>
        <Button> Agregar disponibilidad +</Button>
        <VStack
          spacing="4"
          width="900px"
          justifyContent="center"
          margin="20px auto"
        >
          <HStack width="600px">
            <FormControl
              variant="floating"
              id="nombre"
              isRequired
              onChange={handleChange}
            >
              <Input
                value={state.nombre}
                placeholder="Cancha"
                name="nombre"
                type="text"
              />
              <FormLabel>Nombre de cancha</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="descripcion"
              isRequired
              onChange={handleChange}
            >
              <Textarea
                name="descripcion"
                value={state.descripcion}
                placeholder=" "
              />
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
          </HStack>
        </VStack>
        <Heading size="md" mt="20px">
          Disponibilidad horaria
        </Heading>
        <p>
          En qué rangos horarios la cancha estará disponible y para qué
          disciplinas.
        </p>
        {/* <Button> Agregar disponibilidad +</Button>
          <VStack
            spacing="4"
            width="900px"
            justifyContent="center"
            margin="20px auto"
          >
            <HStack width="600px">
              <FormControl
                variant="floating"
                id="disciplinas"
                isRequired
                onChange={handleChange}
              >
                <Select name="disciplinas" placeholder="Seleccione una opcion">
                  {disciplinas.map((disciplina) => (
                    <option key={disciplina.value} value={disciplina.value}>
                      {disciplina.label}
                    </option>
                  ))}
                </Select>
                <FormLabel>Disciplina</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="duracionreserva"
                isRequired
                onChange={handleChange}
              >
                <Input placeholder=" " name="duracionreserva" />
                <FormLabel>Duracion de la reserva</FormLabel>
              </FormControl>
            </HStack>
            <HStack width="600px">
              <FormControl
                variant="floating"
                id="hora-inicio"
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
          <p> Seleccionar los días para la disponibilidad.</p>
          <HStack spacing={1} justify="center">
            <SelectableButton children="Lunes" />
            <SelectableButton children="Martes" />
            <SelectableButton children="Miercoles" />
            <SelectableButton children="Jueves" />
            <SelectableButton children="Viernes" />
            <SelectableButton children="Sabado" />
            <SelectableButton children="Domingo" />
          </HStack> */}
        <Container centerContent mt="20px">
          <Button type="submit" /*onClick={validacion}*/>
            Guardar cambios
          </Button>
        </Container>
        `Bearer ${token?.token}`
      </form>

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
            <div className="modal-title">Confirmar Modificación</div>
            <div>
              <span className="close-button" onClick={handleClose}>
                x
              </span>
            </div>
          </div>
          <div className="modal-desc">
            <p>¿Desea guardar los cambios?</p>
          </div>
          <div className="modal-footer">
            <button onClick={handleClose}>Cancelar</button>
            <Button onClick={handleSuccess}>Aceptar</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default EditCourt;
