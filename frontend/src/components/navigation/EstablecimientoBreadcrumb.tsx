import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, HStack, StackProps } from "@chakra-ui/react";
import { useNavigate } from "react-router";

interface EstablecimientoBreadcrumbProps extends StackProps {
  returnTo?: string;
}

export default function EstablecimientoBreadcrumb({
  returnTo,
  ...props
}: EstablecimientoBreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <HStack {...props}>
      <Button
        size="xs"
        onClick={() => (returnTo ? navigate(returnTo) : navigate(-1))}
      >
        <ChevronLeftIcon boxSize={6} />
      </Button>
    </HStack>
  );
}
