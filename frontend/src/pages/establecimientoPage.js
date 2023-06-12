import React from "react";
import useFetch from '../hooks/useFetch';
import TopMenu from "../components/TopMenu";
import AgregarEstablecimiento from "../components/AgregarEstablecimiento";
import Establecimientos from "../components/Establecimientos";
import { urlApiEstablecimientos } from "../utils/constants";
import { getSuscripciones } from "../utils/api";

export default function establecimientoPage() {
    const establecimientos = useFetch(urlApiEstablecimientos, null);

  return (
    <div>
      <TopMenu />
      <AgregarEstablecimiento />
      <Establecimientos establecimientos={establecimientos} />
    </div>
  )
}