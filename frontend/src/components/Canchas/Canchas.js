import Cancha from "../Cancha";
import Loading from "../Loading";
import { HStack } from "@chakra-ui/react";

export default function Canchas({ result, loading, error }) {
  console.log(loading, result);
  return (
    <HStack display="flex" flexWrap="wrap" justifyContent="center">
      {loading || !result ? (
        <Loading />
      ) : (
        result.record[1].map((cancha, index) => (
          <Cancha key={index} cancha={cancha} />
        ))
      )}
    </HStack>
  );
}
