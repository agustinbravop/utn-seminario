import React from "react";
import { Cancha } from "../../models/index";
import { HStack } from "@chakra-ui/react";
import Court from "../Court/Court";

type CourtsProp = {
  canchas: Cancha[];
};

export default function Courts({ canchas }: CourtsProp) {
  return (
    <HStack display="flex" flexWrap="wrap" justifyContent="center">
      {canchas.map((cancha, index) => (
        <Court key={index} cancha={cancha} />
      ))}
    </HStack>
  );
}
