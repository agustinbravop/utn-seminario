import React from "react";
import { Cancha } from "../../types/index";
import { HStack } from "@chakra-ui/react";
import Court from "../Court/Court";

type courtsProp = {
  canchas: Cancha[];
};

export default function Courts({ canchas }: courtsProp) {
  return (
    <HStack display="flex" flexWrap="wrap" justifyContent="center">
      {canchas.map((cancha, index) => (
        <Court key={index} cancha={cancha} />
      ))}
    </HStack>
  );
}
