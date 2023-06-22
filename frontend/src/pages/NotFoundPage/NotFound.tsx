import React from "react";
import Title from "../../components/Title/Title";
import TopMenu from "../../components/TopMenu";

function NotFound() {
  return (
    <div>
      <TopMenu />
      <Title style={{ textAlign: "center", marginTop: "10px", color: "red" }}>
        404 Page Not Found
      </Title>
    </div>
  );
}

export default NotFound;
