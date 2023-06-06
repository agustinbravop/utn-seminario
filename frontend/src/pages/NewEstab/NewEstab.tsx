import "./NewEstab.css";
import Form from 'react-bootstrap/Form';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const valoresSelect = [ " " , 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];



function NewEstab() {
  return (
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
                <Col><Form.Control type="text" placeholder="Nombre" required /></Col>
                <Col><Form.Control type="text" placeholder="Dirección" required /></Col>
              </Row>
              <br />
              <Row>
                <Col><Form.Control type="email" placeholder="Correo electronico" required /></Col>
                <Col><Form.Control type="number" placeholder="Télefono" required /></Col>
              </Row>
              <br />
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
          </Container>

          <div className="centrado">
            <button
              type="submit"
              className="btn btn-danger"
              style={{ backgroundColor: "#FF604F" }}
            >
              Crear
            </button>
          </div>

        </Form>

      </div>

    </div>
  );
}

export default NewEstab;