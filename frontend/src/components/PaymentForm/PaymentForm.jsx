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
                    <Row>  <Col><Form.Control type="tel"
                                      name="number"
                                      placeholder="Numero de tarjeta"
                                      onChange={this.handleInputChange}
                                      onFocus={this.handleInputFocus} required /> </Col> </Row>
                        <br />
                            <Row>  <Col><Form.Control type="tel"
                                    name="name"
                                    placeholder=" Nombre "
                                    onChange={this.handleInputChange}
                                    onFocus={this.handleInputFocus} required /> </Col>    </Row>
                        <br />
                        <Row>
                            <Col> <Form.Control  type="tel"
                                  name="expiry"
                                  placeholder="Valida hasta "
                                  onChange={this.handleInputChange}
                                  onFocus={this.handleInputFocus}  required /> </Col>
                            <Col> <Form.Control type="tel"
                                name="cvc"
                                placeholder="CVV "
                                onChange={this.handleInputChange}
                                onFocus={this.handleInputFocus} required /> </Col>
                        </Row>
                        <br />  
                </Col>
                   <Col>      
                      <Cards
                          cvc={this.state.cvc}
                          expiry={this.state.expiry}
                          focused={this.state.focus}
                          name={this.state.name}
                          number={this.state.number}
                        /> 
                    </Col>
                </Row>       
          </Container>
         

      </div>
    );
  }
}