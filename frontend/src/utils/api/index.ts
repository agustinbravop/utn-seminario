/*
import {Rocket} from 'react-bootstrap-icons';
import {Shop} from 'react-bootstrap-icons';
import {Buildings} from 'react-bootstrap-icons';

const opc: subs[] = [
  {
    icon: <Shop fill="#47A992" size={90} />,
    tipo: "Startup",
    price: 1999.0,
    countEst: 1,
    countEmp: 0,
  },
  {
    icon: <Buildings fill="#47A992" size={90} />,
    tipo: "Premium",
    price: 3999.0,
    countEst: 5,
    countEmp: 10,
  },
  {
    icon: <Rocket fill="#47A992" size={90} />,
    tipo: "Enterprise",
    price: 8999,
    countEst: 15,
    countEmp: 50,
  },
];
*/

import { Suscripcion } from "../../types";
const API_URL = process.env.REACT_APP_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  message: string;

  constructor(status: number, msg: string) {
    super(msg);
    this.message = msg;
    this.status = status;
  }
}

function reject(res?: Response): Promise<Response> {
  return Promise.reject(
    new ApiError(
      (res && res.status) || 0,
      (res && res.statusText) || "Ocurrió un error"
    )
  );
}

function init(method = "GET", token?: string) {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    mode: "cors" as RequestMode,
    cache: "default" as RequestCache,
  };
}

function request(method: string, endpoint: string, token?: string) {
  return new Request(endpoint, init(method, token));
}

export async function getSuscripciones(): Promise<Suscripcion[]> {
  return fetch(request("GET", `${API_URL}/suscripciones`))
    .then((response) => (response.ok ? response.json() : reject(response)))
    .catch((err) => {
      console.log(err);
      return reject(err);
    });
}
