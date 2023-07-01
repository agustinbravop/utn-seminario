//import "./NewEstab.css";
import TopMenu from "../../components/TopMenu";
import {
  ApiError,
  actualizarEstablecimiento,
  traerEstablecimiento,
} from "../../utils/api";
import { Establecimiento } from "../../types";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-overlays/Modal";
import { JSX } from "react/jsx-runtime";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

type FormState = Establecimiento & {
  imagen?: File;
};

function EditEstab() {
  const { idAdmin, id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<FormState>({
    id: Number(id),
    nombre: "",
    telefono: "",
    direccion: "",
    localidad: "",
    provincia: "",
    urlImagen: "",
    correo: "",
    idAdministrador: Number(idAdmin),
    horariosDeAtencion: "",
    imagen: undefined,
  });

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
      advertencia("El establecimiento debe tener un nombre");
    }

    if (
      (state.telefono === "" || state.telefono === null) &&
      result === false
    ) {
      result = true;
      advertencia("El establecimiento debe tener un telefono");
    }

    if (
      (state.direccion === "" || state.direccion === null) &&
      result === false
    ) {
      result = true;
      advertencia("El campo Dirección no puede estar vacio");
    }

    if (
      (state.provincia === "" || state.provincia === null) &&
      result === false
    ) {
      result = true;
      advertencia("El campo Provincia no puede estar vacio");
    }

    if (
      (state.localidad === "" || state.localidad === null) &&
      result === false
    ) {
      result = true;
      advertencia("El campo Localidad no puede estar vacio");
    }

    if ((state.correo === "" || state.correo === null) && result === false) {
      result = true;
      advertencia("El establecimiento debe tener correo electronico");
    }

    if (
      (state.horariosDeAtencion === "" || state.horariosDeAtencion === null) &&
      result === false
    ) {
      result = true;
      advertencia("Los horarios deben estar definidos");
    }
  };

  const { mutate } = useMutation<Establecimiento, ApiError, FormState>({
    mutationFn: ({ imagen, ...admin }) =>
      actualizarEstablecimiento(admin, imagen), //REVISAR
    onSuccess: () => navigate(`/administrador/${idAdmin}`),
  });

  useEffect(() => {
    const cargarEstablecimiento = async () => {
      const e = await traerEstablecimiento(Number(idAdmin), Number(id));
      setState(e)
    };
    cargarEstablecimiento();
  });

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      imagen: e.target.files ? e.target.files[0] : undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(state);
  };

  return (
    <div className="page">
      <TopMenu />
      <div className="centrado">
        <Heading size="xl" margin="50px">
          Editar Establecimiento
        </Heading>
      </div>

      <form onSubmit={handleSubmit}>
        <Container centerContent gap="25px">
          <VStack spacing="4">
            <FormControl
              variant="floating"
              id="nombre"
              isRequired
              onChange={handleChange}
            >
              <Input name="nombre" placeholder="Nombre" />
              <FormLabel>Nombre del establecimiento</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="correo"
              isRequired
              onChange={handleChange}
            >
              <Input name="correo" type="email" placeholder="abc@ejemplo.com" />
              <FormLabel>Correo del establecimiento</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="direccion"
              isRequired
              onChange={handleChange}
            >
              <Input name="direccion" placeholder="Dirección" />
              <FormLabel>Dirección</FormLabel>
            </FormControl>
            <HStack>
              <FormControl
                variant="floating"
                id="localidad"
                isRequired
                onChange={handleChange}
              >
                <Input name="localidad" placeholder="Localidad" />
                <FormLabel>Localidad</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="provincia"
                isRequired
                onChange={handleChange}
              >
                <Input name="provincia" placeholder="Provincia" />
                <FormLabel>Provincia</FormLabel>
              </FormControl>
            </HStack>
            <FormControl
              variant="floating"
              id="telefono"
              isRequired
              onChange={handleChange}
            >
              <Input name="telefono" placeholder="Teléfono" type="tel" />
              <FormLabel>Teléfono</FormLabel>
            </FormControl>
            <FormControl>
              <FormControl
                variant="floating"
                id="horariosDeAtencion"
                onChange={handleChange}
              >
                <Input
                  name="horariosDeAtencion"
                  placeholder="8:00-12:00"
                  type="text"
                />
                <FormLabel>Horarios de Atención</FormLabel>
              </FormControl>
              <FormLabel marginTop="10px" marginLeft="10px">
                Imagen
              </FormLabel>
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
            </FormControl>
          </VStack>

          <div className="centrado">
            <Button
              type="submit"
              className="btn btn-danger"
              onClick={validacion}
            >
              Guardar
            </Button>
          </div>
        </Container>
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

export default EditEstab;
