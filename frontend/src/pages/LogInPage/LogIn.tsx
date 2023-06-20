import "./LogIn.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FloatingLabel } from "react-bootstrap";
import TopMenu from "../../components/TopMenu";
import { Fragment, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ApiError, login } from "../../utils/api";
import { Administrador } from "../../types";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css' ; 
import Alert from 'react-bootstrap/Alert';
import Cookies from "universal-cookie"; 



interface LoginState {
  correoOUsuario: string;
  clave: string;
}
function LogIn() {
  const navigate = useNavigate();
  const [state, setState] = useState<LoginState>({
    correoOUsuario: "",
    clave: "",
  });
  const { mutate, isError } = useMutation<Administrador, ApiError, LoginState>({
    mutationFn: ({ correoOUsuario, clave }) => login(correoOUsuario, clave),
    onSuccess: (admin) => navigate(`/administrador/${admin.id}`),
    
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    console.log(state);
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(state);
  
   
  };
  
  const advertencia= (message:string) => { 
    toast.warning(message, { 
      position: "top-center",
      autoClose:5000,
      progress:1, 
      closeOnClick: true, 
      hideProgressBar: false, 
      draggable: true
    })
  }

  const validation = () => { 
   
    if (state.correoOUsuario==='' || state.correoOUsuario===null) { 
      advertencia("El campo Usuario no puede estar vacio")
      
    }else {

    if (state.clave==='' || state.clave===null) { 
     advertencia("El campo contraseña no puede estar vacio")
    }
  }
   
      
  }

  return (
    <Fragment>
      
      <TopMenu />
      
      <div className="page">
        <div className="contenedor">
          <br />
          <div className="centrado">
            <h1>Bienvenido a CANCHAS.NET</h1>
            
          </div>
          <br />
          <br />
          <br />

          <div className="formulario">
            <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
              <Form.Group>
                <Container>
                  <Row>
                    <Col> </Col>
                    <Col>
                      <FloatingLabel
                        controlId="floatingCorreo"
                        label="Correo electrónico o usuario"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Correo electrónico o usuario"
                          name="correoOUsuario"
                          onChange={handleChange}
                          required
                        />
                      </FloatingLabel>
                    </Col>
                    <Col> </Col>
                  </Row>
                  <Row>
                    <Col> </Col>
                    <Col>
                      <FloatingLabel
                        controlId="floatingClave"
                        label="Contraseña"
                        className="mb-3"
                      >
                        <Form.Control
                          type="password"
                          placeholder="Contraseña"
                          name="clave"
                          onChange={handleChange}
                          required
                        />
                      </FloatingLabel>
                    </Col>
                    <Col> </Col>
                  </Row>
                </Container>
              </Form.Group>

              <div className="centrado">
                <button
                  type="submit"
                  className="btn btn-danger"
                  style={{ backgroundColor: "#FF604F" }}
                  onClick={validation}
                >
                  Iniciar Sesión
                </button>
                {isError &&  <Alert variant="danger" dismissible> Datos Incorrectos. Intente de Nuevo</Alert>}
              </div>
            </Form>
          </div>
        </div>
      </div>
    <ToastContainer/>
    </Fragment>
    
  );
}

export default LogIn;
