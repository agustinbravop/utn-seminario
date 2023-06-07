import React from "react";
import "./AdmPage.css";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const valoresSelect = [ " " , 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

function AdmPage() {
  return (
    <div className="page">
    <div className="margen">
      <h2>Tarjeta de credito</h2>
      <p> Se factura una cuota cada 30 días.
    Se puede dar de baja en cualquier momento.</p>
    </div>

    <br />
    <br />

    <div className="formulario">
      <Form style={{ width: '50%' }}>

        <Form.Group >
          <Container>
      
              <Row>  <Col><Form.Control type="text" placeholder="Número de tarjeta" required /> </Col> </Row>
              <br />
                  <Row>  <Col><Form.Control type="text" placeholder="Nombre" required /> </Col>    </Row>
              <br />
              <Row>
                  <Col> <Form.Control type="date" placeholder="Valida hasta" required /> </Col>
                  <Col> <Form.Control type="text" placeholder="CVV" required /> </Col>
              </Row>
              <br />
                     
          </Container>




        </Form.Group>
        </Form>

</div>


        <br /><br />



      <div className="margen">
        <h2>Cuenta</h2>
        <p> Ingrese los datos a usar para iniciar sesión.</p>
      </div>

      
    <br />
    <br />


            <div className="formulario">
            <Form style={{ width: '40%' }}>

              <Form.Group >
                <Container>
                    <Row>
                        <Col> <Form.Control type="text" placeholder="Nombre" required /> </Col>
                        <Col> <Form.Control type="text" placeholder="Apellido" required /> </Col>
                    </Row>
                    <br />
                    <Row>  <Col><Form.Control type="text" placeholder="Teléfono" required /> </Col> </Row>
                    <br />
                   
                    <Row>  <Col><Form.Control type="text" placeholder="Correo electronico" required /> </Col> </Row>
                    <br />
                        <Row>  <Col><Form.Control type="text" placeholder="Contraseña" required /> </Col>    </Row>
                    <br />
                    
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
                </div>


              </Form>

      </div>
     

  </div>
  );
}

export default AdmPage;
