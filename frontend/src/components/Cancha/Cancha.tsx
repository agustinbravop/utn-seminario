import { Cancha } from "../../models";
import "./Cancha.scss";
import { Card, CardBody, Heading, Image, Text, Stack } from "@chakra-ui/react";

interface CanchaCardProps {
  cancha: Cancha;
}
 
export default function CanchaCard({ cancha }: CanchaCardProps) {
  return (
    <Card
      maxWidth="xs"
      width="20vw"
      onClick={() => {
        alert("Cancha");
      }}
      style={{ cursor: "pointer" }}
    >
      <Image
        className="image-size"
        src={cancha.urlImagen}
        borderRadius="lg"
        alt={`La cancha ${cancha.nombre}`}
        objectFit="cover"
        maxWidth="100%"
        height="200px"
      />

      <CardBody height="300px" alignContent="left">
        <Stack spacing="0">
          <Heading className="card-title" size="md" marginBottom="10px">
            {cancha.nombre}
          </Heading>
          <Text marginBottom="0">{cancha.descripcion}</Text>
          <Text marginBottom="0">• Disciplinas: {cancha.disciplinas}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
}
