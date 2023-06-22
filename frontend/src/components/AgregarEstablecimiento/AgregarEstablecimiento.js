import { useState } from "react";
import { Button, Form, Modal, Container, Col, Row } from "react-bootstrap";

import "./AgregarEstablecimiento.scss";

export default function AgregarEstablecimiento() {
  const handleClose = () => setLgShow(false);
  const [lgShow, setLgShow] = useState(false);

  return (
    <>
      <Container fluid="md" className="agregarestablecimiento">
        <Button onClick={() => setLgShow(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-plus-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
          </svg>{" "}
          Establecimiento
        </Button>
        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Nuevo Establecimiento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Campos dobles por linea */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="nombre"
                    placeholder="Ingrese el nombre del establecimiento"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridDirección">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control type="dirección" placeholder="Dirección" />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridLocalidad">
                  <Form.Label>Localidad</Form.Label>
                  <Form.Control
                    type="localidad"
                    placeholder="Ingrese localidad"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridProvincia">
                  <Form.Label>Provincia</Form.Label>
                  <Form.Control type="provincia" placeholder="Provincia" />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingrese correo electrónico"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridTeléfono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control type="teléfono" placeholder="Teléfono" />
                </Form.Group>
              </Row>
              <br />

              {/* Fin campos dobles */}
              <Form.Group as={Col}>
                <Form.Label className="text-center" style={{ width: "100%" }}>
                  <h3>Horarios de Atención</h3>
                </Form.Label>{" "}
                <br />
                <Form.Label className="text-center" style={{ width: "100%" }}>
                  <h7>En qué rangos está abierto el establecimiento</h7>
                </Form.Label>
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridLunes">
                  <Form.Label className="text-center" style={{ width: "100%" }}>
                    Lunes
                  </Form.Label>
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridMartes">
                  <Form.Label className="text-center" style={{ width: "100%" }}>
                    Martes
                  </Form.Label>
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridMiércoles">
                  <Form.Label className="text-center" style={{ width: "100%" }}>
                    Miércoles
                  </Form.Label>
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridJueves">
                  <Form.Label className="text-center" style={{ width: "100%" }}>
                    Jueves
                  </Form.Label>
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridViernes">
                  <Form.Label className="text-center" style={{ width: "100%" }}>
                    Viernes
                  </Form.Label>
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridSábado">
                  <Form.Label className="text-center" style={{ width: "100%" }}>
                    Sábado
                  </Form.Label>
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridDomingo">
                  <Form.Label className="text-center" style={{ width: "100%" }}>
                    Domingo
                  </Form.Label>
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridLunes">
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridMartes">
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridMiércoles">
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridJueves">
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridViernes">
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridSábado">
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridDomingo">
                  <Form.Select defaultValue="Choose...">
                    <option></option>
                    <option>...</option>
                  </Form.Select>
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
