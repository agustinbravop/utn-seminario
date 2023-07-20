import React from "react";
import TopMenu from "../../components/TopMenu/TopMenu";
import { Heading } from "@chakra-ui/layout";

function NotFound() {
  return (
    <div>
      <TopMenu />
      <Heading style={{ textAlign: "center", marginTop: "10px", color: "red" }}>
        404 Page Not Found
      </Heading>
    </div>
  );
}

export default NotFound;
