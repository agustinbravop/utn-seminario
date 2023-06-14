import Cards, { Focused } from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FloatingLabel } from "react-bootstrap";
import { useState } from "react";
import { Tarjeta } from "../../types";

interface PaymentFormProps {
  tarjeta: Tarjeta;
  setTarjeta: (t: Tarjeta) => void;
}
export default function PaymentForm({ tarjeta, setTarjeta }: PaymentFormProps) {
  const [focused, setFocused] = useState<Focused | undefined>(undefined);
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(e.target.name as unknown as Focused);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const t: Tarjeta = {
      nombre: name === "name" ? value : tarjeta.nombre,
      vencimiento: name === "expiry" ? value : tarjeta.vencimiento,
      cvv: name === "cvc" ? Number(value) : tarjeta.cvv,
      numero: name === "number" ? value : tarjeta.numero,
    };
    setTarjeta(t);
  };

  return (
    <div id="PaymentForm">
      <Container>
        <Row>
          <Col>
            <Row>
              {" "}
              <Col>
                {" "}
                <FloatingLabel
                  controlId="floatingNumero"
                  label="Numero de tarjeta"
                  className="mb-3"
                >
                  {" "}
                  <Form.Control
                    type="tel"
                    name="number"
                    placeholder="Numero de tarjeta"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    required
                  />{" "}
                </FloatingLabel>{" "}
              </Col>{" "}
            </Row>

            <Row>
              {" "}
              <Col>
                {" "}
                <FloatingLabel
                  controlId="floatingNombreTarjeta"
                  label="Nombre del dueño"
                  className="mb-3"
                >
                  {" "}
                  <Form.Control
                    type="tel"
                    name="name"
                    placeholder=" Nombre del dueño"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    required
                  />{" "}
                </FloatingLabel>{" "}
              </Col>{" "}
            </Row>

            <Row>
              <Col>
                {" "}
                <FloatingLabel
                  controlId="floatingVencimiento"
                  label="Valida hasta"
                  className="mb-3"
                >
                  {" "}
                  <Form.Control
                    type="tel"
                    name="expiry"
                    placeholder="Valida hasta "
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    required
                  />{" "}
                </FloatingLabel>{" "}
              </Col>
              <Col>
                {" "}
                <FloatingLabel
                  controlId="floatingCVV"
                  label="CVV"
                  className="mb-3"
                >
                  {" "}
                  <Form.Control
                    type="tel"
                    name="cvc"
                    placeholder="CVV "
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    required
                  />{" "}
                </FloatingLabel>{" "}
              </Col>
            </Row>
          </Col>
          <Col>
            <Cards
              cvc={tarjeta.cvv}
              expiry={tarjeta.vencimiento}
              focused={focused}
              name={tarjeta.nombre}
              number={tarjeta.numero}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
