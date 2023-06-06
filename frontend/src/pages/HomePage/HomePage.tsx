import React from 'react'
import { Button } from 'react-bootstrap'

function HomePage() {
  return (
    <div>
        <Button style={{backgroundColor:"white", borderColor:"white", color:"black", right:"130px", position:"absolute"}}>Suscripciones</Button>
        <button type="button" className="btn btn-outline-danger position-absolute end-0">Iniciar Sesion</button>
    </div>
  )
}

export default HomePage