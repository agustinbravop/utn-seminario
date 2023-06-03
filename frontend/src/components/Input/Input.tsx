import React from 'react'

export default function InputMail() {
  return (
    <form
    onSubmit={(e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
        email: { value: string };
        password: { value: string };
        };
        const email = target.email.value;
        const password = target.password.value;
    }}
    >
  <div>
    <label>
      Correo:
      <input type="email" name="email" />
    </label>
  </div>
  <div>
    <label>
      Contraseña:
      <input type="password" name="password" />
    </label>
  </div>
  <div>
    <input type="submit" value="Ingresar" />
  </div>
</form>
  )
};
