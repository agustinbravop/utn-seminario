import SubMenu from "@/components/SubMenu/SubMenu";
import { HStack, Text } from "@chakra-ui/react";

export default function CourtInfoPage() {
  return (
    <div>
      <SubMenu />
      <HStack
        marginRight="16%"
        marginLeft="16%"
        marginBottom="30px"
        marginTop="0px"
      >
        <Text>
          Estas son las reservas actuales de para este establecimiento.
        </Text>
      </HStack>
    </div>
  );
}
