import React from 'react';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
 
export default class PaymentForm extends React.Component {
  state = {
    cvc: '',
    expiry: '',
    focus: '',
    name: '',
    number: '',
  };
 
  handleInputFocus = (e) => {
    this.setState({ focus: e.target.name });
  }
  
  handleInputChange = (e) => {
    const { name, value } = e.target;
    
    this.setState({ [name]: value });
  }
  
  render() {
    return (
      
      <div id="PaymentForm">


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


        <Cards
          cvc={this.state.cvc}
          expiry={this.state.expiry}
          focused={this.state.focus}
          name={this.state.name}
          number={this.state.number}
        />

          <form>
            <input
              type="tel"
              name="number"
              placeholder="Card Number"
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
            />
            
        	<input
            type="tel"
            name="name"
            placeholder="Cnombre "
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
          />

            <input
            type="tel"
            name="expiry"
            placeholder="Cnombre "
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
          />

          <input
            type="tel"
            name="cvc"
            placeholder="Cnombre "
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
          />

          </form>


      </div>
    );
  }
}