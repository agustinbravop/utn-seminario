import React from "react";
import "./AdmPage.css";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-overlays/Modal";
import { useState } from "react";
import { JSX } from "react/jsx-runtime";
import { FloatingLabel } from "react-bootstrap";
import { Administrador, Tarjeta } from "../../types";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ApiError, register } from "../../utils/api";

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
    mutationFn: ({ clave, ...admin }) => register(admin, clave),
    onSuccess: () => navigate("/landing")
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

  return (
    <div className="page">
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

              <Row>
                <Col>
                  <FloatingLabel
                    controlId="floatingUsuario"
                    label="Nombre de usuario"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="usuario"
                      onChange={handleChange}
                      placeholder="Nombre de usuario"
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FloatingLabel
                    controlId="floatingCorreo"
                    label="Correo electronico"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="correo"
                      onChange={handleChange}
                      placeholder="Correo"
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FloatingLabel
                    controlId="floatingClave"
                    label="Contraseña"
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      name="clave"
                      onChange={handleChange}
                      placeholder="Contraseña"
                      required
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <br />
            </Container>
          </Form.Group>

          <div className="centrado">
            <button
              type="submit"
              className="btn btn-danger"
              style={{ backgroundColor: "#249AD5", borderColor: "#249AD5" }}
            >
              Registrarse
            </button>
            {isError && <p>Error al registrarse. Intente de nuevo</p>}
          </div>
        </Form>
      </div>

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
