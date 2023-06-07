import React from "react";
import "./AdmPage.css";
import PaymentForm from "../../components/PaymentForm/PaymentForm";


function AdmPage() {
  return (
    <div className="container col">
      <div>  
          <div className="prueba">  Tarjeta de credito </div>
          <div className="subtexto" >  
          <p> Se factura una cuota cada 30 días. </p>
          <p> Se puede dar de baja en cualquier momento. </p>
          
          
          </div>
          <div> 
              
          </div>
          <div className="tarjeta" >  <PaymentForm/> </div>



      </div>




      <div>  </div>
    </div>
  );
}

export default AdmPage;
