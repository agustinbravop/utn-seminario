import "./LogIn.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FloatingLabel } from "react-bootstrap";
import TopMenu from "../../components/TopMenu";
import { Fragment } from "react";

function LogIn() {
  return (
    <Fragment>
      <TopMenu />
      <div className="page">

        <div className="contenedor">
        <br />
          <div className="centrado">
            <h1>Bienvenidos CANCHAS.NET</h1>
          </div>
          <br /><br /><br />

          <div className="formulario">
            <Form style={{ width: '100%' }}>
              <Form.Group >
                <Container>
                  <Row>
                    <Col> </Col>
                    <Col>
                      <FloatingLabel
                        controlId="floatingTextarea"
                        label="Correo electrónico"
                        className="mb-3"
                      >
                        <Form.Control type="email" placeholder="Correo electrónico" required />
                      </FloatingLabel>
                    </Col>
                    <Col> </Col>
                  </Row>
                  <Row>
                    <Col> </Col>
                    <Col>
                      <FloatingLabel
                        controlId="floatingTextarea"
                        label="Contraseña"
                        className="mb-3"
                      >
                        <Form.Control type="password" placeholder="Contraseña" required />
                      </FloatingLabel>
                    </Col>
                    <Col> </Col>
                  </Row>
                </Container>
              </Form.Group>

              <div className="centrado">
                <button
                  type="submit"
                  className="btn btn-danger"
                  style={{ backgroundColor: "#FF604F" }}
                  onClick={() => ( console.log("LogIn"))}
                >
                  Iniciar Sesión
                </button>
              </div>

            </Form>
          </div>


        </div>

      </div>
    </Fragment>
  );
}

export default LogIn;