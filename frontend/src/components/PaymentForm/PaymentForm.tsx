import React, { useState } from "react";
import Cards, { Focused } from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

type FormState = {
  cvc: string,
  expiry: string,
  focus: any,
  name: string,
  number: string,
}

export default function PaymentForm() {
  const [state, setState] = useState<FormState>({
    cvc: "",
    expiry: "",
    focus: undefined,
    name: "",
    number: "",
  });

  const handleInputFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, focus: e?.target?.name });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setState({ ...state, name: value });
  };

  let c: Focused;
  return (
    <div id="PaymentForm">
      <Cards
        cvc={state.cvc}
        expiry={state.expiry}
        focused={state.focus}
        name={state.name}
        number={state.number}
      />
    </div>
  );
}
