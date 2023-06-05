import React, { Fragment } from 'react'
import InputMail from './components/Input'
import Title from './components/Title'
import TopMenu from './components/TopMenu';

function App() {
  return (
    <div>
      <TopMenu />
        <Fragment>
          <Title>Iniciar Sesion</Title>
          <InputMail></InputMail>
        </Fragment>
    </div>
  )
}

export default App