import React from "react";
import { useState } from "react";

function ProductsView(){
    const [BatchNo, setBatchNo] = useState('');
    const [ProdName, setProdName] = useState('');
    const [Brand, setBrand] = useState('');
    const [Price, setPrice] = useState();
    const [ProdDescr, setProdDescr] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [ProdType, setProdType] = useState('');

    const handleAdd = async (event) => {
        event.preventDefault();

        if(BatchNo < 0){
            setErrorMessage("Incorrect Batch No.");
            window.location.reload();
            setBatchNo();
          setBrand('');
          setPrice();
          setProdName('');
          setProdDescr('');
          setProdType('');
            return;
        }
        if(Price <= 0){
            setErrorMessage("Price has to be Positive")
            window.location.reload();
            setBatchNo();
          setBrand('');
          setPrice();
          setProdName('');
          setProdDescr('');
          setProdType('');
            return;
        }

        if(ProdType != 'Medicine' || ProdType != 'Equipment'){
            setErrorMessage("Product Type can only be Medicine or Equipment")
            window.location.reload();
            setBatchNo();
          setBrand('');
          setPrice();
          setProdName('');
          setProdDescr('');
          setProdType('');
            return;
        }
    
        try {
          const response = await fetch('/api/RegProd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ BatchNo, Price, ProdDescr, ProdName, Brand, ProdType}),
          });
    
          const data = await response.json();
    
          if(response.ok){
            window.location.reload();
          }
          if (!response.ok) {
            setErrorMessage(data['error']);
            throw new Error(data['error']);
          }
          setBatchNo();
          setBrand('');
          setPrice();
          setProdName('');
          setProdDescr('');
          setProdType('');
          setErrorMessage('');
        } catch (error) {
          setErrorMessage('Adding failed. Please check the details.');
        }
      };

    return (
        <div>
            <h2>Register New Products</h2>
            <form onSubmit={handleAdd}>
                <div>
                <label htmlFor="ProdName">Product Name:</label>
                <input
                    type="text"
                    id="ProdName"
                    value={ProdName}
                    onChange={(e) => setProdName(e.target.value)}
                />
                </div>
                <div>
                <label htmlFor="Price">Price:</label>
                <input
                    type="number"
                    id="Price"
                    value={Price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                </div>
                <div>
                <label htmlFor="Brand">Brand:</label>
                <input
                    type="text"
                    id = "Brand"
                    value={Brand}
                    onChange={(e) => setBrand(e.target.value)}
                />
                </div>
                <div>
                <label>Product Description:</label>
                <input
                    type="text"
                    value={ProdDescr}
                    onChange={(e) => setProdDescr(e.target.value)}
                />
                </div>
                <div>
                <label>Batch No:</label>
                <input
                    type="number"
                    value={BatchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                />
                </div>
                <div>
                <label>Product Type:</label>
                <input
                    type="text"
                    value={ProdType}
                    onChange={(e) => setProdType(e.target.value)}
                />
                </div>
                <br />
                <button type="submit">Register</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default ProductsView;