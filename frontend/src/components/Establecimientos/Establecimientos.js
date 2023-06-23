import Establecimiento from "../Establecimiento";
import Loading from "../Loading";
import { HStack } from "@chakra-ui/react";

export default function Establecimientos({ result, loading, error }) {
  console.log(loading, result);
  return (
    <HStack display="flex" flexWrap="wrap" justifyContent="center">
      {loading || !result ? (
        <Loading />
      ) : (
        result.record.map((establecimiento, index) => (
          <Establecimiento key={index} establecimiento={establecimiento} />
        ))
      )}
    </HStack>
  );
}
