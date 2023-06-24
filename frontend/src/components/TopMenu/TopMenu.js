import { ReactComponent as Logo } from "../../assets/svg/tennis-icon.svg";
import "./TopMenu.scss";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";
import { Link } from "react-router-dom";
import { HStack, Icon } from "@chakra-ui/react";

export default function TopMenu() {
  const { currentAdmin, logout } = useCurrentAdmin();

  return (
    <HStack
      className="top-menu"
      backgroundColor="blackAlpha.800"
      justifyContent="space-between"
      padding={["0", "30px", "0", "30px"]}
      height="50px"
    >
      <BrandNav />
      <MenuNav />
      {currentAdmin && (
        <button className="btn btn-light rounded-pill btn-sm">
          {currentAdmin.usuario}
        </button>
      )}
    </HStack>
  );
}

function BrandNav() {
  return (
    <Link to="/landing">
      <Icon as={Logo} fill="whiteAlpha.800" fontSize="40px" />
    </Link>
  );
}

function MenuNav() {
  return <nav></nav>;
}
