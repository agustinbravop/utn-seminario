import { useCurrentJugador } from "@/hooks/useCurrentJugador";
import { Box } from "@chakra-ui/react";

import SearchEstab from "@/pages/search/searchEstab";

export default function JugadorPage() {
  return (
    <>
      <Box width="100%">
        <SearchEstab />
      </Box>
    </>
  );
}
