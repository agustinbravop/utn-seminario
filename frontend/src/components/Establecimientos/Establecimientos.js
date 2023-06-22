import React from "react";
import { Container, Row } from "react-bootstrap";
import Establecimiento from "../Establecimiento";
import Loading from "../Loading";

export default function Establecimientos(props) {
  const {
    establecimientos: { result, loading, error },
  } = props;

  return (
    <Container>
      <Row>
        {loading || !result ? (
          <Loading />
        ) : (
          result.record.map((establecimiento, index) => (
            <Establecimiento key={index} establecimiento={establecimiento} />
          ))
        )}
      </Row>
    </Container>
  );
}
