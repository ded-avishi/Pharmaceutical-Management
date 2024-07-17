import React from "react";
import { useState } from "react";

function DelProductsView(){
    const [ProdName, setProdName] = useState('');
    const [ProdID, setProdID] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAdd = async (event) => {
        event.preventDefault();

        if(ProdID < 0){
            setErrorMessage("Incorrect Batch No.");
            window.location.reload();
            setProdName('');
          setProdID('');
            return;
        }
    
        try {
          const response = await fetch('/api/DelProd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ProdID, ProdName}),
          });
    
          const data = await response.json();
    
          if(response.ok){
            window.location.reload();
          }
          if (!response.ok) {
            setErrorMessage(data['error']);
            throw new Error(data['error']);
          }
          setProdName('');
          setProdID('');
          setErrorMessage('');
        } catch (error) {
          setErrorMessage('Adding failed. Please check the details.');
        }
      };

    return (
        <div>
            <h2>Delete Product</h2>
            <form onSubmit={handleAdd}>
                <div>
                <label htmlFor="ProdID">Product ID:</label>
                <input
                    type="number"
                    id="ProdID"
                    value={ProdID}
                    onChange={(e) => setProdID(e.target.value)}
                />
                </div>
                <div>
                <label htmlFor="ProdName">Product Name:</label>
                <input
                    type="text"
                    id="ProdName"
                    value={ProdName}
                    onChange={(e) => setProdName(e.target.value)}
                />
                </div>
                <br />
                <button type="submit">Confirm Delete</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default DelProductsView;