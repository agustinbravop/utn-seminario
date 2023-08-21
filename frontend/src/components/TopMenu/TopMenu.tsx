import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, HStack, Icon, Image, MenuItem, MenuList } from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { Menu, MenuButton } from "@chakra-ui/react";
import { ArrowForwardIcon,ChevronDownIcon,ChevronLeftIcon, ChevronRightIcon, InfoIcon } from "@chakra-ui/icons";
import { Administrador } from "@/models";

export default function TopMenu() {
  const navigate = useNavigate();
  const next = (dir: boolean) => {
    dir ? navigate(+1) : navigate(-1)
  }
  const { currentAdmin, logout } = useCurrentAdmin();

  return (
    <>
    <HStack
      justifyContent="space-between"
      shadow="md"
      padding="0 2rem 0 2rem"
      height="3.6rem"
      backgroundColor="#f8fafd"
    >
      <Nav admin={currentAdmin}logout={logout}/>
    </HStack>

    {currentAdmin && (
      <>
      <HStack paddingTop={4} marginLeft="17.3%" marginRight="17.%" spacing={1}>
        <Button size='xs' backgroundColor="white" onClick={() => next(false)}>
            <ChevronLeftIcon boxSize={6} />
          </Button>
          <Button size='xs' backgroundColor="white" onClick={() => next(true)}>
            <ChevronRightIcon boxSize={6} />
          </Button>

          <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='#'>About</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='#'>Contact</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        </HStack>
      </>
    )}


    </>
  );
}

function Nav( {admin, logout}: {admin: Administrador | undefined; logout: VoidFunction}) {
  if (!admin) {
    return (
      <>
        <Link to="/">
          <Image
            src="https://cdn.discordapp.com/attachments/1031369249345785886/1131656498670485614/SPOILER_logo.png"
            alt="logo"
            width={177}
          />
        </Link>
        <nav>
          <HStack>
            <Link to="/suscripciones">
              <Button variant="ghost" size="sm" color="blackAlpha.800">
                Suscripciones
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
          </HStack>
        </nav>
      </>
    );
  }

  return (
    <>
      <Link to={`/admin/${admin.id}`}>
        <Image
          src="https://cdn.discordapp.com/attachments/1031369249345785886/1131656498670485614/SPOILER_logo.png"
          alt="logo"
          width={177}
        />
      </Link>
      <nav style={{ paddingRight: "15px" }}>
        <HStack>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<Icon as={ChevronDownIcon} boxSize={6} />}
              leftIcon={<AiOutlineUser size="20" />}
            >
              {admin.usuario}
            </MenuButton>
            <MenuList>
              <Link to={`/admin/${admin.id}/perfil`}>
                <MenuItem>
                  <InfoIcon mr="20px" /> Mi perfil
                </MenuItem>
              </Link>
              <Link to={`/`}>
                <MenuItem onClick={logout}>
                  <ArrowForwardIcon mr="20px" /> Logout
                </MenuItem>
              </Link>
            </MenuList>
          </Menu>
        </HStack>
      </nav>
    </>
  );
}
