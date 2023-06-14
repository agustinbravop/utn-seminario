import "./LogIn.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FloatingLabel } from "react-bootstrap";
import TopMenu from "../../components/TopMenu";
import { Fragment, useState } from "react";

interface LoginState {
  correoOUsuario: string;
  clave: string;
}
function LogIn() {
  const [state, setState] = useState<LoginState>({
    correoOUsuario: "",
    clave: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(state);
    setState({ ...state, [name]: value });
  };

  return (
    <Fragment>
      <TopMenu />
      <div className="page">
        <div className="contenedor">
          <br />
          <div className="centrado">
            <h1>Bienvenido a CANCHAS.NET</h1>
          </div>
          <br />
          <br />
          <br />

          <div className="formulario">
            <Form style={{ width: "100%" }}>
              <Form.Group>
                <Container>
                  <Row>
                    <Col> </Col>
                    <Col>
                      <FloatingLabel
                        controlId="floatingCorreo"
                        label="Correo electrónico o usuario"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Correo electrónico o usuario"
                          name="correoOUsuario"
                          onChange={handleChange}
                          required
                        />
                      </FloatingLabel>
                    </Col>
                    <Col> </Col>
                  </Row>
                  <Row>
                    <Col> </Col>
                    <Col>
                      <FloatingLabel
                        controlId="floatingClave"
                        label="Contraseña"
                        className="mb-3"
                      >
                        <Form.Control
                          type="password"
                          placeholder="Contraseña"
                          name="clave"
                          onChange={handleChange}
                          required
                        />
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
                  onClick={() => console.log("LogIn")}
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
