import React from "react";
import "./AdmPage.css";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



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

    <div className="formulario" >
      <Form style={{ width: '50%' }}>

        <Form.Group >




          <Container>
              <Row>
                <Col>
                    <Row>  <Col><Form.Control type="text" placeholder="Número de tarjeta" required /> </Col> </Row>
                        <br />
                            <Row>  <Col><Form.Control type="text" placeholder="Nombre" required /> </Col>    </Row>
                        <br />
                        <Row>
                            <Col> <Form.Control type="date" placeholder="Valida hasta" required /> </Col>
                            <Col> <Form.Control type="text" placeholder="CVV" required /> </Col>
                        </Row>
                        <br />  
                </Col>
                   <Col> <PaymentForm/> </Col>
                </Row>       
          </Container>

            


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
            <Form style={{ width: '34%' }}>

              <Form.Group >
                
                <Container>
                    <Row>
                        <Col> <Form.Control type="text" placeholder="Nombre" required /> </Col>
                        <Col> <Form.Control type="text" placeholder="Apellido" required /> </Col>
                    </Row>
                    <br />
                    <Row>  <Col><Form.Control type="text" placeholder="Teléfono" required /> </Col> </Row>
                    <br />
                    <Row>  <Col><Form.Control type="text" placeholder="Nombre de usuario" required /> </Col> </Row>
                    <br />
                   
                    <Row>  <Col><Form.Control type="email" placeholder="Correo electrónico" required /> </Col> </Row>
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
