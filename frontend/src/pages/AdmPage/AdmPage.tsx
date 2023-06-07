import React from "react";
import "./AdmPage.css";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function AdmPage() {
  return (
    <div className="container col">
      <div>  
          <div className="prueba">  Tarjeta de credito </div>
          <div className="subtexto" >  
          <p> Se factura una cuota cada 30 días. Se puede dar de baja en cualquier momento. </p>
          </div>

           <Container> 
              <Col>
                  <Form.Control type="text" placeholder="Numero de tarjeta" required />
                  <Form.Control type="text" placeholder="Nombre" required />
              </Col>
              <Col>
              
              </Col>
           </Container>
            
        
          <div className="tarjeta" >  <PaymentForm/> </div>



      </div>




      <div>  </div>
    </div>
  );
}

export default AdmPage;
