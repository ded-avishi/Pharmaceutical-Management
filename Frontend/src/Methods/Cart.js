import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import ItemCount2 from '../Design Elements/CartIncrement';
import logo from './Group 1261155243.png'; 

function Cart(){
    const [prod_data, setProd] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoading2, setIsLoading2] = useState(true);
    const products = [];
    let upd_list = {};
    const [discount,setDiscount ] = useState();
    const discounts = [];
    var [discountCode, setDiscountCode] = useState('');
    var [totalPrice, setTotalPrice] = useState(0);
    console.log(discountCode);


    const navigate = useNavigate();

    const prodClick = (id, quantity) => {
        upd_list[id] = quantity;
    }

    const handleDiscount = (event) => {
      setDiscountCode(event.target.value);
    }

    const logout = async () => {
      const user = localStorage.getItem('curr_userID');
        // Navigate to a new page
        const response = await fetch('/api/user_update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ upd_list, user }),
        });
        navigate('/');
    }

    useEffect(() => {
        const fetchData = async () => {
        const formData = {'city' : localStorage.getItem('curr_city'), 'user': localStorage.getItem('curr_userID')}
        const queryString = new URLSearchParams(formData);
        const url = `/api/cart?${queryString}`;  
        const response = await fetch(url);
        const fetchedData = await response.json();
        setProd(fetchedData);
        setIsLoading(false);
        const url2 = `/api/discountGet`;
        const response2 = await fetch(url2);
        const fetchedData2 = await response2.json();
        setDiscount(fetchedData2);
        setIsLoading2(false);
        
    }


    fetchData();
    }, []);

    const handleClick = async () => {
        const user = localStorage.getItem('curr_userID');
        // Navigate to a new page
        const response = await fetch('/api/user_update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ upd_list, user }),
        });
        navigate('/prod_disp');
    };

    const handlePurchase = async () => {
        const user = localStorage.getItem('curr_userID');
        const city = localStorage.getItem('curr_city')
        let bill = {}
        for(let i = 0; i < prod_data.data.length; i++){
            if(upd_list.hasOwnProperty(prod_data.data[i][0])){
                if(upd_list[prod_data.data[i][0]] !== 0){
                    bill[prod_data.data[i][0]] = upd_list[prod_data.data[i][0]];
                }
            }
            else{
                bill[prod_data.data[i][0]] = prod_data.data[i][3];
            }
        }

        const response2 = await fetch('/api/user_update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ upd_list, user }),
        });

        // Navigate to a new page
        const response = await fetch('/api/user_purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bill, user, city}),
        });

        navigate('/prod_disp');
    };

  if(isLoading === false){

    for(let i = 0; i < prod_data.data.length; i++){
        products.push({id:prod_data.data[i][0], name: prod_data.data[i][1],
        brand: prod_data.data[i][2], quantity:prod_data.data[i][3], price: prod_data.data[i][4], 
        max_quant: prod_data.data[i][5]});
    }
  }

  if (isLoading2 === false){
    for (let i = 0; i < discount.data.length;i++){
      discounts.push({code:discount.data[i][0],percent:discount.data[i][1],min_purchase:discount.data[i][2]});
      
    }
  }

  products.forEach((product) => {
      totalPrice += product.price * product.quantity;
  });


  const discountsWithMinPurchaseMet = discounts.filter(discount => totalPrice >= discount.min_purchase);

  discounts.forEach((discount) => {
    if (discount.code === discountCode) {
      totalPrice = totalPrice - (totalPrice * (discount.percent / 100));
    }
  });

  return (
    <div className='table-container'>
      <img src={logo} alt="Logo" style={{ width: '100vw', height: 'auto' }} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '-120px', left: '-50px' }}>
        <button className="top-right-button" onClick={logout} style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '16px 24px', gap: '10px', border: '2px solid #000000', borderRadius: '64px', backgroundColor: 'white', color: 'black', fontFamily: 'Exo', fontStyle: 'normal', fontWeight: '600', fontSize: '16px', lineHeight: '21px', cursor: 'pointer' }}>Logout</button>
      </div>
      <h1 style={{ textAlign: 'center' }}>Your Cart</h1>
      <div className="table-wrapper">
        <table className="cart-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Brand</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Price</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.brand}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>${product.price}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <ItemCount2 onClick={(count) => prodClick(product.id, count)} id={product.id} initialCount={product.quantity} finalCount={product.max_quant} Price={product.price} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-wrapper">
        <table className="cart-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Discount Code</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Discount Percentage</th>
            </tr>
          </thead>
          <tbody>
            { discountsWithMinPurchaseMet.map((product) => (
              <tr key={product.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.code}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <label>Discount Code</label>
        <input 
        value = {discountCode}
        onChange = {(e) => setDiscountCode(e.target.value)}
        type="text" 
        />
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
      <h2>Discount : {discountCode}</h2>
        <button style={{ backgroundColor: '#000', color: '#fff', padding: '15px 30px', margin: '8px', border: 'none', borderRadius: '50px', cursor: 'pointer', fontFamily: 'Exo', fontStyle: 'normal', fontWeight: '500', fontSize: '18px', lineHeight: '21px' }} onClick={handleClick}>Back</button>
        <button style={{ backgroundColor: '#000', color: '#fff', padding: '15px 30px', margin: '8px', border: 'none', borderRadius: '50px', cursor: 'pointer', fontFamily: 'Exo', fontStyle: 'normal', fontWeight: '500', fontSize: '18px', lineHeight: '21px' }} onClick={handlePurchase}>Confirm Purchase</button>
      </div>
    </div>
  );

  
  
}

export default Cart;