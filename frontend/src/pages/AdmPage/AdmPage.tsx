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
import TopMenu from "../../components/TopMenu/TopMenu";
import { useNavigate } from "react-router";

function AdmPage() {
  const [showModal, setShowModal] = useState(false);
  const renderBackdrop = (
    props: JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLDivElement> &
      React.HTMLAttributes<HTMLDivElement>
  ) => <div className="backdrop" {...props} />;
  const navigate = useNavigate();
  const handleClose = () => setShowModal(false);
  const handleSuccess = () => {
    // TODO: sadsa
    console.log(":)");
  };

  return (
    <>
      <TopMenu />
      <div className="page">
        <div className="margen">
          <h2>Tarjeta de credito</h2>
          <p>
            {" "}
            Se factura una cuota cada 30 días. Se puede dar de baja en cualquier
            momento.
          </p>
        </div>

        <br />
        <br />

        <div className="formulario">
          <Form style={{ width: "50%", marginLeft: "4%" }}>
            <Form.Group>
              <PaymentForm />
            </Form.Group>
          </Form>
        </div>
        <br />

        <div className="margen">
          <h2>Cuenta</h2>
          <p> Ingrese los datos a usar para iniciar sesión.</p>
        </div>

        <br />
        <br />

        <div className="formulario">
          <Form style={{ width: "34%" }}>
            <Form.Group>
              <Container>
                <Row>
                  <Col>
                    {" "}
                    <Form.Control
                      type="text"
                      placeholder="Nombre"
                      required
                    />{" "}
                  </Col>
                  <Col>
                    {" "}
                    <Form.Control
                      type="text"
                      placeholder="Apellido"
                      required
                    />{" "}
                  </Col>
                </Row>
                <br />
                <Row>
                  {" "}
                  <Col>
                    <Form.Control type="text" placeholder="Teléfono" required />{" "}
                  </Col>{" "}
                </Row>
                <br />
                <Row>
                  {" "}
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Nombre de usuario"
                      required
                    />{" "}
                  </Col>{" "}
                </Row>
                <br />

                <Row>
                  {" "}
                  <Col>
                    <Form.Control
                      type="email"
                      placeholder="Correo electrónico"
                      required
                    />{" "}
                  </Col>{" "}
                </Row>
                <br />
                <Row>
                  {" "}
                  <Col>
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      required
                    />{" "}
                  </Col>{" "}
                </Row>
                <br />

                <br />
              </Container>
            </Form.Group>

            <div className="centrado">
              <button
                type="submit"
                className="btn btn-danger"
                style={{ backgroundColor: "#249AD5", borderColor: "#249AD5" }}
                onClick={() => navigate("/landing")}
              >
                Registrarme
              </button>
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
      </div>
    </>
  );
}
export default AdmPage;
