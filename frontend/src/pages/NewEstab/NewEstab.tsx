import "./NewEstab.css";
import Form from 'react-bootstrap/Form';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FloatingLabel } from "react-bootstrap";
import TopMenu from "../../components/TopMenu";
import { Fragment } from "react";
import { crearEstablecimiento } from "../../utils/api";

// const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
// const valoresSelect = [" ", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

function NewEstab() {
  return (
    <Fragment>
      <TopMenu />
      <div className="page">
        <div className="centrado">
          <h1>Nuevo Establecimiento</h1>
        </div>
        <br />

        <div className="formulario">
          <Form style={{ width: '60%' }}>

            <Form.Group >
              <Container>
                <Row>
                  <Col>
                    <FloatingLabel
                      controlId="floatingTextarea"
                      label="Nombre"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Nombre" required />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel
                      controlId="floatingTextarea"
                      label="Dirección"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Dirección" required />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FloatingLabel
                      controlId="floatingTextarea"
                      label="Localidad"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Localidad" required />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel
                      controlId="floatingTextarea"
                      label="Provincia"
                      className="mb-3"
                    >
                      <Form.Control type="text" placeholder="Provincia" required />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FloatingLabel
                      controlId="floatingTextarea"
                      label="Correo electronico"
                      className="mb-3"
                    >
                      <Form.Control type="email" placeholder="Correo electronico" required />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel
                      controlId="floatingTextarea"
                      label="Télefono"
                      className="mb-3"
                    >
                      <Form.Control type="number" placeholder="Télefono" required />
                    </FloatingLabel>

                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Control
                      type="file"
                      required
                      name="file"
                      accept="image/*"
                      placeholder="Seleccionar imagen"
                    />
                  </Col>
                </Row>
                <br />
              </Container>
            </Form.Group>
            <br /><br />
            <div className="parrafo">
              <h2>Horarios de Atención</h2>
              <p>Describa los horarios de atención del establecimiento</p>
            </div>


            <Container>
              <Row>
                <Col>
                  <Form.Control as="textarea" rows={3} />
                </Col>
              </Row>
            </Container>

            {/*
            <div className="parrafo">
              <h2>Horarios de Atención</h2>
              <p>En qué rango horario el establecimiento está abierto.</p>
            </div>
         
            <Container>
              <Row>
                <Col></Col>
                {diasSemana.map((dia, index) => (
                  <Col key={index}>{dia}</Col>
                ))}
              </Row>
              <br />
              <Row>
                <Col>Desde las</Col>
                {diasSemana.map((dia, index) => (
                  <Col key={index}>
                    <Form.Select aria-label="Default select example">
                      {valoresSelect.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                ))}
              </Row>
              <br />
              <br />
              <Row>
                <Col>Hasta las</Col>
                {diasSemana.map((dia, index) => (
                  <Col key={index}>
                    <Form.Select aria-label="Default select example">
                      {valoresSelect.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                ))}
              </Row>
              <br />
            </Container> */}

            <div className="centrado">
              <button
                type="submit"
                className="btn btn-danger"
                style={{ backgroundColor: "#FF604F" }}
                onClick={() => (
                  console.log("crearEstab")
                )}
              >
                Crear
              </button>

              <br /><br /><br /><br />
            </div>

          </Form>

        </div>

      </div>
    </Fragment>
  );
}

export default NewEstab;