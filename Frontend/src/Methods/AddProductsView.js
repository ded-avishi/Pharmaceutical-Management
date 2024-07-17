import React from "react";
import { useState } from "react";

function AddProductsView(){
    const [Warehouse_ID, setWarehouseID] = useState('');
    const [Product_ID, setProductID] = useState('');
    const [quantity, setquantity] = useState(0);
    const [minThreshold, setminThreshold] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    const handleAdd = async (event) => {
        event.preventDefault();

        if(quantity < 0){
            setErrorMessage("You are trying to insert negative amount of items. Try again.");
            window.location.reload();
            return;
        }
        else if(quantity === 0){
            setErrorMessage("What's the point of adding 0 items?");
            window.location.reload();
            return;
        }
        if(minThreshold < 0){
            setErrorMessage("Threshold can't be negative")
            window.location.reload();
            return;
        }
    
        try {
          const response = await fetch('/api/AddProdInv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Warehouse_ID, Product_ID, quantity, minThreshold}),
          });
    
          const data = await response.json();
    
          if(response.ok){
            window.location.reload();
          }
          if (!response.ok) {
            setErrorMessage(data['error']);
            throw new Error(data['error']);
          }
          setWarehouseID('');
          setProductID('');
          setquantity(0);
          setminThreshold();
          setErrorMessage('');
        } catch (error) {
          setErrorMessage('Adding failed. Please check the details.');
        }
      };

    return (
        <div>
            <h2>Add More Products</h2>
            <form onSubmit={handleAdd}>
                <div>
                <label htmlFor="wID">Warehouse ID:</label>
                <input
                    type="text"
                    id="wID"
                    value={Warehouse_ID}
                    onChange={(e) => setWarehouseID(e.target.value)}
                />
                </div>
                <div>
                <label htmlFor="Product_ID">Product_ID:</label>
                <input
                    type="text"
                    id="Product_ID"
                    value={Product_ID}
                    onChange={(e) => setProductID(e.target.value)}
                />
                </div>
                <div>
                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setquantity(e.target.value)}
                />
                </div>
                <div>
                <label>Min Threshold:</label>
                <input
                    type="number"
                    value={minThreshold}
                    onChange={(e) => setminThreshold(e.target.value)}
                />
                </div>
                <br />
                <button type="submit">Add</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default AddProductsView;