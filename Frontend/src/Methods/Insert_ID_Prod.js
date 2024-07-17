import React, { useState, useEffect } from 'react';
import ItemCount from '../Design Elements/Increment';
import { useNavigate } from 'react-router-dom';
import logo from './Group 1261155243.png'; // Import your image

function ProductList2() {
    const [prod_data, setProd] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const products = [];
    let upd_list = {};
    let new_upd_list = {};

    const navigate = useNavigate();

    const prodClick = (id, quantity) => {
        upd_list[id] = quantity;
    };

    const logout = async () => {
        const user = localStorage.getItem('curr_userID');
        // Navigate to a new page
        const response = await fetch('/api/user_update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ upd_list, user }),
        });
        navigate('/');
    };

    const handleClick = async () => {
        const user = localStorage.getItem('curr_userID');
        // Navigate to a new page
        const response = await fetch('/api/user_update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ upd_list, user }),
        });
        navigate('/user_cart');
    };

    const handleMedicine = async () => {
        const user = localStorage.getItem('curr_userID');
        // Navigate to a new page
        const response = await fetch('/api/user_update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ upd_list, user }),
        });
        navigate('/user_medicine');
    };

    const handleEquipment = async () => {
        const user = localStorage.getItem('curr_userID');
        // Navigate to a new page
        const response = await fetch('/api/user_update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ upd_list, user }),
        });
        navigate('/user_equipment');
    };

    useEffect(() => {
        const fetchData = async () => {
            const formData = { 'city': localStorage.getItem('curr_city'), 'user': localStorage.getItem('curr_userID') }
            const queryString = new URLSearchParams(formData);
            const url = `/api/retrieveP_byID?${queryString}`;
            const response = await fetch(url);
            const fetchedData = await response.json();
            setProd(fetchedData);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    if (isLoading === false) {
        for (let i = 0; i < prod_data.more_data.length; i++) {
            new_upd_list[prod_data.more_data[i][0]] = prod_data.more_data[i][1];
        }

        for (let i = 0; i < prod_data.data.length; i++) {
            products.push({
                id: prod_data.data[i][0], name: prod_data.data[i][1],
                brand: prod_data.data[i][2], feedback: prod_data.data[i][3], price: prod_data.data[i][4], description: prod_data.data[i][5],
                quantity: prod_data.data[i][6]
            });
        }
    }

    return (
        <div className="table-container" style={{ marginBottom: '50px'}}>
            
            <img src={logo} alt="Logo" style={{ width: '100vw', height: 'auto' }} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '-120px', left: '-50px' }}>
                <button className="top-right-button" onClick={logout} style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '16px 24px', gap: '10px', border: '2px solid #000000', borderRadius: '64px', backgroundColor: 'white', color: 'black', fontFamily: 'Exo', fontStyle: 'normal', fontWeight: '600', fontSize: '16px', lineHeight: '21px', cursor: 'pointer' }}>Logout</button>
            </div>

            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>List of Products Available in your City {localStorage.getItem('curr_city')}</h1>
            <table className="product-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Brand</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Feedback</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Price</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Description</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Max Quantity</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Add or Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id}>
                            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>{product.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>{product.brand}</td>
                            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>{product.feedback}</td>
                            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>${product.price}</td>
                            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>{product.description}</td>
                            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>{product.quantity}</td>
                            <td style={{ border: '1px solid #ddd', padding: '0', textAlign: 'left' }}>
                                <ItemCount onClick={(count) => prodClick(product.id, count)} id={product.id} initialCount={new_upd_list.hasOwnProperty(product.id) ? new_upd_list[product.id] : 0} finalCount={product.quantity} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <button style={{ backgroundColor: '#000', color: '#fff', padding: '15px 30px', margin: '8px 0', border: 'none', borderRadius: '50px', cursor: 'pointer', fontFamily: 'Exo', fontStyle: 'normal', fontWeight: '500', fontSize: '18px', lineHeight: '21px' }} onClick={handleClick}>Checkout</button>
            </div>
        </div>
  );
  
  
  
}

export default ProductList2;
