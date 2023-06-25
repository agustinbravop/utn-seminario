import { BASE_PATH } from "../../utils/constants";
import "./Establecimiento.scss";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdPlace } from "react-icons/md";
import { PhoneIcon, SettingsIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";

export default function Establecimiento(props) {
  const { establecimiento } = props;
  const navigate = useNavigate();
  const admin = useCurrentAdmin()

  return (
    <Card maxWidth="xs" height="450px">
      <Image
        className="image-size"
        src={`${BASE_PATH}/${establecimiento.image}`}
        borderRadius="lg"
        alt={`Imagen del establecimiento ${establecimiento.name}`}
        objectFit="cover"
        maxWidth="100%"
        height="200px"
      />
      <CardBody height="300px">
        <VStack spacing="0">
          <Heading className="card-title" size="md" marginBottom="10px">
            {establecimiento.name}
          </Heading>
          <Text marginBottom="0">
            <PhoneIcon boxSize={3.5} color="gray" /> {establecimiento.domicilio}
          </Text>
          <Text>
            <Icon as={MdPlace} boxSize={5} color="gray" />
            {establecimiento.telefono}
          </Text>
        </VStack>
      </CardBody>
      <CardFooter display="flex" justify="center">
        <ButtonGroup>
          <Button
            key={0}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye-fill"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
              </svg>
            }
          >
            Canchas
          </Button>
          <Button
            key={1}
            leftIcon={<SettingsIcon />}
            width="16"
            height="16"
            onClick={() =>
              navigate(
                `/administrador/${admin.id}/establecimiento/${establecimiento.id}/editar`
              )
            }
          >
            Editar
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
